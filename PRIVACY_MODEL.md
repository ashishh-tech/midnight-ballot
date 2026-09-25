# 🔒 Midnight Ballot — Zero-Knowledge Privacy Model & Dual-State Specification

This document provides the formal privacy specification and threat model for the **Midnight Ballot** protocol built on the **Midnight Network**.

---

## 🏛️ 1. Dual-State Architecture

Midnight's dual-state model splits execution into **Private Off-Chain Witnesses** and **Public On-Chain Ledger State**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIVATE OFF-CHAIN STATE                         │
│  (Evaluated locally on the voter's device via client witness)          │
│                                                                        │
│  • Voter Secret Key (voterSecret: Bytes<32>)                           │
│  • Individual Vote Selection (voteChoice: 0 | 1)                       │
│  • Group Membership Proof (eligibilityProof: MerklePath)               │
│  • Admin Signing Key (adminKey: Bytes<32>)                             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼ ZK Proof Generator (Proof Server)
┌────────────────────────────────────────────────────────────────────────┐
│                         COMPACT ZK CIRCUIT                             │
│                                                                        │
│  • Computes nullifier = hash(voterSecret, proposalTopic)               │
│  • Validates membership in authorized voter group                      │
│  • Asserts nullifier is not in public spent set                        │
│  • Increments public counter without exposing choice                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼ disclose(publicOutputs)
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC ON-CHAIN LEDGER                          │
│  (Stored and verified globally on Midnight Preprod blockchain)         │
│                                                                        │
│  • Spent Nullifier Set (nullifiers: Set<Bytes<32>>)                    │
│  • Aggregate Public Tally (yesVotes: Counter, noVotes: Counter)        │
│  • Minimum Quorum Requirement (minimumQuorum: Field)                   │
│  • Poll Open/Close Status (isOpen: Boolean)                            │
│  • Administrator Public Key (adminPublicKey: Bytes<32>)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ 2. Privacy Matrix: What Observers Learn vs Cannot Learn

| Information Asset | Public Observer | Relay / Proof Node | Contract Deployer | Voter |
|---|:---:|:---:|:---:|:---:|
| **Individual Vote Choice (YES/NO)** | ❌ Hidden | ❌ Hidden | ❌ Hidden | ✅ Known |
| **Voter Wallet / Identity** | ❌ Hidden | ❌ Hidden | ❌ Hidden | ✅ Known |
| **Eligibility Root / Membership** | ✅ Validated | ✅ Validated | ✅ Validated | ✅ Known |
| **Spent Nullifier Hash** | ✅ Public | ✅ Public | ✅ Public | ✅ Known |
| **Aggregate Tally Counts** | ✅ Public | ✅ Public | ✅ Public | ✅ Public |
| **Voting Status & Quorum** | ✅ Public | ✅ Public | ✅ Public | ✅ Public |

---

## ⚔️ 3. Threat Model & Security Properties

### A. Anonymity & Unlinkability
- **Guarantee**: Given an on-chain transaction incrementing the tally, an adversary cannot determine which eligible voter generated the transaction with probability greater than random guessing ($1/N$).

### B. Double-Voting Prevention (Sybil Resistance)
- **Guarantee**: A voter cannot vote more than once per proposal topic. If the same `voterSecret` is used, the deterministic nullifier $H(sk, topic)$ collides with the ledger's existing set and the transaction reverts.

### C. Coercion & Receipt-Freeness
- **Guarantee**: While users receive a cryptographic receipt showing their transaction was included in the block, the receipt does not reveal the direction (`YES` or `NO`) of the vote to a third-party coercer.

---

## 📜 4. Compact Circuit Witness Isolation

```compact
// Off-chain private witnesses
witness getVoterSecret(): Bytes<32>;
witness getVoteChoice(): Field;
witness getEligibilityProof(): MerkleProof;
witness getAdminKey(): Bytes<32>;

export circuit castVote(proposalTopic: Bytes<32>): Void {
    // 1. Fetch private inputs locally
    const secret = getVoterSecret();
    const choice = getVoteChoice();
    
    // 2. Validate vote selection
    assert choice == 0 || choice == 1 "Vote choice must be 0 or 1";
    
    // 3. Compute unique deterministic nullifier
    const nullifier = hash(secret, proposalTopic);
    assert !nullifiers.member(nullifier) "Double voting detected: Nullifier already spent";
    
    // 4. Update public state via disclose
    nullifiers.insert(nullifier);
    if (choice == 1) {
        yesVotes.increment(1);
    } else {
        noVotes.increment(1);
    }
}
```
