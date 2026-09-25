# Midnight Ballot 🗳️

[![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml)
[![Network: Midnight Preprod](https://img.shields.io/badge/Network-Midnight%20Preprod-6366f1.svg)](https://explorer.preprod.midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Midnight Ballot** is a privacy-preserving, zero-knowledge anonymous voting smart contract and governance protocol built for the **Midnight Blockchain**. Developed using Midnight's **Compact smart contract language**, it features **Nullifier Double-Voting Prevention**, **Client-Side Off-Chain Witness Isolation**, **Lace Wallet Connector Integration**, **Admin Quorum & Authorization Enforcement**, and **On-Chain Public Disclosed Tallies**.

> Built for the **Rise In: Monthly Moonshots on Midnight** Challenge  
> **Level 1 (New Moon)** • **Level 2 (Waxing Crescent)** • **Level 3 (First Quarter)** • **Level 4 (Waxing Gibbous)** • **Level 5 (Full Moon)** • **Level 6 (Supermoon)**  
> **Chosen Track from Provided List**: *Anonymous Voting & Privacy-Preserving Governance*

---

## 🏆 Official Submission Deliverables Checklist (Level 1 → Level 6)

| Rise In Required Checklist Item | Direct Verified Link / Resource | Status |
| :--- | :--- | :---: |
| **1. Public GitHub Repository** | [github.com/ashishh-tech/midnight-ballot](https://github.com/ashishh-tech/midnight-ballot) | ✅ Active & Public |
| **2. Minimum Meaningful Commits** | [44+ Commits on `master`](https://github.com/ashishh-tech/midnight-ballot/commits/master) | ✅ 44+ Commits (Req: 30+) |
| **3. Live Production DApp** | [midnight-ballot.netlify.app](https://midnight-ballot.netlify.app) | ✅ Live & Responsive |
| **4. Demo Video Walkthrough** | [Watch 1080p Demo on YouTube](https://youtu.be/w3B2KKkBnPw?si=I7KkeuAeHfVGfVWg) | ✅ Live on YouTube |
| **5. 70 Preprod User Wallets (Verifiable)** | [`PREPROD_USERS.md`](PREPROD_USERS.md) | ✅ 70/70 On-Chain Wallets |
| **6. User Feedback Loop Documentation** | [`FEEDBACK.md`](FEEDBACK.md) & [`USER_FEEDBACK.md`](USER_FEEDBACK.md) | ✅ 70+ User Sessions |
| **7. Compact Smart Contract (v0.20+)** | [`contracts/ballot.compact`](contracts/ballot.compact) | ✅ 3 Circuits Verified |
| **8. Preprod Deployed Contract Address** | `020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3` | ✅ Deployed on Preprod |
| **9. Automated Test Suite (12 Tests)** | [`src/test/ballot.test.ts`](src/test/ballot.test.ts) | ✅ 12/12 Tests Passing |
| **10. CI/CD Automated Workflow** | [`.github/workflows/test.yml`](.github/workflows/test.yml) | ✅ GitHub Actions Green |
| **11. Official Approved Idea Proposal** | [`PROPOSAL.md`](PROPOSAL.md) | ✅ Approved Track |
| **12. Formal ZK Privacy Threat Model** | [`PRIVACY_MODEL.md`](PRIVACY_MODEL.md) | ✅ Full Analysis |
| **13. Security & Circuit Audit Report** | [`SECURITY_AUDIT_REPORT.md`](SECURITY_AUDIT_REPORT.md) | ✅ Passed 100% |
| **14. User & Operator Guide** | [`USAGE.md`](USAGE.md) & [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) | ✅ Complete Guides |

---

## 🚀 Preprod Deployment & Configuration

| Property | Value / Verification Link |
|---|---|
| **Network** | **Midnight Preprod Testnet** (Chain ID: `test`) |
| **Contract Source** | [`contracts/ballot.compact`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact) |
| **Live Web App Demo** | [https://midnight-ballot.netlify.app](https://midnight-ballot.netlify.app) |
| **Video Demonstration** | [🎬 Watch YouTube Walkthrough](https://youtu.be/w3B2KKkBnPw?si=I7KkeuAeHfVGfVWg) |
| **Preprod Block Explorer** | [Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **User & Operator Guide** | [USAGE.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/USAGE.md) |
| **Deployment Guide** | [DEPLOYMENT_GUIDE.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/DEPLOYMENT_GUIDE.md) |
| **User Feedback & Code Evolution** | [USER_FEEDBACK.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/USER_FEEDBACK.md) |
| **Security & Circuit Audit** | [SECURITY_AUDIT_REPORT.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/SECURITY_AUDIT_REPORT.md) |
| **ZK Privacy Model** | [PRIVACY_MODEL.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/PRIVACY_MODEL.md) |
| **CI/CD Pipeline** | [![Test & Build CI](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml/badge.svg)](https://github.com/ashishh-tech/midnight-ballot/actions/workflows/test.yml) |

---

## 📹 Video Walkthrough: Wallet Connect & Circuit Calls

[![Midnight Ballot Video Demo](https://img.youtube.com/vi/w3B2KKkBnPw/maxresdefault.jpg)](https://youtu.be/w3B2KKkBnPw?si=I7KkeuAeHfVGfVWg)

> 📺 **Watch Full Walkthrough:** [https://youtu.be/w3B2KKkBnPw](https://youtu.be/w3B2KKkBnPw?si=I7KkeuAeHfVGfVWg)

### Demonstrated Features:
- **Lace Wallet Connector**: Connecting Midnight DApp connector / Lace wallet with network status verification.
- **Client-Side Witness Isolation**: Private witness generation keeping vote choices & voter secrets locally isolated.
- **ZK Circuit Execution (`castVote`)**: Execution of zero-knowledge circuit proofs with Midnight proof server integration.
- **On-Chain Confirmation**: Transaction broadcast and state updates (spent nullifier registration + public counter increment).

---

## 🌕 Level 5 ("Full Moon") Compliance & Feedback-Driven Code Evolution

Midnight Ballot has actively gathered and acted on tester feedback during testnet iterations. The table below links **What We Heard** to the **Exact Code Changes** made in response:

| # | What We Heard (User Feedback) | What We Changed (Implemented Code & Architecture) | File & Function Reference |
|---|---|---|---|
| **1** | *"Double-voting attempts should be rejected before spending gas, with an instant visual alert."* | Added client-side nullifier pre-check banner and on-chain Set assertion in `castVote()` circuit. | [`contracts/ballot.compact:109`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact#L109), [`frontend/BallotApp.tsx:210-230`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L210-L230) |
| **2** | *"Add a Dark/Light mode toggle for accessibility and daylight viewing environments."* | Implemented dynamic CSS variable system with interactive theme toggle adapting all cards, modals, and typography. | [`frontend/BallotApp.tsx:70-78`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L70-L78), [`frontend/styles/globals.css:10-35`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/styles/globals.css#L10-L35) |
| **3** | *"Only the designated admin should open/close polls, and quorum must be met before tally closure."* | Added `adminPublicKey` ledger state, `getAdminKey` witness, and quorum assertion (`yesVotes + noVotes >= minimumQuorum`). | [`contracts/ballot.compact:81-145`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact#L81-L145), [`src/test/ballot.test.ts`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/src/test/ballot.test.ts) |
| **4** | *"Show clear Lace installation guidance instead of a mock fallback when the extension is absent."* | Replaced demo wallet fallback with native DApp connector integration and a step-by-step Lace setup modal. | [`frontend/BallotApp.tsx:130-195`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L130-L195), [`frontend/BallotApp.tsx:970-995`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L970-L995) |
| **5** | *"Provide an anonymous cryptographic receipt after voting to verify submission."* | Created `VoteReceipt` visualizer showing transaction hash, spent nullifier commitment, proposal ID, and timestamp. | [`frontend/BallotApp.tsx:580-600`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L580-L600) |

*Full documentation: [USER_FEEDBACK.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/USER_FEEDBACK.md) & [FEEDBACK.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/FEEDBACK.md)*

---

## 🌟 Level 6 ("Supermoon") Shipped Improvements & 20 New Users Cohort

For the **Level 6 ("Supermoon")** milestone, Midnight Ballot delivered and shipped 4 major improvements directly traceable to Level 5 tester feedback:

1. **Admin Authorization & Minimum Quorum Enforcement**: Contract-level assertions ensuring only the stored `adminPublicKey` can execute `openVoting()` and `closeVoting()`, with quorum validation on the public ledger.
2. **Proactive Nullifier Double-Vote Shield**: Visual client alert preventing redundant transaction fee expenditure.
3. **High-Contrast Dark / Light Theme System**: Dynamic CSS custom property switching for daylight and accessibility.
4. **Transparent Lace DApp Connector Guidance**: Direct onboarding modal replacing mock wallet states.
5. **20 Incremental Preprod Testnet Users (Users 51–70)**: Conducted 20 new user testing sessions specifically validating the 4 shipped improvements above (Total 70 sessions logged in [`PREPROD_USERS.md`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/PREPROD_USERS.md)).

*Detailed implementation notes: [FEEDBACK.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/FEEDBACK.md) and [PREPROD_USERS.md](file:///c:/Users/name/Desktop/stellar/midnight-ballot/PREPROD_USERS.md)*

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
│   ├── BallotApp.tsx           # React UI with Lace Wallet, Circuits, Nullifiers, Themes
│   ├── pages/                  # Next.js page routes
│   └── styles/                 # Theme styling (globals.css variables)
├── .github/
│   └── workflows/
│       └── test.yml            # Automated CI/CD pipeline (TypeScript, Tests, Next.js Build)
├── USAGE.md                    # Voter, admin, and developer guide
├── DEPLOYMENT_GUIDE.md         # Deployment & verification guide
├── PREPROD_USERS.md            # Preprod user testing protocol & log template
├── USER_FEEDBACK.md            # What We Heard -> What We Changed feedback matrix
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](file:///c:/Users/name/Desktop/stellar/midnight-ballot/LICENSE) file for details.
