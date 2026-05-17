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
            StakeholderType::Government.default_weight() > StakeholderType::Vault.default_weight()
        );
        assert!(
            StakeholderType::Vault.default_weight() > StakeholderType::Industry.default_weight()
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
        engine.finalize("p1", true).unwrap();
        let p = engine.get_proposal("p1").unwrap();
        assert_eq!(p.state, ProposalState::Finalized);
        assert!(p.accepted);
    }

    #[test]
    fn test_manual_finalize_reject() {
        let mut engine = setup_engine();
        engine.submit_proposal("p1".to_string(), vec![]).unwrap();
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
