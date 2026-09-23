# Midnight Ballot — Structured User Feedback & Code Evolution 🔄

This document details the **feedback loop and feedback-driven code improvements** for **Level 5 ("Full Moon")** and ongoing protocol development of Midnight Ballot on the **Midnight Preprod Testnet**.

---

## 🎯 Executive Summary: What We Heard vs. What We Changed

During user testing with community testers on Midnight Preprod, five key feedback themes emerged. The table below links each piece of user feedback directly to the code modifications implemented in the repository:

| # | What We Heard (Tester Feedback) | User Need / Root Cause | What We Changed (Implemented Code & Architecture) | File / Function Reference |
|---|---|---|---|---|
| **1** | *"I tried voting twice and wanted to ensure duplicate votes are rejected before incurring gas."* | Need client-side and on-chain double-voting prevention with clear error feedback. | Added client-side nullifier spend check, visual warning badge, and on-chain Set assertion in `castVote()` circuit. | [`contracts/ballot.compact:109`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact#L109), [`frontend/BallotApp.tsx:executeCastVote`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L210-L230) |
| **2** | *"The UI is great, but late-night governance voting needs a clean Dark/Light theme toggle."* | Accessibility and user preference for high-contrast viewing environments. | Added interactive theme toggle with dynamic CSS variable integration across all cards, modals, inputs, and background meshes. | [`frontend/BallotApp.tsx:themeToggleBtn`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L370-L380), [`frontend/styles/globals.css:10-35`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/styles/globals.css#L10-L35) |
| **3** | *"Only the proposal creator should be able to open or close the vote, and quorum should be enforced."* | Unauthorized callers could close votes prematurely or tamper with proposal parameters. | Added `adminPublicKey` ledger state and `getAdminKey` witness check in `openVoting()` and `closeVoting()`, with strict quorum enforcement (`yesVotes + noVotes >= minimumQuorum`). | [`contracts/ballot.compact:81-145`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact#L81-L145), [`src/test/ballot.test.ts`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/src/test/ballot.test.ts) |
| **4** | *"When Lace wasn't installed, the app had a confusing mock fallback instead of showing me how to install Lace."* | Testers needed clear onboarding instructions for the native Midnight Lace extension. | Removed demo wallet fallback; added an interactive Setup Lace Wallet modal with direct links to extension and Preprod faucet. | [`frontend/BallotApp.tsx:connectWallet`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L130-L195), [`frontend/BallotApp.tsx:modalCard`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L970-L995) |
| **5** | *"Voters wanted cryptographic proof/receipt of their participation without exposing their ballot choice."* | Need verifiable proof of submission for governance auditability. | Created `VoteReceipt` card generating cryptographic receipt containing nullifier, proposal ID, timestamp, and ZK proof identifier. | [`frontend/BallotApp.tsx:receiptCard`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx#L580-L600) |

---

## 🔍 Detailed Breakdown: Feedback Items & Code Implementations

### Feedback Item 1: Nullifier Double-Voting Rejection & Visual Feedback
- **What We Heard**: *"When testing Sybil resistance, we need clear feedback if someone attempts to submit multiple votes with the same wallet or secret."*
- **What We Changed**:
  1. Updated [`contracts/ballot.compact`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/contracts/ballot.compact) with deterministic nullifier derivation: `getNullifier(topicHash)` and ledger set insertion.
  2. Implemented client-side nullifier pre-check in `BallotApp.tsx` (`spentNullifiers.includes(currentNullifier)`) to display an immediate banner `⚠️ Double-Voting Prevented!` before submitting invalid transactions.
  3. Added automated test `should REJECT a duplicate vote with the same nullifier (double-vote prevention)` in [`src/test/ballot.test.ts`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/src/test/ballot.test.ts).

### Feedback Item 2: Dynamic Dark/Light Mode & Accessibility
- **What We Heard**: *"Provide a high-contrast theme toggle for daylight readability and accessibility."*
- **What We Changed**:
  1. Added `data-theme` state synchronization via React `useEffect` in [`frontend/BallotApp.tsx`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/BallotApp.tsx).
  2. Defined CSS variable tokens in [`frontend/styles/globals.css`](file:///c:/Users/name/Desktop/stellar/midnight-ballot/frontend/styles/globals.css) for `--bg-main`, `--bg-card`, `--text-main`, `--text-muted`, and `--border-color`.
  3. Styled all interactive elements (tabs, choice cards, witness inputs, modals) to dynamically adapt without page reload.

### Feedback Item 3: Admin Authorization & Minimum Quorum Threshold
- **What We Heard**: *"Proposals should only be opened and finalized by designated administrators, and polls shouldn't close without reaching quorum."*
- **What We Changed**:
  1. Added `adminPublicKey: Bytes<32>` ledger field to `ballot.compact`.
  2. Added `witness getAdminKey(): Bytes<32>` and circuit assertion `assert(disclosedKey == adminPublicKey, "Unauthorized: caller is not the admin")`.
  3. Added quorum check `assert(yesVotes + noVotes >= minimumQuorum, "Minimum voting quorum not reached")` in `closeVoting()`.
  4. Added Circuit Admin tab in `frontend/BallotApp.tsx` with admin key input, custom topic hash, and quorum threshold configuration.

### Feedback Item 4: Authentic Wallet Onboarding & Error Handling
- **What We Heard**: *"If Lace is missing or locked, give clear setup guidance rather than silently failing or using mock state."*
- **What We Changed**:
  1. Removed demo wallet generation.
  2. Integrated `@midnight-ntwrk/dapp-connector-api` for direct detection of `window.midnight.mnLace`.
  3. Created an interactive guidance modal detailing:
     - How to install Lace for Midnight
     - How to switch network to Midnight Preprod Testnet
     - How to request testnet tokens from the faucet

### Feedback Item 5: Anonymous Cryptographic Vote Receipts
- **What We Heard**: *"Voters wanted a shareable receipt confirming their vote was recorded without revealing whether they voted YES or NO."*
- **What We Changed**:
  1. Implemented client-side receipt generator in `BallotApp.tsx`.
  2. Formats transaction hash, spent nullifier commitment, proposal ID, and timestamp into a verified receipt card.

---

## 📈 In-App Feedback Collection & Ongoing Loop

The web application includes an interactive **User Feedback Tab** allowing voters and testnet users to submit live feedback:
- **Rating Categories**: Privacy & ZK Witness Transparency, Lace Wallet Connector, Vote Receipt Verification, Proof Speed.
- **Dynamic Star Rating**: 1 to 5 stars.
- **Session Feedback List**: Displays submitted feedback and suggestions in real time.
