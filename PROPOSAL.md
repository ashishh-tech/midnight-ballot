# 🗳️ Midnight Ballot — Project Proposal & Challenge Alignment

## 🏆 Challenge Information
* **Hackathon / Program**: **Rise In: Monthly Moonshots on Midnight**
* **Track Selected**: **Anonymous Voting / Privacy-Preserving Governance** *(and Dual-State ZK Applications)*
* **Milestones Target**: **Level 1 (New Moon) → Level 6 (Supermoon)**

---

## 📌 Problem Statement

Public blockchain governance (such as traditional DAO voting on Ethereum, Cardano, or Solana) suffers from fundamental privacy and fairness flaws:

1. **Voter Intimidation & Social Coercion**: Whales, employers, or governance leaders can see how individual community members vote in real-time, creating social pressure.
2. **Bandwagon Effect & Vote Buying**: Public live voting exposes running trends before the poll closes, swaying undecided voters.
3. **Double-Voting Risks**: Naive private voting schemes either leak the voter identity or allow Sybil attackers to vote multiple times.

---

## 💡 The Midnight Ballot Solution

**Midnight Ballot** leverages the **Midnight Network's Compact smart contract language** and dual-state zero-knowledge architecture to create a tamper-proof, private governance protocol:

* **Zero-Knowledge Vote Isolation**: Individual vote choices and voter identity remain strictly private inside client-side off-chain witnesses.
* **Cryptographic Nullifier Shield**: Deterministic nullifiers ($H(sk, topic)$) prevent double-voting on-chain without ever revealing the voter's private key.
* **On-Chain Verified Public Tallies**: The public ledger securely tallies the votes in real-time via zk-SNARK proofs, mathematically proving the final result is 100% authentic.
* **Admin Authorization & Minimum Quorum**: Contract-level assertions ensure only the designated poll administrator can open/close voting, and tallies cannot be finalized unless minimum quorum is met.

---

## 🏗️ Architecture & Stack Overview

* **Smart Contracts**: Compact (`contracts/ballot.compact`)
* **Frontend**: Next.js 14, React, TypeScript, Vanilla CSS design system
* **Wallet & Connector**: Midnight Lace Wallet DApp Connector
* **ZK Proof Generation**: Midnight Proof Server (Client-Side Prover)
* **Testing Framework**: Vitest & Compact VM Test Runner
* **CI/CD Pipeline**: GitHub Actions automated build & test workflow
