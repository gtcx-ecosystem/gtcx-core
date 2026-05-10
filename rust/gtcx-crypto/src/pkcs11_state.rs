//! Persistent state for `Pkcs11KeyStore`.
//!
//! PKCS#11 modules do not implement the NIST SP 800-57 key lifecycle state
//! machine — `Created → Active → Rotated/Revoked → Destroyed` is a
//! gtcx-core abstraction layered on top of PKCS#11's flat key storage.
//! `Pkcs11KeyStore` therefore needs a side channel to track which key is
//! in which state. This module provides that channel.
//!
//! Two implementations:
//!
//! - `MemoryKeyStateStore` (default) — in-process `HashMap`. State is lost
//!   on process restart; appropriate for tests and short-running workloads.
//! - `FileSystemKeyStateStore` — JSON file persistence. State survives
//!   process restarts; appropriate for long-running production services.
//!
//! ## Important scoping caveat
//!
//! This module persists **lifecycle state**. PKCS#11 object handles are
//! session-scoped and CANNOT be persisted. Restart-safe operation against
//! a real HSM additionally requires CKA_ID-paired key generation so the
//! caller can re-find object handles by attribute lookup after restart.
//! That is documented as a separate hardening pass in
//! `docs/security/pkcs11-keystore.md` § Hardening passes (Sprint 5+).
//!
//! In v1, `Pkcs11KeyStore` keeps `ObjectHandle` references in process
//! memory regardless of which `KeyStateStore` is in use. The state
//! persistence layer closes one of the two restart-safety concerns; the
//! other (handle re-resolution) is a follow-up.

#![allow(clippy::significant_drop_tightening)]

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};

use crate::error::CryptoError;
use crate::keystore::KeyState;
use crate::Result;

/// Pluggable persistence layer for `KeyState` lifecycle tracking.
///
/// Implementations MUST be `Send + Sync`. The trait is structured around
/// owned strings rather than `&KeyId` to keep the persistence boundary
/// type-agnostic (downstream consumers can adapt to non-`KeyId`
/// identifiers without trait modification).
pub trait KeyStateStore: Send + Sync {
    /// Read the current state for a key. `None` means the key is unknown
    /// to this store.
    fn get(&self, key_id: &str) -> Option<KeyState>;

    /// Persist the current state for a key. Overwrites any existing entry.
    ///
    /// # Errors
    ///
    /// Returns an error if the underlying storage cannot accept the write
    /// (e.g. filesystem full, permission denied).
    fn set(&self, key_id: &str, state: KeyState) -> Result<()>;

    /// Remove a key from the store entirely. No-op if the key is absent.
    ///
    /// # Errors
    ///
    /// Returns an error if the underlying storage cannot persist the
    /// removal (filesystem-level errors, etc.).
    fn remove(&self, key_id: &str) -> Result<()>;

    /// Snapshot of every (`key_id`, state) pair currently in the store.
    /// Useful for diagnostics and migration.
    fn snapshot(&self) -> HashMap<String, KeyState>;
}

// ---------------------------------------------------------------------------
// MemoryKeyStateStore — default, in-process HashMap
// ---------------------------------------------------------------------------

/// In-memory implementation of `KeyStateStore`. State is lost on process
/// restart. The default for `Pkcs11KeyStore::new`.
pub struct MemoryKeyStateStore {
    inner: Arc<Mutex<HashMap<String, KeyState>>>,
}

impl MemoryKeyStateStore {
    /// Construct an empty memory state store.
    #[must_use]
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

impl Default for MemoryKeyStateStore {
    fn default() -> Self {
        Self::new()
    }
}

impl KeyStateStore for MemoryKeyStateStore {
    fn get(&self, key_id: &str) -> Option<KeyState> {
        self.inner
            .lock()
            .expect("memory state lock poisoned")
            .get(key_id)
            .copied()
    }

    fn set(&self, key_id: &str, state: KeyState) -> Result<()> {
        self.inner
            .lock()
            .expect("memory state lock poisoned")
            .insert(key_id.to_string(), state);
        Ok(())
    }

    fn remove(&self, key_id: &str) -> Result<()> {
        self.inner
            .lock()
            .expect("memory state lock poisoned")
            .remove(key_id);
        Ok(())
    }

    fn snapshot(&self) -> HashMap<String, KeyState> {
        self.inner
            .lock()
            .expect("memory state lock poisoned")
            .clone()
    }
}

// ---------------------------------------------------------------------------
// FileSystemKeyStateStore — JSON persistence
// ---------------------------------------------------------------------------

/// Filesystem-backed `KeyStateStore`. State persists as JSON at the path.
///
/// The full state map is rewritten on every mutation — fine for typical
/// key counts (≤10000), inappropriate for high-volume workloads where a
/// row-oriented database would be more appropriate.
///
/// # Concurrency
///
/// All reads and writes serialize through an internal mutex. Cross-process
/// concurrent access is NOT safe — the file does not use OS-level locking.
/// If multiple processes share the same state file, an external coordination
/// mechanism (advisory lock, distributed mutex) is required.
///
/// # Atomicity
///
/// Writes use the temp-file-then-rename pattern so a crash mid-write
/// cannot leave the file truncated. Reads of the temp file during a write
/// are not possible because the temp file is unlinked-or-renamed atomically.
pub struct FileSystemKeyStateStore {
    path: PathBuf,
    inner: Arc<Mutex<HashMap<String, KeyState>>>,
}

impl FileSystemKeyStateStore {
    /// Open or create a state store at the given path. If the file exists,
    /// its contents are loaded into memory at construction time. If it
    /// does not exist, the store starts empty (the file is created on the
    /// first write).
    ///
    /// # Errors
    ///
    /// Returns an error if the file exists but cannot be read or parsed
    /// as a valid `HashMap<String, KeyState>`.
    pub fn open(path: impl AsRef<Path>) -> Result<Self> {
        let path = path.as_ref().to_path_buf();
        let inner = if path.exists() {
            let raw = std::fs::read_to_string(&path).map_err(|e| {
                CryptoError::KeyStoreError(format!(
                    "FileSystemKeyStateStore read {}: {e}",
                    path.display()
                ))
            })?;
            serde_json::from_str::<HashMap<String, KeyState>>(&raw).map_err(|e| {
                CryptoError::KeyStoreError(format!(
                    "FileSystemKeyStateStore parse {}: {e}",
                    path.display()
                ))
            })?
        } else {
            HashMap::new()
        };
        Ok(Self {
            path,
            inner: Arc::new(Mutex::new(inner)),
        })
    }

