# gtcx-network

P2P networking types with topic-based pub/sub messaging.

## Usage

```toml
[dependencies]
gtcx-network = "0.1"
```

```rust
use gtcx_network::{PeerId, Topic, Message, TopicManager};

let peer = PeerId::from_public_key(b"pubkey-bytes");
let mut mgr = TopicManager::new();
mgr.subscribe(Topic::blocks());
mgr.subscribe(Topic::transactions());

let msg = Message::new(peer, Topic::blocks(), b"block-data".to_vec());
```

## Standard Topics

`blocks`, `transactions`, `consensus`, `discovery`

## License

MIT
