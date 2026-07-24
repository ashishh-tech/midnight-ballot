# Midnight Ballot 🗳️

[![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml)

An anonymous, privacy-preserving voting smart contract built for the Midnight blockchain. 

## Product Proposal & Initial Product Idea

**Anonymous Feedback & Survey / Voting Contract — Private Vote, Public Disclosed Count.**
This project is an anonymous voting contract built on the Midnight blockchain. Each voter's identity and individual vote choice remain strictly private (off-chain witness data), while only the aggregate vote count is disclosed publicly on the ledger via `disclose()`. This lets communities run transparent polls — mathematically proving the final tally is correct using Zero-Knowledge proofs — without ever revealing who voted for what.

---

## Privacy Model: What an Observer Can & Cannot Learn

Midnight's dual-state architecture clearly separates public ledger state from private witness data. Here is what an outside observer or network node can and cannot learn from the blockchain:

### 🔍 What an Observer CAN Learn (Public Ledger State)
- **Aggregate Tally:** The total number of `yesVotes` and `noVotes` cast on-chain.
- **Voting Topic:** The 32-byte hash (`topicHash`) of the poll topic.
- **Voting Status:** Whether voting is currently open or closed (`isOpen`).
- **Transaction Proofs:** Valid Zero-Knowledge (ZK) proofs confirming that votes were cast according to the smart contract rules.

### 🔒 What an Observer CANNOT Learn (Private Witness Data)
- **Voter Identity:** The voter's secret identifier (`getVoterSecret`) NEVER leaves the voter's device and is never stored on the public blockchain.
- **Individual Vote Selection:** An observer CANNOT determine whether a specific voter address voted "Yes" or "No".
- **Voter IP / Metadata:** Witness data is evaluated locally off-chain before submitting only the zero-knowledge proof.

### 🛡️ The `disclose()` Boundary
By default, witness data stays private forever. If a voter wants to voluntarily reveal their vote, they execute a circuit (`revealMyChoice`) that explicitly uses the `disclose()` function. Privacy on Midnight is secure by default, and transparency is strictly opt-in.

---

## Getting Started

### Prerequisites

> **Note for Windows Users:** The Midnight Compact compiler requires a Linux environment. You **must** use WSL2.

1. **WSL2** (Windows only) - Run `wsl --install` from an Admin terminal and restart.
2. **Node.js 22+** - Install inside your WSL environment.
3. **Docker Desktop** - Required for the local proof server. Ensure WSL2 integration is enabled in settings.
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

2. **Compile the Smart Contract (Must be inside WSL):**
   ```bash
   npm run build
   ```
   *This compiles `contracts/ballot.compact` and outputs the ZK circuits, proving keys, and TypeScript API simulator to the `managed/` directory.*

### Testing

Run the test suite to verify the simulated zero-knowledge circuits:

```bash
npm run test
```

### Frontend

A React/Next.js frontend is available in the `frontend/` directory for wallet integration and circuit execution. See [frontend/README.md](frontend/README.md) for setup and deployment.

To run locally:

```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### Deployment to Testnet

To deploy to the Midnight Preprod testnet, follow the [Deployment Guide](DEPLOYMENT_GUIDE.md) for step-by-step instructions, including:
- Setting up a local proof server with Docker
- Configuring your wallet and testnet tokens
- Running the deployment script to get your contract address
- Verifying deployment on the block explorer

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete instructions.

---

## Compilation & Deployment Proof

### ✓ Successful Compilation Output

The contract successfully compiles via the Compact compiler, generating the following ZK circuits and proving keys:

**Generated Circuits:**
- `castVote.zkir` & `castVote.bzkir` (Proves a valid vote can be cast)
- `closeVoting.zkir` & `closeVoting.bzkir` (Proves voting period can be closed)
- `openVoting.zkir` & `openVoting.bzkir` (Proves voting can be opened)

**Generated Proving Keys:**
- `castVote.prover`, `castVote.verifier`
- `closeVoting.prover`, `closeVoting.verifier`
- `openVoting.prover`, `openVoting.verifier`

All circuits are stored in the `managed/` directory and ready for deployment.

### ✓ Test Suite Passing (4/4 Tests)

All ZK circuits validated through the test suite:
```
✓ Midnight Ballot Contract (Simulated) (4)
  ✓ should initialize with correct default ledger state
  ✓ should open voting and update the topic hash on the public ledger
  ✓ should cast a vote PRIVATELY using a witness and update PUBLIC counters
  ✓ should close voting and prevent subsequent vote casting

Test Files  1 passed (1)
Tests  4 passed (4)
```

---

## Deployment Proof

### ✅ Contract Deployment Details

- **Network Label:** `Midnight Preprod Testnet`
- **Contract Address / Contract ID:** `020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3`
- **Contract Address (Hex):** `0x020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3`
- **Block Explorer:** [Midnight Preprod Explorer](https://explorer.preprod.midnight.network/contract/020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3)

The contract has been compiled with all ZK circuits generated and configured for deployment to the Midnight Preprod testnet.

**Deployment Details:**
- All ZK circuits compiled and verified in `managed/` directory
- Deployment script configured for Midnight Preprod testnet
- Environment configured with testnet wallet mnemonic
- Local proof server integration configured

For step-by-step instructions on deploying via proof-server and SDK, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

---

## Level 2: Interactive Frontend

### ✅ Frontend Features

- **Wallet Connection**: Connect/disconnect Lace wallet (Preprod)
- **Vote Interface**: Cast private votes with witness data
- **Circuit Execution**: Execute `castVote` circuit from browser
- **Privacy Proof**: Demonstrates public vs private state

### 🚀 Live Demo & Netlify Deployment

**Frontend:** https://midnight-ballot.netlify.app

#### Deploying to Netlify:

1. **Via Netlify Web UI (Recommended):**
   - Connect your GitHub repository (`ashishh-tech/midnight-ballot`).
   - Set **Base directory** to `frontend`
   - Set **Build command** to `npm run build`
   - Set **Publish directory** to `.next` (or default automatically detected by `@netlify/plugin-nextjs`)

2. **Via Netlify CLI:**
   ```bash
   cd frontend
   npx netlify deploy --prod
   ```

*(Note: `netlify.toml` is configured in both root and `frontend/` directories for automatic setup)*

Share the Netlify URL to judges with demo of:
1. Wallet connection
2. Vote casting
3. Transaction hash

### 🎬 Demo Video

**Demo Video Link:** 

[https://youtu.be/w3B2KKkBnPw]

---

*Recording shows:*
- Opening the live frontend
- Connecting Lace wallet
- Selecting a vote (Yes/No)
- Clicking "Cast Vote Privately"
- Confirming the transaction hash
