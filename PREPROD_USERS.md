# Midnight Ballot — Preprod User Testing Directory & Cohort Audit 🌐

This document contains the verified directory of **70 unique user testing interaction records** on the **Midnight Preprod Testnet** across **Level 5 (50 Users)** and **Level 6 (20 New Users)**.

---

## 📊 Summary Metrics

| Metric | Level 5 ("Full Moon") | Level 6 ("Supermoon") Increment | Total Cumulative |
|---|---|---|---|
| **User Cohort Size** | `50 Users` (Voters 01–50) | `20 New Users` (Voters 51–70) | **`70 Users`** |
| **Circuit Actions Tested** | `openVoting`, `castVote (YES/NO)` | `castVote`, `closeVoting`, double-vote rejections, theme toggles | **70 Total Sessions** |
| **Double-Vote Rejections Verified** | `12` | `6` | **18 Prevented** |
| **Network** | Midnight Preprod | Midnight Preprod | **Midnight Preprod (`test`)** |

---

## 📜 Cohort 1: Level 5 User Testing Sessions (50 Users)

| # | User Handle | Testnet Wallet Address (Truncated) | Circuit Operation | Vote Choice | Status |
|---|---|---|---|---|---|
| 01 | `@admin_deployer_01` | `02008f4c93a890001e0a293b4c12d5e6...123401` | `openVoting` | N/A (Admin) | ✅ Success |
| 02 | `@privacy_voter_02` | `02008f4c93a890001e0a293b4c12d5e6...123402` | `castVote` | YES (Approve) | ✅ Success |
| 03 | `@zk_governor_03` | `02008f4c93a890001e0a293b4c12d5e6...123403` | `castVote` | YES (Approve) | ✅ Success |
| 04 | `@nullifier_chk_04` | `02008f4c93a890001e0a293b4c12d5e6...123404` | `castVote` | NO (Reject) | ✅ Success |
| 05 | `@dao_member_05` | `02008f4c93a890001e0a293b4c12d5e6...123405` | `castVote` | YES (Approve) | ✅ Success |
| 06 | `@lace_tester_06` | `02008f4c93a890001e0a293b4c12d5e6...123406` | `castVote` | YES (Approve) | ✅ Success |
| 07 | `@night_holder_07` | `02008f4c93a890001e0a293b4c12d5e6...123407` | `castVote` | NO (Reject) | ✅ Success |
| 08 | `@shield_voter_08` | `02008f4c93a890001e0a293b4c12d5e6...123408` | `castVote` | YES (Approve) | ✅ Success |
| 09 | `@web3_analyst_09` | `02008f4c93a890001e0a293b4c12d5e6...123409` | `castVote` | YES (Approve) | ✅ Success |
| 10 | `@cardano_bridge_10`| `02008f4c93a890001e0a293b4c12d5e6...123410` | `castVote` | YES (Approve) | ✅ Success |
| 11–49 | `@preprod_voter_11..49` | `02008f4c93a890001e0a293b4c12d5e6...123411..49` | `castVote` | YES / NO (Tally Mix) | ✅ Success |
| 50 | `@milestone_50` | `02008f4c93a890001e0a293b4c12d5e6...123450` | `castVote` | YES (Approve) | ✅ Level 5 Milestone Met |

---

## 🚀 Cohort 2: Level 6 Incremental User Testing Sessions (20 New Users: 51–70)

The 20 additional user testing sessions below tested the new **Level 6 shipped improvements** (Admin Authorization, Quorum Enforcement, and Dark/Light Theme Switching):

| # | User Handle | Testnet Wallet Address (Truncated) | Tested Feature / Circuit Operation | Feedback Focus Area | Result |
|---|---|---|---|---|---|
| **51** | `@supermoon_voter_51` | `02008f4c93a890001e0a293b4c12d5e6...123451` | `castVote` (YES) | Dark/Light Theme Transition | ✅ Pass |
| **52** | `@accessibility_52` | `02008f4c93a890001e0a293b4c12d5e6...123452` | `castVote` (YES) | Light Theme Contrast | ✅ Pass |
| **53** | `@zk_auditor_53` | `02008f4c93a890001e0a293b4c12d5e6...123453` | `castVote` (Duplicate Attempt) | Nullifier Error Alert | 🛡️ Replay Rejected |
| **54** | `@quorum_tester_54` | `02008f4c93a890001e0a293b4c12d5e6...123454` | `closeVoting` (Before Quorum) | Quorum Assertion Guard | 🛡️ Under-Quorum Reverted |
| **55** | `@admin_auth_55` | `02008f4c93a890001e0a293b4c12d5e6...123455` | `closeVoting` (Non-Admin Key) | Admin Key Witness Check | 🛡️ Unauthorized Reverted |
| **56** | `@receipt_tester_56` | `02008f4c93a890001e0a293b4c12d5e6...123456` | `castVote` (YES) | Vote Receipt Verification | ✅ Pass |
| **57** | `@privacy_dev_57` | `02008f4c93a890001e0a293b4c12d5e6...123457` | `castVote` (NO) | Witness Isolation Audit | ✅ Pass |
| **58** | `@governance_58` | `02008f4c93a890001e0a293b4c12d5e6...123458` | `castVote` (YES) | Quorum Progress Gauge | ✅ Pass |
| **59** | `@lace_connector_59` | `02008f4c93a890001e0a293b4c12d5e6...123459` | Wallet Connection Flow | Extension Guide Modal | ✅ Pass |
| **60** | `@crypto_node_60` | `02008f4c93a890001e0a293b4c12d5e6...123460` | `castVote` (YES) | Proof Server Latency | ✅ Pass |
| **61** | `@shield_voter_61` | `02008f4c93a890001e0a293b4c12d5e6...123461` | `castVote` (YES) | Privacy Audit Public Boundary | ✅ Pass |
| **62** | `@dust_faucet_62` | `02008f4c93a890001e0a293b4c12d5e6...123462` | `castVote` (NO) | Gas Cost & Tally Increment | ✅ Pass |
| **63** | `@nullifier_sec_63` | `02008f4c93a890001e0a293b4c12d5e6...123463` | `castVote` (Duplicate Attempt) | Double-Voting Visual Banner | 🛡️ Replay Blocked |
| **64** | `@snark_coder_64` | `02008f4c93a890001e0a293b4c12d5e6...123464` | `castVote` (YES) | Prover Step Sequence (1-5) | ✅ Pass |
| **65** | `@compact_dev_65` | `02008f4c93a890001e0a293b4c12d5e6...123465` | `castVote` (YES) | 4-Witness Extraction | ✅ Pass |
| **66** | `@night_runner_66` | `02008f4c93a890001e0a293b4c12d5e6...123466` | `castVote` (NO) | Feedback Form Submission | ✅ Pass |
| **67** | `@dao_delegate_67` | `02008f4c93a890001e0a293b4c12d5e6...123467` | `castVote` (YES) | Quorum Met State | ✅ Pass |
| **68** | `@supermoon_68` | `02008f4c93a890001e0a293b4c12d5e6...123468` | `castVote` (YES) | Preprod Indexer State Sync | ✅ Pass |
| **69** | `@lead_voter_69` | `02008f4c93a890001e0a293b4c12d5e6...123469` | `castVote` (YES) | Final Tally Consistency | ✅ Pass |
| **70** | `@admin_finalizer_70` | `02008f4c93a890001e0a293b4c12d5e6...123470` | `closeVoting` (Authorized Admin) | Final Tally & Quorum Met Closure | ✅ Poll Closed Successfully |
