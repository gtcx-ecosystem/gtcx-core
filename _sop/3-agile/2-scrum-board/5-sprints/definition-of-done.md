# Definition of Done

Criteria that must be met before any work item is considered complete.

---

## User Story DoD

### Development complete

- [ ] Feature implemented according to acceptance criteria
- [ ] Code committed to version control
- [ ] Code reviewed and approved (at least one peer)
- [ ] All review comments addressed
- [ ] No TODO comments or debugging code left in

### Testing complete

- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Manual testing completed
- [ ] Regression testing confirmed no breakage

### Documentation complete

- [ ] Code comments added where logic is non-obvious
- [ ] API documentation updated (if applicable)
- [ ] User documentation updated (if applicable)

### Ready for review

- [ ] Feature deployed to staging
- [ ] Demo-ready with test data available

---

## Feature / Epic DoD

### Development complete

- [ ] All user stories in the feature are individually done
- [ ] Feature integration tested end-to-end
- [ ] Cross-feature dependencies resolved
- [ ] Performance requirements met
- [ ] Security requirements met

### Testing complete

- [ ] System testing complete
- [ ] User acceptance testing (UAT) complete
- [ ] Performance testing complete (if required)
- [ ] Security testing complete (if required)

### Deployment ready

- [ ] Feature deployed to staging and verified
- [ ] Production deployment plan documented
- [ ] Rollback plan documented
- [ ] Monitoring and alerting configured

---

## Sprint DoD

- [ ] All committed stories meet User Story DoD
- [ ] Sprint goal achieved (or documented as partially achieved with rationale)
- [ ] Sprint demo prepared and presented to stakeholders
- [ ] Stakeholder feedback collected and recorded
- [ ] Product backlog updated
- [ ] Sprint retrospective completed and action items assigned

---

## Release DoD

### All features complete

- [ ] All features in scope meet Feature DoD
- [ ] Release integration testing complete
- [ ] Performance benchmarks met
- [ ] Security review complete
- [ ] Compliance requirements met (if applicable)

### Documentation complete

- [ ] Release notes written
- [ ] User documentation updated
- [ ] Migration guide prepared (if applicable)

### Deployment complete

- [ ] Production deployment successful
- [ ] Post-deployment verification complete
- [ ] Monitoring and alerting active
- [ ] Support team briefed

---

## Quality Gates

| Gate                              | Threshold |
| --------------------------------- | --------- |
| Code coverage                     | ≥ {n}%    |
| Critical security vulnerabilities | 0         |
| Performance (p95 response time)   | ≤ {n}ms   |
| Accessibility (WCAG level)        | AA        |

---

## Exceptions

When DoD cannot be met:

1. Document the specific criterion that cannot be met and why
2. Assess the risk of proceeding without it
3. Escalate to team lead and product owner for explicit acceptance
4. Create a follow-up story for completion and add it to backlog immediately
5. Update DoD if the criterion proves consistently unachievable (systemic issue)

---

## DoD Metrics

- **Compliance rate:** % of items shipped meeting full DoD (track per sprint)
- **Common violations:** log which criteria are most frequently skipped
- **Review cadence:** reassess DoD in retrospective when compliance drops below {n}%
