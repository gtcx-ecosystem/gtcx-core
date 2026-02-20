export * from './types';

import type {
  ISyncEngine,
  SyncEngineConfig,
  SyncItem,
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
    const start = Date.now();
    const errors: string[] = [];
    let conflicts = 0;
    let resolved = 0;
    let uploaded = 0;
    let downloaded = 0;

    const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    const retryAttempts = options.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
    const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

    const localMap = new Map<string, SyncItem<T>[]>();
    for (const item of items) {
      const list = localMap.get(item.id) ?? [];
      list.push(item);
      localMap.set(item.id, list);
    }

    try {
      if (cancelled) {
        status = 'cancelled';
        return {
          uploaded,
          downloaded,
          conflicts,
          resolved,
          errors: ['Sync cancelled'],
          durationMs: Date.now() - start,
        };
      }

      const ids = Array.from(localMap.keys());
      const remoteItems = config.fetchRemote
        ? await retry(() => config.fetchRemote!(ids), retryAttempts, retryDelayMs)
        : [];
      const remoteMap = new Map<string, SyncItem<T>>();
      for (const remoteItem of remoteItems) {
        remoteMap.set(remoteItem.id, remoteItem);
      }

      const toUpload: SyncItem<T>[] = [];
      const toDownload: SyncItem<T>[] = [];

      for (const [id, localItems] of localMap.entries()) {
        const remoteItem = remoteMap.get(id);
        const hasConflict = localItems.length > 1 || (remoteItem && localItems.length > 0);
        if (hasConflict) {
          conflicts += 1;
        }

        const resolution = resolveConflict(options.strategy, localItems, remoteItem);
        if (!resolution.resolved || !resolution.winner) {
          if (hasConflict) {
            errors.push(`Unresolved conflict for ${id}`);
          }
          continue;
        }

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
    } catch (error) {
      status = 'error';
      errors.push((error as Error).message || 'Sync failed');
    }

    return {
      uploaded,
      downloaded,
      conflicts,
      resolved,
      errors,
      durationMs: Date.now() - start,
    };
  };

  return {
    sync,
    getStatus: () => status,
    cancel,
  };
}
