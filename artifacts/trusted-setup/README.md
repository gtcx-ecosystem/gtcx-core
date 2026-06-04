# Trusted-setup transcript (ZKP / D3)

**Story:** CORE-004 · **Moat:** D3 M3.2  
**Not the same as:** INF-86 **XR-402** gh-bog KMS ceremony in `gtcx-protocols` (sovereign signing keys).

## Layout

| Path | Status | Purpose |
| ---- | ------ | ------- |
| `transcript.seed` | **pending** (gitignored when published) | 32-byte ceremony entropy — see `rust/gtcx-zkp/src/trusted_setup.rs` |
| `manifest.json` | **pending** | Ceremony ID, participant count, SHA-256 of transcript, pinned VK hashes per circuit |

## Verification

```bash
cd rust && cargo test -p gtcx-zkp --features trusted-setup-verify --release
```

When `transcript.seed` is published, CI will add a gate that re-derives each circuit VK and compares to `artifacts/kat/*.kat.json` `vk_hash` fields.

## Evidence index

Registered in [docs/audit/evidence/README.md](../../docs/audit/evidence/README.md) (CORE-004 row).
