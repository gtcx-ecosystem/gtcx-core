# Trusted-setup transcript (ZKP / D3)

**Story:** CORE-004 · **Moat:** D3 M3.2  
**Not the same as:** INF-86 **XR-402** gh-bog KMS ceremony in `gtcx-protocols` (sovereign signing keys).

## Layout

| Path | Status | Purpose |
| ---- | ------ | ------- |
| `transcript.seed` | **pending** (gitignored when published) | 32-byte ceremony entropy — see `rust/gtcx-zkp/03-platform/src/trusted_setup.rs` |
| `manifest.json` | **pending** | Ceremony ID, participant count, SHA-256 of transcript, pinned VK hashes per circuit |

## Verification

```bash
cd rust && cargo test -p gtcx-zkp --features trusted-setup-verify --release
```

When `transcript.seed` is published, run the publish gate:

```bash
pnpm ops:trusted-setup:verify-publish
```

CI runs the KAT pin test when the file exists:

```bash
cargo test -p gtcx-zkp --features trusted-setup-verify --release -- groth16_kat_pins_match_published_transcript
```

Manifest template: [01-docs/05-audit/evidence/trusted-setup-manifest.template.json](../../01-docs/05-audit/evidence/trusted-setup-manifest.template.json).

## Evidence index

Registered in [01-docs/05-audit/evidence/README.md](../../01-docs/05-audit/evidence/README.md) (CORE-004 row).
