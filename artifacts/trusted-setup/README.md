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

When `transcript.seed` is published, CI runs the KAT pin test:

```bash
cargo test -p gtcx-zkp --features trusted-setup-verify --release -- groth16_kat_pins_match_published_transcript
```

Manifest template: [docs/audit/evidence/trusted-setup-manifest.template.json](../../docs/audit/evidence/trusted-setup-manifest.template.json).

## Evidence index

Registered in [docs/audit/evidence/README.md](../../docs/audit/evidence/README.md) (CORE-004 row).
