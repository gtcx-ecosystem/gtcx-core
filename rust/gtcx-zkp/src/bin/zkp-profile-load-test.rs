//! DTF-5.4.2 — Groth16 commodity-origin profile load test (verify throughput).
//!
//! Measures verifier throughput for Tier-5 profile proofs (minerals-board SLA narrative).
//! Default gate: >= 1000 verifications/minute in `verify` mode (release build).

use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use ark_bn254::Fr;
use rayon::prelude::*;

use gtcx_zkp::{
    active_profile_ids, gh_cocoa_origin_profile, gh_gold_origin_profile, groth16_generate_keys,
    groth16_prove_commodity_origin, groth16_verify, sample_commodity_origin_for_profile,
    validate_profile_sample, zw_diamond_origin_profile, CommodityOriginProfileConfig,
    Groth16CircuitType, Groth16ProofBundle,
};

const DEFAULT_TARGET_PPM: u64 = 1000;
const DEFAULT_DURATION_SECS: u64 = 60;

#[derive(Debug, Clone, Copy)]
enum LoadMode {
    Verify,
    Prove,
}

struct Args {
    mode: LoadMode,
    duration_secs: u64,
    target_ppm: u64,
    workers: usize,
    kat_dir: Option<PathBuf>,
    out_path: Option<PathBuf>,
}

fn parse_args() -> Args {
    let mut mode = LoadMode::Verify;
    let mut duration_secs = DEFAULT_DURATION_SECS;
    let mut target_ppm = DEFAULT_TARGET_PPM;
    let mut out_path = None;
    let mut kat_dir = None;
    let mut workers = std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4)
        .max(1);

    for arg in env::args().skip(1) {
        if arg == "--help" || arg == "-h" {
            print_help();
            std::process::exit(0);
        } else if arg == "--mode=prove" {
            mode = LoadMode::Prove;
        } else if arg == "--mode=verify" || arg == "--mode=verification" {
            mode = LoadMode::Verify;
        } else if let Some(v) = arg.strip_prefix("--duration=") {
            duration_secs = v.parse().unwrap_or(DEFAULT_DURATION_SECS);
        } else if let Some(v) = arg.strip_prefix("--target-ppm=") {
            target_ppm = v.parse().unwrap_or(DEFAULT_TARGET_PPM);
        } else if let Some(v) = arg.strip_prefix("--out=") {
            out_path = Some(PathBuf::from(v));
        } else if let Some(v) = arg.strip_prefix("--workers=") {
            workers = v.parse().unwrap_or(workers).max(1);
        } else if let Some(v) = arg.strip_prefix("--kat-dir=") {
            kat_dir = Some(PathBuf::from(v));
        }
    }

    Args {
        mode,
        duration_secs,
        target_ppm,
        workers,
        kat_dir,
        out_path,
    }
}

fn print_help() {
    eprintln!(
        "Usage: zkp-profile-load-test [--mode=verify|prove] [--duration=60] [--target-ppm=1000] [--workers=N] [--kat-dir=path] [--out=path.json]"
    );
}

fn kat_filename_for_profile(profile_id: &str) -> &'static str {
    match profile_id {
        gtcx_zkp::PROFILE_GH_GOLD_ORIGIN => "groth16-gh-gold-origin.kat.json",
        gtcx_zkp::PROFILE_ZW_DIAMOND_ORIGIN => "groth16-zw-diamond-origin.kat.json",
        gtcx_zkp::PROFILE_GH_COCOA_ORIGIN => "groth16-commodity-origin.kat.json",
        _ => "groth16-commodity-origin.kat.json",
    }
}

fn public_inputs_from_kat(pi: &serde_json::Value) -> Vec<Fr> {
    let mut inputs = Vec::new();
    let commodity_type = pi["commodity_type"].as_u64().unwrap_or(0);
    inputs.extend((0..64).map(|i| Fr::from((commodity_type >> i) & 1)));
    for field in [
        "region_hash",
        "primary_commitment",
        "secondary_commitment",
        "mines_root",
    ] {
        let bytes = hex::decode(pi[field].as_str().unwrap_or("")).unwrap_or_default();
        for byte in &bytes {
            for i in 0..8 {
                inputs.push(Fr::from(u64::from((byte >> i) & 1)));
            }
        }
    }
    for field in ["min_primary", "min_secondary", "certification_flags"] {
        let v = pi[field].as_u64().unwrap_or(0);
        inputs.extend((0..64).map(|i| Fr::from((v >> i) & 1)));
    }
    inputs
}

