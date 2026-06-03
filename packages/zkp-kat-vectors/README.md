# @gtcx/zkp-kat-vectors

GTCX ZKP Known Answer Test (KAT) vectors for cross-implementation validation and regression testing.

## Contents

This package exports canonical KAT artifacts for all supported ZKP circuits:

### Groth16

- `groth16-gci-threshold` — GCI threshold compliance proof
- `groth16-asset-ownership` — Asset ownership proof
- `groth16-location-region` — Location region proof
- `groth16-commodity-origin` — Commodity origin proof
- `groth16-gh-gold-origin` — Commodity origin profile alias (gh-gold-origin policy pack; same R1CS)

### Bulletproofs

- `bulletproofs-amount-range` — Amount range proof
- `bulletproofs-commodity-range` — Commodity range proof

## Usage

```typescript
import { groth16GciThreshold, type Groth16KatArtifact } from '@gtcx/zkp-kat-vectors';

const kat: Groth16KatArtifact = groth16GciThreshold;
console.log(kat.vk_hash);
console.log(kat.proof_bytes);
```

Or access all artifacts by name:

```typescript
import { katArtifacts, katCircuitNames } from '@gtcx/zkp-kat-vectors';

for (const name of katCircuitNames) {
  const artifact = katArtifacts[name];
  console.log(`${name}: proof=${artifact.proof_bytes.length} bytes`);
}
```

## Versioning

KAT vectors follow semantic versioning. Minor bumps indicate new vectors or metadata fields. Patch bumps indicate corrections to existing vectors. Major bumps indicate circuit breaking changes.

## Regenerating Vectors

```bash
cd rust/gtcx-zkp
cargo run --bin generate-kat -- gci-threshold
cargo run --bin generate-kat -- asset-ownership
cargo run --bin generate-kat -- location-region
cargo run --bin generate-kat -- commodity-origin
cargo run --bin generate-kat -- gh-gold-origin
cargo run --bin generate-kat -- bulletproofs-amount
cargo run --bin generate-kat -- bulletproofs-commodity
```

Then copy `artifacts/kat/*.kat.json` into `packages/zkp-kat-vectors/src/data/`.
