//! # GTCX PANX Consensus
//!
//! Weighted Practical Byzantine Fault Tolerance (PBFT) consensus
//! for the GTCX protocol.
//!
//! ## Validator Weights
//!
//! | Stakeholder | Weight |
//! |-------------|--------|
//! | Government | 40% |
//! | Vaults | 30% |
//! | Industry | 20% |
//! | Technical | 10% |
//!
//! ## Quorum
//!
//! ```text
//! Σ(weight_i × vote_i) > ⅔ × Σ(weight_i)
//! ```
//!
//! ## Design
//!
//! The consensus engine implements weighted PBFT where validators
//! have different voting weights based on their stakeholder role.
//! A proposal reaches quorum when the sum of approving validators'
//! weights exceeds ⅔ of total weight.

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::instrument;

// =============================================================================
// ERROR TYPES
// =============================================================================

/// Errors in the consensus engine.
#[derive(Debug, Error)]
pub enum ConsensusError {
    /// No validators registered.
    #[error("No validators registered")]
    NoValidators,

    /// Validator not found.
    #[error("Unknown validator: {0}")]
    UnknownValidator(String),

    /// Duplicate validator.
    #[error("Duplicate validator: {0}")]
    DuplicateValidator(String),

    /// Invalid weight (must be > 0).
    #[error("Invalid weight: {0} (must be > 0)")]
    InvalidWeight(u64),

    /// Proposal already finalized.
    #[error("Proposal {0} is already finalized")]
    AlreadyFinalized(String),

    /// Proposal not found.
    #[error("Unknown proposal: {0}")]
    UnknownProposal(String),

    /// Duplicate vote from same validator.
    #[error("Validator {validator} already voted on proposal {proposal}")]
    DuplicateVote {
        /// The validator who attempted to vote twice.
        validator: String,
        /// The proposal being voted on.
        proposal: String,
    },

    /// View number mismatch.
    #[error("View mismatch: expected {expected}, got {actual}")]
    ViewMismatch {
        /// Expected view number.
        expected: u64,
        /// Actual view number received.
        actual: u64,
    },
}

/// Result type for consensus operations.
pub type Result<T> = std::result::Result<T, ConsensusError>;

// =============================================================================
// TYPES
// =============================================================================

/// Stakeholder category for weight assignment.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum StakeholderType {
    /// Government regulatory body (40% default weight).
    Government,
    /// Licensed vault operator (30% default weight).
    Vault,
    /// Industry participant (20% default weight).
    Industry,
    /// Technical validator (10% default weight).
    Technical,
}

impl StakeholderType {
    /// Get the default weight for this stakeholder type.
    pub fn default_weight(self) -> u64 {
        match self {
            Self::Government => 40,
            Self::Vault => 30,
            Self::Industry => 20,
            Self::Technical => 10,
        }
    }
}

/// A validator in the consensus network.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Validator {
    /// Unique identifier for this validator.
    pub id: String,
    /// The stakeholder type.
    pub stakeholder: StakeholderType,
    /// Voting weight (typically derived from stakeholder type).
    pub weight: u64,
}

/// A vote on a proposal.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vote {
    /// The validator who cast this vote.
    pub validator_id: String,
    /// Whether the validator approves the proposal.
    pub approve: bool,
    /// The view number when this vote was cast.
    pub view: u64,
}

/// The current state of a proposal.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ProposalState {
    /// Proposal is in the pre-prepare phase.
    PrePrepare,
    /// Proposal is collecting prepare votes.
    Prepare,
    /// Proposal reached prepare quorum, collecting commits.
    Commit,
    /// Proposal is finalized (accepted or rejected).
    Finalized,
}

/// A consensus proposal.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proposal {
    /// Unique identifier for this proposal.
    pub id: String,
    /// The proposal payload (opaque bytes).
    pub payload: Vec<u8>,
    /// Current state of the proposal.
    pub state: ProposalState,
    /// Current view number.
    pub view: u64,
    /// Votes received (validator_id → vote).
    votes: Vec<Vote>,
    /// Whether the proposal was accepted (only valid when Finalized).
    pub accepted: bool,
}

// =============================================================================
// CONSENSUS ENGINE
// =============================================================================

/// The PANX weighted PBFT consensus engine.
#[derive(Debug)]
pub struct ConsensusEngine {
    /// Registered validators.
    validators: Vec<Validator>,
    /// Active proposals.
    proposals: Vec<Proposal>,
    /// Current view number.
    view: u64,
}

impl ConsensusEngine {
    /// Create a new consensus engine with no validators.
    pub fn new() -> Self {
        Self {
            validators: Vec::new(),
            proposals: Vec::new(),
            view: 0,
        }
    }

    /// Get the current view number.
    pub fn view(&self) -> u64 {
        self.view
    }