    /// Path to the underlying state file.
    #[must_use]
    pub fn path(&self) -> &Path {
        &self.path
    }

    fn flush_locked(&self, map: &HashMap<String, KeyState>) -> Result<()> {
        let json = serde_json::to_string_pretty(map).map_err(|e| {
            CryptoError::KeyStoreError(format!("FileSystemKeyStateStore serialize: {e}"))
        })?;
        // Temp-file-then-rename for crash-atomicity.
        let mut tmp = self.path.clone();
        tmp.set_extension("json.tmp");
        std::fs::write(&tmp, json).map_err(|e| {
            CryptoError::KeyStoreError(format!(
                "FileSystemKeyStateStore write tmp {}: {e}",
                tmp.display()
            ))
        })?;
        std::fs::rename(&tmp, &self.path).map_err(|e| {
            CryptoError::KeyStoreError(format!(
                "FileSystemKeyStateStore rename {} -> {}: {e}",
                tmp.display(),
                self.path.display()
            ))
        })?;
        Ok(())
    }
}

impl KeyStateStore for FileSystemKeyStateStore {
    fn get(&self, key_id: &str) -> Option<KeyState> {
        self.inner
            .lock()
            .expect("fs state lock poisoned")
            .get(key_id)
            .copied()
    }

    fn set(&self, key_id: &str, state: KeyState) -> Result<()> {
        let mut guard = self.inner.lock().expect("fs state lock poisoned");
        guard.insert(key_id.to_string(), state);
        self.flush_locked(&guard)
    }

    fn remove(&self, key_id: &str) -> Result<()> {
        let mut guard = self.inner.lock().expect("fs state lock poisoned");
        guard.remove(key_id);
        self.flush_locked(&guard)
    }

    fn snapshot(&self) -> HashMap<String, KeyState> {
        self.inner.lock().expect("fs state lock poisoned").clone()
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn memory_get_after_set_returns_state() {
        let store = MemoryKeyStateStore::new();
        store.set("key-1", KeyState::Active).unwrap();
        assert_eq!(store.get("key-1"), Some(KeyState::Active));
    }

    #[test]
    fn memory_get_unknown_key_returns_none() {
        let store = MemoryKeyStateStore::new();
        assert_eq!(store.get("nope"), None);
    }

    #[test]
    fn memory_remove_clears_entry() {
        let store = MemoryKeyStateStore::new();
        store.set("k", KeyState::Active).unwrap();
        store.remove("k").unwrap();
        assert_eq!(store.get("k"), None);
    }

    #[test]
    fn memory_snapshot_returns_all_entries() {
        let store = MemoryKeyStateStore::new();
        store.set("k1", KeyState::Active).unwrap();
        store.set("k2", KeyState::Rotated).unwrap();
        let snap = store.snapshot();
        assert_eq!(snap.len(), 2);
        assert_eq!(snap.get("k1"), Some(&KeyState::Active));
        assert_eq!(snap.get("k2"), Some(&KeyState::Rotated));
    }

    #[test]
    fn fs_persists_across_open_calls() {
        let dir = std::env::temp_dir().join(format!("gtcx-fs-state-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("state.json");
        // First store: write some state and drop.
        {
            let store = FileSystemKeyStateStore::open(&path).unwrap();
            store.set("k1", KeyState::Active).unwrap();
            store.set("k2", KeyState::Rotated).unwrap();
        }
        // Second store: open the same file, read state back.
        {
            let store = FileSystemKeyStateStore::open(&path).unwrap();
            assert_eq!(store.get("k1"), Some(KeyState::Active));
            assert_eq!(store.get("k2"), Some(KeyState::Rotated));
        }
        // Cleanup.
        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn fs_remove_persists() {
        let dir = std::env::temp_dir().join(format!("gtcx-fs-remove-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("state.json");
        {
            let store = FileSystemKeyStateStore::open(&path).unwrap();
            store.set("k", KeyState::Active).unwrap();
            store.remove("k").unwrap();
        }
        {
            let store = FileSystemKeyStateStore::open(&path).unwrap();
            assert_eq!(store.get("k"), None);
        }
        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn fs_open_on_nonexistent_path_creates_empty_store() {
        let dir = std::env::temp_dir().join(format!("gtcx-fs-empty-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("does-not-exist-yet.json");
        let store = FileSystemKeyStateStore::open(&path).unwrap();
        assert_eq!(store.snapshot().len(), 0);
        std::fs::remove_dir_all(&dir).ok();
    }

    #[test]
    fn fs_open_on_corrupt_file_fails_loudly() {
        let dir = std::env::temp_dir().join(format!("gtcx-fs-corrupt-{}", std::process::id()));
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("corrupt.json");
        std::fs::write(&path, "{not valid json").unwrap();
        let result = FileSystemKeyStateStore::open(&path);
        assert!(result.is_err());
        std::fs::remove_dir_all(&dir).ok();
    }
}
