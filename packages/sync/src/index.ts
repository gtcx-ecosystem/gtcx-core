export * from './types';

import type {
  ISyncEngine,
  SyncEngineConfig,
  SyncAuditEvent,
  SyncConflict,
  SyncItem,
  SyncMetrics,
  SyncOptions,
  SyncResult,
  SyncStatus,
} from './types';

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 1_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function resolveConflict<T>(
  strategy: SyncOptions['strategy'],
  localItems: SyncItem<T>[],
  remoteItem?: SyncItem<T>
): { resolved: boolean; winner?: SyncItem<T> } {
  const candidates = remoteItem ? [...localItems, remoteItem] : [...localItems];
  if (candidates.length === 0) {
    return { resolved: true };
  }

  switch (strategy) {
    case 'last-write-wins': {
      const winner = candidates.reduce((best, current) =>
        current.updatedAt > best.updatedAt
          ? current
          : current.updatedAt === best.updatedAt && current.version > best.version
            ? current
            : best
      );
      return { resolved: true, winner };
    }
    case 'highest-version': {
      const winner = candidates.reduce((best, current) =>
        current.version > best.version
          ? current
          : current.version === best.version && current.updatedAt > best.updatedAt
            ? current
            : best
      );
      return { resolved: true, winner };
    }
    case 'server-wins': {
      if (remoteItem) {
        return { resolved: true, winner: remoteItem };
      }
      const winner = candidates.reduce((best, current) =>
        current.updatedAt < best.updatedAt ? current : best
      );
      return { resolved: true, winner };
    }
    case 'append-only':
    case 'chain-validated':
      return { resolved: false };
    default:
      return { resolved: false };
  }
}

async function retry<T>(fn: () => Promise<T>, attempts: number, delayMs: number): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(delayMs * (attempt + 1));
      }
    }
  }
  throw lastError;
}

export function createSyncEngine<T = unknown>(config: SyncEngineConfig<T> = {}): ISyncEngine {
  let status: SyncStatus = 'idle';
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (status === 'syncing') {
      status = 'cancelled';
    }
  };

  const sync = async (items: SyncItem<T>[], options: SyncOptions): Promise<SyncResult> => {
    cancelled = false;
    status = 'syncing';
    const startedAt = Date.now();
    const errors: string[] = [];
    let conflicts = 0;
    let resolved = 0;
    let uploaded = 0;
    let downloaded = 0;
    let remoteFetched = 0;

    const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    const retryAttempts = options.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
    const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

    const emitAudit = async (event: Omit<SyncAuditEvent<T>, 'timestamp' | 'strategy'>) => {
      if (!config.onAudit) return;
      try {
        await config.onAudit({
          timestamp: new Date().toISOString(),
          strategy: options.strategy,
          ...event,
        });
      } catch (error) {
        errors.push((error as Error).message || 'Audit hook failed');
      }
    };

    const emitMetrics = async (metrics: SyncMetrics) => {
      if (!config.onMetrics) return;
      try {
        await config.onMetrics(metrics);
      } catch (error) {
        errors.push((error as Error).message || 'Metrics hook failed');
      }
    };

    const localMap = new Map<string, SyncItem<T>[]>();
    for (const item of items) {
      const list = localMap.get(item.id) ?? [];
      list.push(item);
      localMap.set(item.id, list);
    }

    try {
      await emitAudit({
        type: 'sync.start',
        metadata: { totalItems: items.length, uniqueIds: localMap.size },
      });

      if (cancelled) {
        status = 'cancelled';
        errors.push('Sync cancelled');
        await emitAudit({ type: 'sync.cancelled' });
      } else {
        const ids = Array.from(localMap.keys()).sort();
        const remoteItems = config.fetchRemote
          ? await retry(() => config.fetchRemote!(ids), retryAttempts, retryDelayMs)
          : [];
        remoteFetched = remoteItems.length;
        const remoteMap = new Map<string, SyncItem<T>>();
        for (const remoteItem of remoteItems) {
          remoteMap.set(remoteItem.id, remoteItem);
        }

        const toUpload: SyncItem<T>[] = [];
        const toDownload: SyncItem<T>[] = [];

        for (const id of ids) {
          const localItems = localMap.get(id) ?? [];
          const remoteItem = remoteMap.get(id);
          const hasConflict = localItems.length > 1 || (remoteItem && localItems.length > 0);
          const conflict: SyncConflict<T> = { id, local: localItems, remote: remoteItem };
          if (hasConflict) {
            conflicts += 1;
            await emitAudit({
              type: 'sync.conflict',
              id,
              localCount: localItems.length,
              remotePresent: Boolean(remoteItem),
            });
            if (config.onConflict) {
              await config.onConflict(conflict);
            }
          }

          let resolution = resolveConflict(options.strategy, localItems, remoteItem);
          if ((!resolution.resolved || !resolution.winner) && config.resolveConflict) {
            const resolvedItem = await config.resolveConflict(conflict);
            if (resolvedItem) {
              resolution = { resolved: true, winner: resolvedItem };
            }
          }
          if (!resolution.resolved || !resolution.winner) {
            if (hasConflict) {
              errors.push(`Unresolved conflict for ${id}`);
              await emitAudit({
                type: 'sync.unresolved',
                id,
                localCount: localItems.length,
                remotePresent: Boolean(remoteItem),
              });
            }
            continue;
          }

          await emitAudit({
            type: 'sync.resolved',
            id,
            localCount: localItems.length,
            remotePresent: Boolean(remoteItem),
            winner: resolution.winner,
          });

          if (remoteItem && resolution.winner === remoteItem) {
            toDownload.push(remoteItem);
          } else {
            toUpload.push(resolution.winner);
          }

          if (hasConflict) {
            resolved += 1;
          }
        }

        if (config.pushLocal && toUpload.length > 0) {
          for (const batch of chunk(toUpload, batchSize)) {
            await retry(() => config.pushLocal!(batch), retryAttempts, retryDelayMs);
          }
        }

        if (config.onResolved && toDownload.length > 0) {
          await config.onResolved(toDownload);
        }

        uploaded = toUpload.length;
        downloaded = toDownload.length;
        status = 'idle';
        await emitAudit({
          type: 'sync.complete',
          metadata: {
            uploaded,
            downloaded,
            conflicts,
            resolved,
          },
        });
      }
    } catch (error) {
      status = 'error';
      const message = (error as Error).message || 'Sync failed';
      errors.push(message);
      await emitAudit({ type: 'sync.failed', error: message });
    }

    const finishedAt = Date.now();
    await emitMetrics({
      strategy: options.strategy,
      batchSize,
      retryAttempts,
      retryDelayMs,
      totalItems: items.length,
      uniqueIds: localMap.size,
      remoteFetched,
      uploaded,
      downloaded,
      conflicts,
      resolved,
      errors: errors.length,
      durationMs: finishedAt - startedAt,
      startedAt,
      finishedAt,
      status,
    });

    return {
      uploaded,
      downloaded,
      conflicts,
      resolved,
      errors,
      durationMs: finishedAt - startedAt,
    };
  };

  return {
    sync,
    getStatus: () => status,
    cancel,
  };
}