    /// Register a new validator.
    ///
    /// # Errors
    ///
    /// Returns [`ConsensusError::DuplicateValidator`] if a validator with the same ID exists.
    /// Returns [`ConsensusError::InvalidWeight`] if weight is zero.
    #[instrument(skip(self), fields(id = %validator.id, weight = validator.weight))]
    pub fn register_validator(&mut self, validator: Validator) -> Result<()> {
        if validator.weight == 0 {
            return Err(ConsensusError::InvalidWeight(0));
        }
        if self.validators.iter().any(|v| v.id == validator.id) {
            return Err(ConsensusError::DuplicateValidator(validator.id));
        }
        self.validators.push(validator);
        Ok(())
    }

    /// Get the total weight of all registered validators.
    pub fn total_weight(&self) -> u64 {
        self.validators.iter().map(|v| v.weight).sum()
    }

    /// Calculate the quorum threshold (⅔ of total weight + 1).
    pub fn quorum_threshold(&self) -> u64 {
        let total = self.total_weight();
        (total * 2) / 3 + 1
    }

    /// Submit a new proposal for consensus.
    ///
    /// # Errors
    ///
    /// Returns [`ConsensusError::NoValidators`] if no validators are registered.
    #[instrument(skip(self, payload), fields(id = %id, payload_len = payload.len()))]
    pub fn submit_proposal(&mut self, id: String, payload: Vec<u8>) -> Result<()> {
        if self.validators.is_empty() {
            return Err(ConsensusError::NoValidators);
        }

        let proposal = Proposal {
            id,
            payload,
            state: ProposalState::PrePrepare,
            view: self.view,
            votes: Vec::new(),
            accepted: false,
        };

        self.proposals.push(proposal);
        Ok(())
    }

    /// Advance a proposal from PrePrepare to Prepare phase.
    ///
    /// # Errors
    ///
    /// Returns [`ConsensusError::UnknownProposal`] if the proposal doesn't exist.
    pub fn prepare(&mut self, proposal_id: &str) -> Result<()> {
        let proposal = self
            .find_proposal_mut(proposal_id)?;

        if proposal.state != ProposalState::PrePrepare {
            return Ok(()); // idempotent
        }
        proposal.state = ProposalState::Prepare;
        Ok(())
    }

    /// Cast a vote on a proposal.
    ///
    /// # Errors
    ///
    /// Returns errors for unknown validator/proposal, duplicate vote, or view mismatch.
    #[instrument(skip(self), fields(proposal = %proposal_id, validator = %vote.validator_id))]
    pub fn cast_vote(&mut self, proposal_id: &str, vote: Vote) -> Result<ProposalState> {
        // Verify validator exists
        if !self.validators.iter().any(|v| v.id == vote.validator_id) {
            return Err(ConsensusError::UnknownValidator(vote.validator_id));
        }

        let proposal = self.find_proposal_mut(proposal_id)?;

        // Check not finalized
        if proposal.state == ProposalState::Finalized {
            return Err(ConsensusError::AlreadyFinalized(proposal_id.to_string()));
        }

        // Check view
        if vote.view != proposal.view {
            return Err(ConsensusError::ViewMismatch {
                expected: proposal.view,
                actual: vote.view,
            });
        }

        // Check duplicate
        if proposal.votes.iter().any(|v| v.validator_id == vote.validator_id) {
            return Err(ConsensusError::DuplicateVote {
                validator: vote.validator_id,
                proposal: proposal_id.to_string(),
            });
        }

        proposal.votes.push(vote);

        // Check if quorum is reached
        let approve_weight = self.calculate_approve_weight(proposal_id);
        let threshold = self.quorum_threshold();

        let proposal = self.find_proposal_mut(proposal_id)?;

        if approve_weight >= threshold {
            if proposal.state == ProposalState::Prepare {
                proposal.state = ProposalState::Commit;
            } else if proposal.state == ProposalState::Commit {
                proposal.state = ProposalState::Finalized;
                proposal.accepted = true;
            }
        }

        Ok(proposal.state)
    }

    /// Manually finalize a proposal (accept or reject).
    pub fn finalize(&mut self, proposal_id: &str, accepted: bool) -> Result<()> {
        let proposal = self.find_proposal_mut(proposal_id)?;
        proposal.state = ProposalState::Finalized;
        proposal.accepted = accepted;
        Ok(())
    }

    /// Trigger a view change (e.g., on leader timeout).
    pub fn view_change(&mut self) {
        self.view += 1;
    }

    /// Get a proposal by ID.
    pub fn get_proposal(&self, id: &str) -> Result<&Proposal> {
        self.proposals
            .iter()
            .find(|p| p.id == id)
            .ok_or_else(|| ConsensusError::UnknownProposal(id.to_string()))
    }

    /// Get the number of registered validators.
    pub fn validator_count(&self) -> usize {
        self.validators.len()
    }

    // ── Internals ──

