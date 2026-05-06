#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(packageDir, '..', '..');
const rustDir = path.join(repoRoot, 'rust');
const cargoTarget = process.env.CARGO_BUILD_TARGET;
const targetDir = cargoTarget
  ? path.join(rustDir, 'target', cargoTarget, 'release')
  : path.join(rustDir, 'target', 'release');
const outDir = path.join(packageDir, 'native');
const outFile = path.join(outDir, 'gtcx_node.node');

function findArtifact() {
  const candidates = [
    path.join(targetDir, 'gtcx_node.node'),
    path.join(targetDir, 'libgtcx_node.dylib'),
    path.join(targetDir, 'libgtcx_node.so'),
    path.join(targetDir, 'gtcx_node.dll'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  if (!fs.existsSync(targetDir)) {
    return null;
  }

  const entries = fs.readdirSync(targetDir);
  for (const entry of entries) {
    if (!entry.includes('gtcx_node')) continue;
    if (!/\.(node|dylib|so|dll)$/.test(entry)) continue;
    return path.join(targetDir, entry);
  }

  return null;
}

const cargoArgs = ['cargo', 'build', '-p', 'gtcx-node', '--release'];
if (cargoTarget) {
  cargoArgs.push('--target', cargoTarget);
}

execSync(cargoArgs.join(' '), { cwd: rustDir, stdio: 'inherit' });

const artifact = findArtifact();
if (!artifact) {
  throw new Error('Could not locate gtcx-node native artifact in rust/target/release');
}

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(artifact, outFile);

console.log(`Native bindings copied to ${path.relative(repoRoot, outFile)}`);
