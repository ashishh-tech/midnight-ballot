# Midnight Ballot — User Testing & Feedback Framework 🔄

This document outlines the user feedback framework, user experience evaluation criteria, and product refinement roadmap for the Midnight Ballot privacy-preserving governance application.

---

## 🎯 Evaluation Dimensions

During user testing of the Midnight Ballot DApp, participants evaluate the system across five key criteria:

| UX Dimension | Focus Area | Evaluation Criteria |
|---|---|---|
| **Privacy Transparency** | ZK Witness Boundaries | Clear visual distinction between client-side private witnesses and on-chain public state |
| **Wallet Integration** | Lace DApp Connector | Reliable connection flow with Midnight Lace Wallet without requiring mock or fallback modes |
| **Proof Generation Speed** | Client Proving | Responsive proof calculation feedback and transaction state progression |
| **Double-Vote Protection** | Nullifier Rejection | Clear error signaling when an identical voter identity / nullifier attempts multiple submissions |
| **Admin Operations** | Quorum & Lifecycle | Streamlined proposal initialization and tally closure with quorum validation |

---

## 📋 User Testing Survey Template

When conducting testing sessions with community participants, responses are collected using the following structure:

1. **Wallet Connection**: Was the Lace connection prompt clear and immediate? (1-5)
2. **Proving Experience**: Was the progress indicator during ZK proof generation informative? (1-5)
3. **Transaction Clarity**: Did the receipt clearly distinguish private witness data from public counters? (1-5)
4. **Error Handling**: When testing edge cases (e.g., closed voting, double voting), was the error descriptive? (1-5)
5. **Qualitative Notes & Feature Requests**: Open feedback for roadmap prioritization.

---

## 🛠️ Product Refinement Roadmap

### Current Focus
- [x] **Strict DApp Connector Integration**: Seamless connection to Midnight Lace Wallet with clear setup prompts if the extension is absent.
- [x] **Full 4-Witness Client Generation**: Complete witness provider implementation (`getVoterSecret`, `getVoteChoice`, `getNullifier`, `getEligibilityProof`).
- [x] **Deterministic Nullifier Derivation**: On-chain and off-chain nullifier alignment to prevent double-voting.
- [x] **Live Indexer State Polling**: Real-time tally and status synchronization from the Midnight Indexer.

### Future Enhancements
- [ ] **Multi-Choice Proposals**: Support for arbitrary N-way ballots beyond binary Yes/No.
- [ ] **Token-Weighted ZK Voting**: Private balance-commitment proofs for stake-weighted governance.
- [ ] **Batch Merkle Tree Updates**: Dynamic voter registry commitment updates for rolling membership changes.
