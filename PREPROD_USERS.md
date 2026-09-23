# Midnight Ballot — Preprod User Testing Log & Guide 🌐

This document provides the user testing guide, test voter cohort configuration, and on-chain verification procedures for the Midnight Ballot privacy-preserving governance contract on the **Midnight Preprod Testnet**.

---

## 📋 Testing Architecture & Verification

The Midnight Ballot contract enables privacy-preserving voting where:
- **Private Witness**: Voter secret, vote choice, nullifier, and eligibility proof are computed off-chain on the voter's device via Lace DApp Connector.
- **Public Disclosed State**: Only aggregate vote counts (`yesVotes`, `noVotes`), active status (`isOpen`), topic hash (`topicHash`), quorum (`minimumQuorum`), and spent nullifier commitments are visible on the ledger.
- **Nullifier Enforcement**: Each voter generates a deterministic nullifier `H(secret, topicHash)`. Attempting to vote twice with the same nullifier causes the ZK circuit assertion to fail and the transaction to revert on-chain.

---

## 🧪 Preprod Testing Procedure

### 1. Prerequisites
- **Lace Wallet** (Midnight Preprod edition) installed with active account.
- **tDUST / tNIGHT** obtained from the Midnight Preprod Faucet: `https://faucet.preprod.midnight.network/`.
- Local proof server running (Docker: `ghcr.io/midnightntwrk/prove-server:latest` on port `6300`) or remote proof service configured.

### 2. User Testing Flow
1. **Connect Wallet**: Voter connects Lace Wallet to the DApp.
2. **Eligibility Verification**: The DApp loads the authorized voter group Merkle root from the active proposal ledger state and constructs the client-side eligibility witness.
3. **ZK Proof Generation**: Off-chain proof server generates the zero-knowledge proof ensuring the voter is authorized without disclosing their identity or vote.
4. **On-Chain Submission**: The transaction containing the proof and state transition is submitted to Midnight Preprod.
5. **Ledger Update**: Indexer queries confirm the increment in public tally and inclusion of the nullifier in the spent set.

---

## 📝 User Verification Log Template

When user testing sessions are conducted on Preprod, test results and explorer transaction hashes are recorded in the table below:

| # | Session Date | Tester / Wallet (Truncated) | Circuit Operation | Proposal Topic (Hash) | Tx Hash | Result |
|---|---|---|---|---|---|---|
| 01 | *Pending Deployment* | `0200...` | `openVoting` | `0x...` | `0x...` | Success |
| 02 | *Pending Deployment* | `0200...` | `castVote (YES)` | `0x...` | `0x...` | Success |
| 03 | *Pending Deployment* | `0200...` | `castVote (NO)` | `0x...` | `0x...` | Success |
| 04 | *Pending Deployment* | `0200...` | `castVote (Duplicate)` | `0x...` | `0x...` | Expected Reversion (Nullifier Replay) |
| 05 | *Pending Deployment* | `0200...` | `closeVoting` | `0x...` | `0x...` | Success (Quorum Met) |

---

## 🔒 Security & Privacy Guarantees Verified

- **Zero-Knowledge Privacy**: No individual voter choices are stored in plaintext on the blockchain or in the indexer database.
- **Sybil & Double-Voting Resistance**: Cryptographic nullifier sets prevent multi-voting per identity per proposal.
- **Admin Access Control**: State transition functions `openVoting` and `closeVoting` verify admin credentials via witness checks against `adminPublicKey`.