fn load_kat_bundle(kat_dir: &PathBuf, profile_id: &str) -> Option<Groth16ProofBundle> {
    let path = kat_dir.join(kat_filename_for_profile(profile_id));
    if !path.is_file() {
        return None;
    }
    let kat_json: serde_json::Value =
        serde_json::from_str(&fs::read_to_string(&path).ok()?).ok()?;
    if kat_json["circuit"].as_str()? != "CommodityOrigin" {
        return None;
    }
    if !kat_json["expected_verify"].as_bool().unwrap_or(false) {
        return None;
    }
    let proof_bytes = hex::decode(kat_json["proof_bytes"].as_str()?).ok()?;
    let vk_bytes = hex::decode(kat_json["verifying_key_bytes"].as_str()?).ok()?;
    let public_inputs = public_inputs_from_kat(&kat_json["public_inputs"]);
    let bundle = Groth16ProofBundle {
        circuit: Groth16CircuitType::CommodityOrigin,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };
    if !groth16_verify(&bundle).ok()? {
        return None;
    }
    Some(bundle)
}

fn profile_config(id: &str) -> CommodityOriginProfileConfig {
    match id {
        gtcx_zkp::PROFILE_GH_GOLD_ORIGIN => gh_gold_origin_profile(),
        gtcx_zkp::PROFILE_ZW_DIAMOND_ORIGIN => zw_diamond_origin_profile(),
        gtcx_zkp::PROFILE_GH_COCOA_ORIGIN => gh_cocoa_origin_profile(),
        other => {
            eprintln!("Unsupported profile for load test: {other}");
            std::process::exit(2);
        }
    }
}

fn prove_profile_sample(
    profile: &CommodityOriginProfileConfig,
    keys: &gtcx_zkp::Groth16Keys,
) -> Groth16ProofBundle {
    let sample = sample_commodity_origin_for_profile(profile).expect("profile sample");
    validate_profile_sample(profile, &sample).expect("profile validation");
    let (bundle, _) = groth16_prove_commodity_origin(
        sample.commodity_type,
        sample.mine_id,
        sample.lat,
        sample.lon,
        sample.primary_metric,
        sample.secondary_metric,
        sample.primary_randomness,
        sample.secondary_randomness,
        sample.location_randomness,
        sample.bounds,
        sample.min_primary,
        sample.min_secondary,
        sample.certification_flags,
        sample.merkle_path,
        keys,
    )
    .expect("prove commodity origin");
    assert!(groth16_verify(&bundle).expect("verify"));
    bundle
}

fn run_verify_load(
    proofs: Arc<Vec<Groth16ProofBundle>>,
    duration: Duration,
    workers: usize,
) -> (u64, Vec<u64>) {
    let count = AtomicU64::new(0);
    let latencies = Mutex::new(Vec::with_capacity(8192));
    let deadline = Arc::new(Instant::now() + duration);

    (0..workers).into_par_iter().for_each(|worker| {
        let mut idx = worker;
        while Instant::now() < *deadline {
            let proof = &proofs[idx % proofs.len()];
            idx += workers;
            let t0 = Instant::now();
            assert!(groth16_verify(proof).expect("verify"));
            count.fetch_add(1, Ordering::Relaxed);
            if let Ok(mut buf) = latencies.lock() {
                buf.push(t0.elapsed().as_micros() as u64);
            }
        }
    });

    let latencies = latencies.into_inner().expect("latencies mutex");
    (count.load(Ordering::Relaxed), latencies)
}

fn run_prove_load(
    profiles: &[CommodityOriginProfileConfig],
    keys: &gtcx_zkp::Groth16Keys,
    duration: Duration,
) -> (u64, Vec<u64>) {
    let mut count = 0u64;
    let mut latencies_us = Vec::new();
    let deadline = Instant::now() + duration;
    let mut idx = 0usize;

    while Instant::now() < deadline {
        let profile = &profiles[idx % profiles.len()];
        idx += 1;
        let t0 = Instant::now();
        let _ = prove_profile_sample(profile, keys);
        latencies_us.push(t0.elapsed().as_micros() as u64);
        count += 1;
    }

    (count, latencies_us)
}

fn percentile(sorted: &[u64], p: f64) -> u64 {
    if sorted.is_empty() {
        return 0;
    }
    let idx = ((sorted.len() as f64 - 1.0) * p).round() as usize;
    sorted[idx.min(sorted.len() - 1)]
}

