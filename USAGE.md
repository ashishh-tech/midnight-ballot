# Midnight Ballot — User & Operator Guide 📖

This document provides complete instructions for voters, proposal administrators, and developers interacting with the **Midnight Ballot** privacy-preserving governance protocol on the **Midnight Preprod Testnet**.

---

## 🗳️ Part 1: Voter Guide

### 1. Prerequisites
- Install the **Lace Wallet (Midnight Edition)** browser extension.
- Switch your Lace wallet network to **Midnight Preprod Testnet**.
- Obtain testnet `tDUST` / `tNIGHT` from the [Midnight Preprod Faucet](https://faucet.preprod.midnight.network/).

### 2. Connecting Your Wallet
1. Navigate to the live web application at [https://midnight-ballot.netlify.app](https://midnight-ballot.netlify.app) (or your local `http://localhost:3000`).
2. Click **⚡ Connect Midnight Wallet** in the top navigation bar.
3. Approve the Lace DApp connector prompt. Your wallet address and balance will appear in the header.

### 3. Casting a Private Vote
1. Under the **Cast Private Vote** tab, select your choice:
   - **YES (Approve)**
   - **NO (Reject)**
2. In the **Client Off-Chain Witness Inputs** panel, review your private parameters:
   - **Voter Secret Key**: Your local identity secret (stays on your device).
   - **Computed Nullifier**: Deterministically derived `hash(secret, topicHash)`.
   - **Eligibility Proof**: Proof of group membership.
3. Click **🗳️ Execute `castVote()` Circuit**.
4. The application will:
   - Extract witness inputs locally.
   - Verify eligibility against the on-chain Merkle root.
   - Generate the ZK-SNARK proof using the Midnight Proof Server.
   - Disclose the nullifier to the public ledger to prevent double-voting.
   - Increment the public tally (`yesVotes` or `noVotes`) without disclosing your choice or identity.
5. Once confirmed, a **Cryptographic Vote Receipt** will be displayed with your transaction hash and spent nullifier.

### 4. Verifying Privacy & Double-Voting Prevention
- Click the **Spent Nullifiers** tab to see your nullifier listed in the public on-chain registry.
- Attempting to vote again on the same proposal will trigger the double-voting prevention guard and reject the submission.
- Click the **Privacy Witness Audit** tab to inspect the public vs. private data boundary.

---

## ⚙️ Part 2: Administrator Guide

### 1. Opening a New Governance Poll
1. Navigate to the **⚙️ Circuit Admin** tab.
2. Enter the **Admin Key Witness** matching the contract's `adminPublicKey`.
3. Provide proposal parameters:
   - **Topic Hash (Bytes<32>)**: Unique 32-byte identifier for the proposal.
   - **Minimum Quorum Threshold**: Minimum total votes required before finalization.
4. Click **🟢 Open Voting (`openVoting`)**.
5. The poll status transitions to `ACTIVE VOTING` and tallies reset.

### 2. Closing a Governance Poll
1. Navigate to the **⚙️ Circuit Admin** tab.
2. Enter your **Admin Key Witness**.
3. Click **🔴 Close Voting & Enforce Quorum (`closeVoting`)**.
4. The contract asserts:
   - The caller holds the authorized admin key.
   - Total votes cast (`yesVotes + noVotes`) meets or exceeds `minimumQuorum`.
5. Upon success, voting is finalized to `CLOSED` status.

---

## 💻 Part 3: Developer & CLI Usage

### Running Locally

```bash
# 1. Clone repo and install dependencies
git clone https://github.com/ashishh-tech/midnight-ballot.git
cd midnight-ballot
npm install

# 2. Run automated test suite (12/12 passing)
npm test

# 3. Start Frontend Development Server
cd frontend
npm install
npm run dev
```

### Running E2E Lifecycle Tests
```bash
npx vitest run src/test/ballot.e2e.test.ts
```

### Building for Production
```bash
# Compile Compact circuits & TypeScript
npm run build

# Build Next.js frontend
cd frontend
npm run build
```
