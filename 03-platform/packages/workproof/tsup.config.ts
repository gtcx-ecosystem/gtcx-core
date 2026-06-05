import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    'evidence/index': 'src/evidence/index.ts',
    'predicates/index': 'src/predicates/index.ts',
    'workproof/index': 'src/workproof/index.ts',
    'ai/index': 'src/ai/index.ts',
    'tradecv/index': 'src/tradecv/index.ts',
    'disclosure/index': 'src/disclosure/index.ts',
    'offline/index': 'src/offline/index.ts',
    'trust/index': 'src/trust/index.ts',
    'witness/index': 'src/witness/index.ts',
    'circuit-profiles/index': 'src/circuit-profiles/index.ts',
  },
  external: ['@gtcx/crypto', '@gtcx/types', '@gtcx/verification', 'zod'],
});
