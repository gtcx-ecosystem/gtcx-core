# gtcx-edge (Rust)

Edge runtime utilities for GTCX deployments targeting constrained environments — low-memory devices, offline-capable edge nodes, and hardware integrations.

## Scope

| Responsibility             | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| Edge runtime primitives    | Utilities for constrained environments (low RAM, no persistent connection) |
| Offline queue management   | Durable local buffering for events and credentials pending sync            |
| Hardware integration hooks | Interfaces for `gtcx-hardware` (TapKit, VaultKit) device integration       |

## Status

Planned — foundational utilities implemented. TypeScript binding and hardware integration are planned for the edge deployment phase.

## Planned Integration

When active, this crate will support:

- `@gtcx/sync` — providing native offline queue persistence on edge devices
- `9-hardware` (`gtcx-hardware`) — TapKit and VaultKit device-side runtime

## Notes

- No TypeScript binding exists yet — this crate is not accessible from Node.js.
- Edge deployment targets are defined in the hardware certification specs (`9-hardware`).
- Offline-first design aligns with `@gtcx/sync` conflict resolution strategies; native persistence replaces in-memory queue on resource-constrained devices.

## References

- `SOP/2-docs/2-specs/packages/sync.md`
- `SOP/2-docs/2-specs/packages/connectivity.md`
- `rust/gtcx-edge/`
