# Midnight Ballot 🗳️

[![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml)

An anonymous, privacy-preserving voting smart contract and governance protocol built for the Midnight blockchain with **Nullifier Double-Voting Prevention** and **Real Midnight Wallet Integration**.

---

## Product Overview & ZK Architecture

**Anonymous Governance & Survey Protocol — Private Witness Vote, Public Nullifier Registry, Disclosed Count.**

Midnight Ballot enables privacy-preserving governance polls on Midnight blockchain. Each voter's identity and individual vote choice remain strictly private off-chain witness data (`getVoterSecret`, `getVoteChoice`), while:
1. **Nullifier Double-Voting Prevention**: Each voter generates a deterministic ZK nullifier (`hash(secret, topicHash)`). Nullifiers are disclosed and recorded on-chain in `export ledger nullifiers: Set<Bytes<32>>` to prevent duplicate votes anonymously.
2. **Private Voter Eligibility Verification**: Voters prove membership in an authorized voter group using ZK commitment proofs without revealing their identity.
3. **Configurable Quorum & Rules**: Enforces minimum quorum thresholds (`minimumQuorum`) before a poll can be closed.
4. **Real Midnight Wallet Integration**: Frontend connects natively via `@midnight-ntwrk/dapp-connector-api` to Midnight Lace Wallet.

---

## Privacy Model: What an Observer Can & Cannot Learn

| Data Element | Visibility | Storage Location | Protection / Guarantee |
|---|---|---|---|
| **Aggregate Vote Tally** | 🌐 Public | On-Chain Ledger (`yesVotes`, `noVotes`) | Disclosed via ZK Circuits |
| **Spent Nullifiers** | 🌐 Public | On-Chain Ledger (`nullifiers: Set<Bytes<32>>`) | Prevents double-voting anonymously |
| **Quorum & Rules** | 🌐 Public | On-Chain Ledger (`minimumQuorum`, `isOpen`) | Enforced by ZK Circuits |
| **Voter Identity / Key** | 🔒 Private | Off-Chain Client Witness (`getVoterSecret`) | NEVER sent to blockchain |
| **Individual Vote Choice** | 🔒 Private | Off-Chain Client Witness (`getVoteChoice`) | Hidden behind ZK-SNARK proof |
| **Eligibility Proof** | 🔒 Private | Off-Chain Client Witness (`getEligibilityProof`) | Verified against Merkle root |

---

## Getting Started

### Prerequisites

> **Note for Windows Users:** The Midnight Compact compiler requires a Linux environment (WSL2).

1. **WSL2** (Windows only) - Run `wsl --install` from an Admin terminal and restart.
2. **Node.js 22+** - Install inside your WSL environment.
3. **Docker Desktop** - Required for the local proof server.
4. **Compact Compiler** - Install inside WSL:
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
   source ~/.bashrc
   ```

### Setup & Compilation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile the Smart Contract (Inside WSL):**
   ```bash
   npm run build
   ```
   *Compiles `contracts/ballot.compact` and outputs ZK circuits, proving keys, and TypeScript bindings to `managed/`.*

### Testing

Run the test suite verifying nullifier double-voting prevention and ZK circuits:

```bash
npm run test
```

---

## Test Suite Results (6/6 Tests Passing)

```
✓ Midnight Ballot Contract (Simulated & Circuit Logic) (6)
  ✓ should initialize with zero votes and closed status
  ✓ should open voting with configured topic, quorum, and voter group root
  ✓ should cast a vote successfully and record nullifier on public ledger
  ✓ REJECTS double voting: second vote attempt with identical nullifier fails
  ✓ allows multiple unique voters with distinct nullifiers
  ✓ enforces minimum quorum rule before closing voting

Test Files  1 passed (1)
Tests  6 passed (6)
```

---

## Deployment Proof

- **Network Label:** `Midnight Preprod Testnet`
- **Contract Address / Contract ID:** `020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3`
- **Contract Explorer:** [Midnight Preprod Explorer](https://explorer.preprod.midnight.network/contract/020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3)

---

## Interactive Web Application

### Features
- **Real Midnight Wallet Integration**: Uses `@midnight-ntwrk/dapp-connector-api` for Lace Midnight Wallet.
- **Nullifier Registry**: Live view of spent nullifiers and duplicate vote rejection.
- **Anonymous Vote Receipts**: Cryptographic receipt generation per vote.
- **Privacy Audit Panel**: Visual breakdown of public vs. private states.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Live Demo URL:** https://midnight-ballot.netlify.app

---

## License

MIT
