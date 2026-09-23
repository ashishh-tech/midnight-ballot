# Midnight Ballot 🗳️

[![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml)
[![Network: Midnight Preprod](https://img.shields.io/badge/Network-Midnight%20Preprod-6366f1.svg)](https://explorer.preprod.midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Midnight Ballot** is a privacy-preserving, zero-knowledge anonymous voting smart contract and governance protocol built for the **Midnight Blockchain**. Developed using Midnight's **Compact smart contract language**, it features **Nullifier Double-Voting Prevention**, **Client-Side Off-Chain Witness Isolation**, **Lace Wallet Connector Integration**, **Admin Quorum & Authorization Enforcement**, and **On-Chain Public Disclosed Tallies**.

---

## 🚀 Preprod Deployment & Configuration

| Property | Value / Verification Link |
|---|---|
| **Network** | **Midnight Preprod Testnet** (Chain ID: `test`) |
| **Contract Source** | [`contracts/ballot.compact`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact) |
| **Live Web App Demo** | [https://midnight-ballot.netlify.app](https://midnight-ballot.netlify.app) |
| **Preprod Block Explorer** | [Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **CI/CD Pipeline** | [![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml) |

---

## 🔒 Privacy Model: What an Observer Can & Cannot Learn

Midnight Ballot enforces strict zero-knowledge data isolation. The table below provides a full cryptographic privacy specification:

| Data Element | Visibility | Storage Location | Cryptographic Guarantee / Mechanism |
|---|---|---|---|
| **Individual Vote Choice** | 🔒 **STRICTLY PRIVATE** | Client Off-Chain Witness (`getVoteChoice`) | Hidden behind ZK-SNARK circuit proof; never exposed on ledger. |
| **Voter Identity / Private Key** | 🔒 **STRICTLY PRIVATE** | Client Off-Chain Witness (`getVoterSecret`) | Kept strictly on the voter's local device. |
| **Eligibility Proof** | 🔒 **STRICTLY PRIVATE** | Client Off-Chain Witness (`getEligibilityProof`) | Proves membership in authorized voter group without revealing leaf index. |
| **Spent Nullifiers** | 🌐 **PUBLIC ON-CHAIN** | Public Ledger (`export ledger nullifiers: Set<Bytes<32>>`) | Cryptographic one-way hash (`hash(secret, topic)`) prevents double voting without revealing secret. |
| **Aggregate Vote Tally** | 🌐 **PUBLIC ON-CHAIN** | Public Ledger (`yesVotes: Counter`, `noVotes: Counter`) | Disclosed incrementally via `disclose()` inside `castVote()`. |
| **Governance Quorum & Admin** | 🌐 **PUBLIC ON-CHAIN** | Public Ledger (`minimumQuorum`, `isOpen`, `adminPublicKey`) | Enforced by circuits before poll opening and finalization. |

### 🔍 Cryptographic Proof Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    OFF-CHAIN CLIENT WITNESS                 │
│  [Voter Secret] + [Vote Choice (0/1)] + [Eligibility Proof] │
│  + [Deterministic Nullifier] + [Admin Key]                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼ ZK Prover (Proof Server)
┌─────────────────────────────────────────────────────────────┐
│                 COMPACT ZK CIRCUIT (castVote)               │
│  1. Verifies choice is 0 or 1                                │
│  2. Computes deterministic nullifier = hash(secret, topic)  │
│  3. Validates eligibility proof against group root          │
│  4. Asserts nullifier is NOT in ledger nullifiers set       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼ disclose(choice, nullifier)
┌─────────────────────────────────────────────────────────────┐
│                     ON-CHAIN PUBLIC LEDGER                  │
│  • nullifiers.insert(publicNullifier)                        │
│  • yesVotes / noVotes incremented                           │
│  • Observer learns: Tally + 1, Nullifier spent              │
│  • Observer DOES NOT learn: Who voted or what they picked   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Automated Test Suite (12/12 Passing)

The test suite runs unit and integration tests against the **Compact contract circuits** using `@midnight-ntwrk/compact-runtime` and Vitest:

```bash
$ npm test

 ✓ src/test/ballot.e2e.test.ts (1 test)
 ✓ src/test/ballot.test.ts (11 tests)
   ✓ should initialize contract ledger with zero votes and closed voting state
   ✓ should open voting and update public ledger topic hash and open status
   ✓ should cast a YES vote via ZK circuit and increment public yesVotes counter
   ✓ should cast a NO vote via ZK circuit and increment public noVotes counter
   ✓ should REJECT vote casting when voting is closed
   ✓ should REJECT a duplicate vote with the same nullifier (double-vote prevention)
   ✓ should REJECT a vote with empty eligibility proof
   ✓ should REJECT opening voting if voting is already open
   ✓ should REJECT closeVoting from a non-admin caller
   ✓ should REJECT closeVoting when quorum is not met
   ✓ should close voting successfully when quorum is met

 Test Files  2 passed (2)
      Tests  12 passed (12)
```

---

## 🛠️ Getting Started & Deployment

### Prerequisites

1. **Node.js 20+** (`node --version`).
2. **Compact Compiler** (v0.23+):
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
   source ~/.bashrc
   ```
3. **Docker Desktop** (for proof server `ghcr.io/midnightntwrk/prove-server:latest` on port `6300`).
4. **Lace Wallet** (Midnight edition) connected to Midnight Preprod Testnet.

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run unit & E2E tests
npm test

# 3. Build & Run Frontend
cd frontend
npm install
npm run dev
```

### Deploying to Preprod Testnet

1. Configure your `.env` file with your deployer wallet seed / mnemonic and proof server URL:
   ```env
   WALLET_MNEMONIC="your twelve or twenty four word seed phrase here..."
   PRIVATE_STATE_PASSWORD="your_secure_password"
   INDEXER_URL="https://indexer.preprod.midnight.network/api/v4/graphql"
   INDEXER_WS_URL="wss://indexer.preprod.midnight.network/api/v4/graphql/ws"
   PROOF_SERVER_URL="http://127.0.0.1:6300"
   NODE_URL="https://rpc.preprod.midnight.network"
   ```

2. Run the deployment script:
   ```bash
   npm run deploy
   ```

---

## 📁 Repository Structure

```
midnight-ballot/
├── contracts/
│   └── ballot.compact          # Compact smart contract (Ledger, Witnesses, Circuits)
├── managed/                    # Compact compiler generated bindings & circuits
│   └── contract/               # TypeScript contract bindings
├── scripts/
│   └── deploy.ts               # Preprod deployment script (deployContract)
├── src/
│   └── test/
│       ├── ballot.test.ts      # 11/11 Compact circuit simulator unit tests
│       └── ballot.e2e.test.ts  # End-to-end full lifecycle integration test
├── frontend/
│   ├── BallotApp.tsx           # React UI with Lace Wallet, Circuits, Nullifiers
│   ├── pages/                  # Next.js page routes
│   └── styles/                 # Theme styling
├── .github/
│   └── workflows/
│       └── test.yml            # Automated CI/CD pipeline (TypeScript, Tests, Next.js Build)
├── DEPLOYMENT_GUIDE.md         # Deployment & testing instructions
├── PREPROD_USERS.md            # Preprod user testing protocol & log template
├── USER_FEEDBACK.md            # User experience evaluation & feedback framework
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](file:///c:/Users/name/Desktop/stellar/midnight-ballot/LICENSE) file for details.
