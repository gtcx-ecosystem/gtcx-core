#!/usr/bin/env node
/**
 * Protocol 22 — deterministic next-work selection for gtcx-core.
 * Reads docs/audit/moat-dimension-roadmap-10-10.md; emits JSON to stdout.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const ROADMAP_PATH = join(
  REPO_ROOT,
  "docs/audit/moat-dimension-roadmap-10-10.md"
);
const SESSION_PATH = join(REPO_ROOT, ".baseline/memory/session.md");

/** Dimensions ordered by selection priority. */
const DIMENSION_ORDER = [
  { id: "D1",  critical: true,  name: "Circuit Correctness" },
  { id: "D2",  critical: false, name: "Bulletproofs Range" },
  { id: "D3",  critical: false, name: "Trusted Setup" },
  { id: "D4",  critical: false, name: "Backward Compat" },
  { id: "D5",  critical: false, name: "RNG / Entropy" },
  { id: "D6",  critical: true,  name: "KAT / Interop" },
  { id: "D7",  critical: false, name: "Side-Channel" },
  { id: "D8",  critical: false, name: "Formal Verification", external: true },
  { id: "D9",  critical: false, name: "Third-Party Audit", external: true },
  { id: "D10", critical: false, name: "Primitive Compliance" },
];

function parseRoadmapScores(md) {
  const scores = new Map();
  // Look for "**Current:** N/10" under each Dimension header
  const dimRe = /## Dimension (\d+):[\s\S]*?\*\*Current:\*\*\s*(\d+(?:\.\d+)?)\/10/g;
  let m;
  while ((m = dimRe.exec(md)) !== null) {
    scores.set(`D${m[1]}`, parseFloat(m[2]));
  }
  // Also try "D1 = 9" or "D1: 9" style
  if (scores.size === 0) {
    const altRe = /\|\s*D(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*\|/g;
    while ((m = altRe.exec(md)) !== null) {
      scores.set(`D${m[1]}`, parseFloat(m[2]));
    }
  }
  return scores;
}

function parseInProgressSession(md) {
  const re = /in_progress[\s\S]*?(D\d+)[\s\S]*?(M\d+\.\d+)/i;
  const m = re.exec(md);
  if (m) {
    return { dimension: m[1], milestone: m[2] };
  }
  return null;
}

function selectNextWork() {
  let roadmap = "";
  try {
    roadmap = readFileSync(ROADMAP_PATH, "utf-8");
  } catch {
    return {
      error: `Roadmap not found at ${ROADMAP_PATH}`,
      next: null,
      selection: null,
    };
  }

  let session = "";
  try {
    session = readFileSync(SESSION_PATH, "utf-8");
  } catch {
    // session file optional
  }

  // Tier 1: Resume in-progress
  const inProgress = parseInProgressSession(session);
  if (inProgress) {
    const dim = DIMENSION_ORDER.find((d) => d.id === inProgress.dimension);
    return {
      next: {
        dimension: inProgress.dimension,
        milestone: inProgress.milestone,
        name: dim?.name ?? "Unknown",
      },
      selection: {
        tier: "resume",
        reason: `Resuming ${inProgress.milestone} from session pointer`,
      },
    };
  }

  // Tier 2-3: Select lowest-score implementable dimension
  const scores = parseRoadmapScores(roadmap);

  const candidates = DIMENSION_ORDER.filter((d) => !d.external)
    .map((d) => ({
      ...d,
      score: scores.get(d.id) ?? 0,
    }))
    .filter((d) => d.score < 10)
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      if (a.critical !== b.critical) return a.critical ? -1 : 1;
      return a.id.localeCompare(b.id);
    });

  if (candidates.length === 0) {
    return {
      next: null,
      selection: {
        tier: "complete",
        reason: "All implementable dimensions are at 10/10",
      },
    };
  }

  for (const candidate of candidates) {
    const nextMilestone = guessNextMilestone(candidate.id, candidate.score);

    // Skip external or release-gated milestones — no internal agent work available
    if (nextMilestone.external || nextMilestone.releaseGated) {
      continue;
    }

    return {
      next: {
        dimension: candidate.id,
        milestone: nextMilestone.id,
        name: candidate.name,
        title: nextMilestone.title,
      },
      selection: {
        tier: candidate.critical ? "critical-path" : "backlog",
        reason: `Lowest-score implementable dimension: ${candidate.id} (${candidate.score}/10)`,
      },
    };
  }

  return {
    next: null,
    selection: {
      tier: "complete",
      reason: "All implementable dimensions are at 10/10 or blocked on external/release-gated milestones",
    },
  };
}

function guessNextMilestone(dimId, score) {
  const map = {
    D1: { "8": { id: "M1.4", title: "Property-based tests (proptest)" }, "9": { id: "M1.5", title: "Differential testing (snarkjs / arkworks ref)" } },
    D2: { "8": { id: "M2.1", title: "Boundary tests" }, "9": { id: "M2.2", title: "Fuzzing / randomized witness gen" } },
    D3: { "9": { id: "M3.2", title: "Trusted-setup verification (release-gated)", releaseGated: true } },
    D4: { "9": { id: "M4.2", title: "End-to-end integration test" } },
    D5: { "9": { id: "M5.3", title: "getrandom fallback audit" } },
    D6: { "6": { id: "M6.3", title: "CI KAT verification gate" }, "8": { id: "M6.4", title: "Cross-implementation validation (snarkjs)" } },
    D7: { "6": { id: "M7.2", title: "uint64_is_ge audit" }, "8": { id: "M7.4", title: "Microbenchmarks (dudect / ctgrind)" } },
    D10: {
      "8": { id: "M10.2", title: "Runtime FIPS enforcement (GTCX_FIPS_STRICT=1)" },
      "9": { id: "M10.3", title: "Regulator attestation (external)", external: true },
    },
  };
  const dimMap = map[dimId];
  if (!dimMap) return { id: "?", title: "Unknown", external: false, releaseGated: false };
  // Sort keys descending so higher brackets match first (e.g., 9 before 8)
  const sortedKeys = Object.keys(dimMap).sort((a, b) => parseFloat(b) - parseFloat(a));
  const scoreKey = sortedKeys.find((k) => score >= parseFloat(k));
  return dimMap[scoreKey] ?? { id: "?", title: "Unknown", external: false, releaseGated: false };
}

const result = selectNextWork();
console.log(JSON.stringify(result, null, 2));
