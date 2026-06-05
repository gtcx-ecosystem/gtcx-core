#!/usr/bin/env node
/** Print shell snippet to run `agent` without pnpm. */
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'bin');
console.log(`# Add to ~/.zshrc (gtcx-core agent CLI — no pnpm prefix):
export PATH="${bin}:$PATH"

# Then from any directory:
#   cd /path/to/gtcx-core && agent start
`);
