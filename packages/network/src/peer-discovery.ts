import type { PeerInfo, PeerId } from './types';

export interface DiscoveredPeer extends PeerInfo {
  lastSeen: number;
  score?: number;
}

export interface PeerDiscoveryConfig {
  maxPeers?: number;
  peerExchangeEnabled?: boolean;
  dnsEnabled?: boolean;
  mdnsEnabled?: boolean;
  bluetoothEnabled?: boolean;
}

export interface PeerDiscoveryAdapter {
  name: string;
  discover(): Promise<PeerInfo[]>;
}

export class PeerReputationManager {
  private scores = new Map<PeerId, number>();

  recordSuccess(peerId: PeerId): void {
    const current = this.scores.get(peerId) ?? 0;
    this.scores.set(peerId, Math.min(current + 1, 100));
  }

  recordFailure(peerId: PeerId): void {
    const current = this.scores.get(peerId) ?? 0;
    this.scores.set(peerId, Math.max(current - 5, -100));
  }

  getScore(peerId: PeerId): number {
    return this.scores.get(peerId) ?? 0;
  }
}

export class PeerDiscoveryService {
  private readonly discoveredPeers = new Map<PeerId, DiscoveredPeer>();

  constructor(
    private readonly adapters: PeerDiscoveryAdapter[],
    private readonly reputationManager: PeerReputationManager,
    private readonly config: PeerDiscoveryConfig = {}
  ) {}

  async discoverPeers(): Promise<DiscoveredPeer[]> {
    const discovered: DiscoveredPeer[] = [];
    for (const adapter of this.adapters) {
      const peers = await adapter.discover();
      for (const peer of peers) {
        const merged: DiscoveredPeer = {
          ...peer,
          lastSeen: Date.now(),
          score: this.reputationManager.getScore(peer.id),
        };
        this.discoveredPeers.set(peer.id, merged);
        discovered.push(merged);
      }
    }

    const maxPeers = this.config.maxPeers ?? 100;
    return discovered.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, maxPeers);
  }

  getKnownPeers(): DiscoveredPeer[] {
    return Array.from(this.discoveredPeers.values());
  }
}

export class MemoryPeerDiscoveryAdapter implements PeerDiscoveryAdapter {
  name = 'memory';
  constructor(private readonly peers: PeerInfo[]) {}

  async discover(): Promise<PeerInfo[]> {
    return this.peers;
  }
}
