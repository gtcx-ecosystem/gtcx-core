# gtcx-consensus

Weighted PBFT consensus engine for multi-stakeholder verification networks.

## Usage

```toml
[dependencies]
gtcx-consensus = "0.1"
```

```rust
use gtcx_consensus::{ConsensusEngine, StakeholderType};

let mut engine = ConsensusEngine::new();
engine.register_validator("gov-1", StakeholderType::Government);
engine.register_validator("vault-1", StakeholderType::Vault);

let id = engine.propose(b"approve-lot-001").unwrap();
engine.vote(id, "gov-1", true).unwrap();
```

## Stakeholder Weights

| Type       | Default Weight |
| ---------- | -------------- |
| Government | 40             |
| Vault      | 30             |
| Industry   | 20             |
| Technical  | 10             |

Quorum: 2/3 of total weight + 1.

## License

MIT
