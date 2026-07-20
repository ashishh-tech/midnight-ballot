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

### Deployment to Testnet

To deploy to the Midnight Preprod testnet:
1. Ensure your Docker-based Proof Server is running.
2. Create a Midnight compatible wallet (e.g., Lace) on the Preprod network.
3. Obtain tNIGHT and tDUST from the Midnight faucet.
4. Export your hex seed or connect via the Midnight CLI to execute a deploy command targeting the compiled output in `managed/`.

---
*Created for Midnight Hackathon 2026.*