    fn find_proposal_mut(&mut self, id: &str) -> Result<&mut Proposal> {
        self.proposals
            .iter_mut()
            .find(|p| p.id == id)
            .ok_or_else(|| ConsensusError::UnknownProposal(id.to_string()))
    }

    fn calculate_approve_weight(&self, proposal_id: &str) -> u64 {
        let Some(proposal) = self.proposals.iter().find(|p| p.id == proposal_id) else {
            return 0;
        };

        proposal
            .votes
            .iter()
            .filter(|v| v.approve)
            .map(|v| {
                self.validators
                    .iter()
                    .find(|val| val.id == v.validator_id)
                    .map_or(0, |val| val.weight)
            })
            .sum()
    }
}

impl Default for ConsensusEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// Create a standard validator set with default GTCX weights.
///
/// Creates one validator per stakeholder type with default weights.
pub fn create_default_validator_set() -> Vec<Validator> {
    vec![
        Validator {
            id: "gov-1".to_string(),
            stakeholder: StakeholderType::Government,
            weight: StakeholderType::Government.default_weight(),
        },
        Validator {
            id: "vault-1".to_string(),
            stakeholder: StakeholderType::Vault,
            weight: StakeholderType::Vault.default_weight(),
        },
        Validator {
            id: "industry-1".to_string(),
            stakeholder: StakeholderType::Industry,
            weight: StakeholderType::Industry.default_weight(),
        },
        Validator {
            id: "tech-1".to_string(),
            stakeholder: StakeholderType::Technical,
            weight: StakeholderType::Technical.default_weight(),
        },
    ]
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    fn setup_engine() -> ConsensusEngine {
        let mut engine = ConsensusEngine::new();
        for v in create_default_validator_set() {
            engine.register_validator(v).unwrap();
        }
        engine
    }

    // ── StakeholderType ──

    #[test]
    fn test_default_weights_sum_to_100() {
        let total: u64 = [
            StakeholderType::Government,
            StakeholderType::Vault,
            StakeholderType::Industry,
            StakeholderType::Technical,
        ]
        .iter()
        .map(|s| s.default_weight())
        .sum();
        assert_eq!(total, 100);
    }

    #[test]
    fn test_government_has_highest_weight() {
        assert!(
            StakeholderType::Government.default_weight()
                > StakeholderType::Vault.default_weight()
        );
        assert!(
            StakeholderType::Vault.default_weight()
                > StakeholderType::Industry.default_weight()
        );
        assert!(
            StakeholderType::Industry.default_weight()
                > StakeholderType::Technical.default_weight()
        );
    }

    // ── Engine setup ──

    #[test]
    fn test_new_engine_is_empty() {
        let engine = ConsensusEngine::new();
        assert_eq!(engine.validator_count(), 0);
        assert_eq!(engine.total_weight(), 0);
        assert_eq!(engine.view(), 0);
    }

    #[test]
    fn test_register_validators() {
        let engine = setup_engine();
        assert_eq!(engine.validator_count(), 4);
        assert_eq!(engine.total_weight(), 100);
    }

    #[test]
    fn test_duplicate_validator_rejected() {
        let mut engine = ConsensusEngine::new();
        let v = Validator {
            id: "v1".to_string(),
            stakeholder: StakeholderType::Government,
            weight: 40,
        };
        engine.register_validator(v.clone()).unwrap();
        let err = engine.register_validator(v).unwrap_err();
        assert!(matches!(err, ConsensusError::DuplicateValidator(_)));
    }

    #[test]
    fn test_zero_weight_rejected() {
        let mut engine = ConsensusEngine::new();
        let v = Validator {
            id: "v1".to_string(),
            stakeholder: StakeholderType::Technical,
            weight: 0,
        };
        let err = engine.register_validator(v).unwrap_err();
        assert!(matches!(err, ConsensusError::InvalidWeight(0)));
    }

    // ── Quorum calculation ──

    #[test]
    fn test_quorum_threshold() {
        let engine = setup_engine();
        // ⅔ of 100 + 1 = 67
        assert_eq!(engine.quorum_threshold(), 67);
    }

    #[test]
    fn test_quorum_threshold_odd_total() {
        let mut engine = ConsensusEngine::new();
        engine
            .register_validator(Validator {
                id: "v1".to_string(),
                stakeholder: StakeholderType::Government,
                weight: 33,
            })
            .unwrap();
        engine
            .register_validator(Validator {
                id: "v2".to_string(),
                stakeholder: StakeholderType::Vault,
                weight: 33,
            })
            .unwrap();
        engine
            .register_validator(Validator {
                id: "v3".to_string(),
                stakeholder: StakeholderType::Industry,
                weight: 33,
            })
            .unwrap();
        // ⅔ of 99 = 66, + 1 = 67
        assert_eq!(engine.quorum_threshold(), 67);
    }

    // ── Proposal lifecycle ──

    #[test]
    fn test_submit_proposal() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), b"test payload".to_vec())
            .unwrap();
        let proposal = engine.get_proposal("p1").unwrap();
        assert_eq!(proposal.state, ProposalState::PrePrepare);
        assert!(!proposal.accepted);
    }

    #[test]
    fn test_submit_without_validators_fails() {
        let mut engine = ConsensusEngine::new();
        let err = engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap_err();
        assert!(matches!(err, ConsensusError::NoValidators));
    }

    #[test]
    fn test_prepare_phase() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();
        assert_eq!(
            engine.get_proposal("p1").unwrap().state,
            ProposalState::Prepare
        );
    }

    #[test]
    fn test_unknown_proposal_error() {
        let mut engine = setup_engine();
        let err = engine.prepare("nonexistent").unwrap_err();
        assert!(matches!(err, ConsensusError::UnknownProposal(_)));
    }

    // ── Voting ──

    #[test]
    fn test_cast_vote() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        let state = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap();

        // Gov has 40, threshold is 67 — not yet at quorum
        assert_eq!(state, ProposalState::Prepare);
    }

    #[test]
    fn test_quorum_reached_advances_to_commit() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        // Gov (40) + Vault (30) = 70 > 67
        engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap();

        let state = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "vault-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap();

        assert_eq!(state, ProposalState::Commit);
    }

    #[test]
    fn test_reject_votes_dont_count() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        // Gov votes NO (40 weight doesn't count toward quorum)
        engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: false,
                    view: 0,
                },
            )
            .unwrap();

        // Only vault approves (30 < 67)
        let state = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "vault-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap();

        assert_eq!(state, ProposalState::Prepare);
    }

    #[test]
    fn test_duplicate_vote_rejected() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap();

        let err = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap_err();

        assert!(matches!(err, ConsensusError::DuplicateVote { .. }));
    }

    #[test]
    fn test_unknown_validator_vote_rejected() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        let err = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "unknown".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap_err();

        assert!(matches!(err, ConsensusError::UnknownValidator(_)));
    }

    #[test]
    fn test_view_mismatch_rejected() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.prepare("p1").unwrap();

        let err = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 999,
                },
            )
            .unwrap_err();

        assert!(matches!(err, ConsensusError::ViewMismatch { .. }));
    }

    #[test]
    fn test_vote_on_finalized_rejected() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.finalize("p1", true).unwrap();

        let err = engine
            .cast_vote(
                "p1",
                Vote {
                    validator_id: "gov-1".to_string(),
                    approve: true,
                    view: 0,
                },
            )
            .unwrap_err();

        assert!(matches!(err, ConsensusError::AlreadyFinalized(_)));
    }

    // ── View change ──

    #[test]
    fn test_view_change() {
        let mut engine = setup_engine();
        assert_eq!(engine.view(), 0);
        engine.view_change();
        assert_eq!(engine.view(), 1);
        engine.view_change();
        assert_eq!(engine.view(), 2);
    }

    // ── Manual finalization ──

    #[test]
    fn test_manual_finalize_accept() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.finalize("p1", true).unwrap();
        let p = engine.get_proposal("p1").unwrap();
        assert_eq!(p.state, ProposalState::Finalized);
        assert!(p.accepted);
    }

    #[test]
    fn test_manual_finalize_reject() {
        let mut engine = setup_engine();
        engine
            .submit_proposal("p1".to_string(), vec![])
            .unwrap();
        engine.finalize("p1", false).unwrap();
        let p = engine.get_proposal("p1").unwrap();
        assert_eq!(p.state, ProposalState::Finalized);
        assert!(!p.accepted);
    }

    // ── Default validator set ──

    #[test]
    fn test_default_validator_set() {
        let validators = create_default_validator_set();
        assert_eq!(validators.len(), 4);
        let total: u64 = validators.iter().map(|v| v.weight).sum();
        assert_eq!(total, 100);
    }

    // ── Serialization ──

    #[test]
    fn test_validator_json_roundtrip() {
        let v = Validator {
            id: "gov-1".to_string(),
            stakeholder: StakeholderType::Government,
            weight: 40,
        };
        let json = serde_json::to_string(&v).unwrap();
        let deserialized: Validator = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.id, "gov-1");
        assert_eq!(deserialized.weight, 40);
    }

    #[test]
    fn test_vote_json_roundtrip() {
        let v = Vote {
            validator_id: "vault-1".to_string(),
            approve: true,
            view: 42,
        };
        let json = serde_json::to_string(&v).unwrap();
        let deserialized: Vote = serde_json::from_str(&json).unwrap();
        assert_eq!(deserialized.validator_id, "vault-1");
        assert!(deserialized.approve);
        assert_eq!(deserialized.view, 42);
    }
}
