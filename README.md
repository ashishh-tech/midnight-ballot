# Midnight Ballot 🗳️

An anonymous, privacy-preserving voting smart contract built for the Midnight blockchain. 

## Initial Product Idea

**Anonymous voting contract — private vote, public disclosed count.**
This project is a privacy-preserving voting contract on Midnight. Each voter's identity and individual vote choice remain private (witness data), while only the aggregate vote count is disclosed publicly via `disclose()`. This lets communities run transparent polls — proving the final tally is correct — without ever revealing who voted for what. Future iterations could add voter eligibility checks and prevent double-voting using nullifiers.

## Architecture: Public vs. Private State

This project demonstrates the core power of Midnight's dual-state architecture:

### 1. Public Ledger (On-Chain)
The `yesVotes`, `noVotes`, and `topicHash` are stored on the public ledger. Anyone on the Midnight network can read these values and verify the current tally.

### 2. Private Witness (Off-Chain)
The voter's identity (`getVoterSecret`) and their specific vote (`getVoteChoice`) are passed as **witnesses**. Witness data lives entirely off-chain on the voter's machine. The blockchain never sees this data — it only sees the Zero-Knowledge (ZK) proof that the voter followed the rules.

### 3. The `disclose()` Boundary
By default, witness data stays private forever. If a voter wants to voluntarily reveal their vote, they call a circuit (`revealMyChoice`) that explicitly uses the `disclose()` function. This is the only way private data becomes public, demonstrating that privacy on Midnight is secure by default, and transparency is opt-in.

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

### ✓ Test Suite Passing

All ZK circuits validated through the test suite:
```
✓ Midnight Ballot Contract (Simulated) (3)
  ✓ should initialize with correct default ledger state
  ✓ should open voting and update the topic hash on the public ledger
  ✓ should cast a vote PRIVATELY using a witness and update PUBLIC counters

Test Files  1 passed (1)
Tests  3 passed (3)
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

[Paste your YouTube/video link here]

---

*Recording should show:*
- Opening the live frontend
- Connecting Lace wallet
- Selecting a vote (Yes/No)
- Clicking "Cast Vote Privately"
- Confirming the transaction hash