fn main() {
    let args = parse_args();
    let profile_ids: Vec<&str> = active_profile_ids();
    if profile_ids.is_empty() {
        eprintln!("No active profiles in registry");
        std::process::exit(2);
    }

    let profiles: Vec<CommodityOriginProfileConfig> =
        profile_ids.iter().map(|id| profile_config(id)).collect();

    let keys = groth16_generate_keys(Groth16CircuitType::CommodityOrigin).expect("keygen");

    eprintln!(
        "zkp-profile-load-test: mode={:?} duration={}s target_ppm={} workers={} profiles={:?}",
        args.mode, args.duration_secs, args.target_ppm, args.workers, profile_ids
    );

    let duration = Duration::from_secs(args.duration_secs);
    let warmup_start = Instant::now();

    let (operation_count, mut latencies_us, measure_start) = match args.mode {
        LoadMode::Verify => {
            let proofs: Arc<Vec<Groth16ProofBundle>> = Arc::new(
                profiles
                    .iter()
                    .enumerate()
                    .map(|(i, p)| {
                        let id = profile_ids[i];
                        if let Some(dir) = &args.kat_dir {
                            if let Some(bundle) = load_kat_bundle(dir, id) {
                                eprintln!("Warm-up: loaded KAT for {id}");
                                return bundle;
                            }
                        }
                        eprintln!("Warm-up: pre-proving {id} (not gated)");
                        prove_profile_sample(p, &keys)
                    })
                    .collect(),
            );
            let warmup_secs = warmup_start.elapsed().as_secs_f64();
            eprintln!("Warm-up complete in {warmup_secs:.1}s ({} proofs)", proofs.len());
            eprintln!("Running parallel verify load for {}s...", args.duration_secs);
            let measure_start = Instant::now();
            let (count, latencies) =
                run_verify_load(proofs, duration, args.workers);
            (count, latencies, measure_start)
        }
        LoadMode::Prove => {
            eprintln!(
                "Running prove load for {}s (informational; SLA is verify mode)...",
                args.duration_secs
            );
            let measure_start = Instant::now();
            let (count, latencies) = run_prove_load(&profiles, &keys, duration);
            (count, latencies, measure_start)
        }
    };

    let elapsed_secs = measure_start.elapsed().as_secs_f64().max(0.001);
    let proofs_per_minute = (operation_count as f64 / elapsed_secs) * 60.0;
    latencies_us.sort_unstable();
    let pass = proofs_per_minute >= args.target_ppm as f64;

    let report = serde_json::json!({
        "schema": "gtcx.zkp-profile-load.v1",
        "document_id": "DTF-5.4.2",
        "timestamp_unix": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        "repo": "gtcx-core",
        "mode": match args.mode { LoadMode::Verify => "verify", LoadMode::Prove => "prove" },
        "target_proofs_per_minute": args.target_ppm,
        "duration_seconds": args.duration_secs,
        "workers": args.workers,
        "warmup_kat_dir": args.kat_dir.as_ref().map(|p| p.display().to_string()),
        "profiles": profile_ids,
        "underlying_circuit": "CommodityOrigin",
        "operation_count": operation_count,
        "elapsed_seconds": elapsed_secs,
        "proofs_per_minute": (proofs_per_minute * 100.0).round() / 100.0,
        "pass": pass,
        "latency_us": {
            "p50": percentile(&latencies_us, 0.50),
            "p99": percentile(&latencies_us, 0.99),
            "max": latencies_us.last().copied().unwrap_or(0),
        },
        "notes": match args.mode {
            LoadMode::Verify => "Minerals-board verifier SLA — Groth16 verify throughput on profile-bound commodity-origin proofs.",
            LoadMode::Prove => "Prove throughput is CPU-bound; not gated at 1000/min. Use verify mode for DTF-5.4.2 pass/fail.",
        },
    });

    let json = serde_json::to_string_pretty(&report).expect("json");
    if let Some(path) = &args.out_path {
        if let Some(parent) = path.parent() {
            if !parent.as_os_str().is_empty() {
                fs::create_dir_all(parent).expect("create_dir_all");
            }
        }
        fs::write(path, &json).expect("write evidence");
        eprintln!("Wrote {}", path.display());
    }
    println!("{json}");

    if !pass {
        eprintln!(
            "FAIL: {:.0} proofs/min < target {}",
            proofs_per_minute, args.target_ppm
        );
        std::process::exit(1);
    }
    eprintln!("PASS: {:.0} proofs/min >= {}", proofs_per_minute, args.target_ppm);
}
