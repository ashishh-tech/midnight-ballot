# Midnight Ballot - Deployment Guide

This guide walks you through deploying the Midnight Ballot contract to the Midnight Preprod testnet.

## Prerequisites

Before deploying, ensure you have:

1. **WSL2 with Node.js 22+** - Required for the Compact compiler
2. **Docker Desktop** - Running and configured with WSL2 integration
3. **Midnight Wallet** - Install [Lace Wallet](https://www.lace.io/) or use [Midnight CLI](https://docs.midnight.network/getting_started/)
4. **Testnet Tokens** - Get `tNIGHT` and `tDUST` from the [Midnight Faucet](https://faucet.midnight.network/)
5. **Proof Server** - Running locally on port 6300

## Step 1: Setup Proof Server

The proof server generates zero-knowledge proofs. Start it with Docker:

```bash
# Pull the proof server image
docker pull ghcr.io/midnightntwrk/prove-server:latest

# Run the proof server
docker run -d -p 6300:6300 ghcr.io/midnightntwrk/prove-server:latest
```

Verify it's running:
```bash
curl http://localhost:6300/health
```

## Step 2: Setup Your Wallet

### Option A: Using Lace Wallet (GUI)
1. Install [Lace Wallet](https://www.lace.io/)
2. Create a new wallet or import an existing one
3. Switch to **Preprod** network
4. Request testnet tokens from the faucet
5. Export your seed phrase (24 words) → Keep it safe!

### Option B: Using Midnight CLI
```bash
# Install Midnight CLI
npm install -g @midnight-ntwrk/midnight-cli

# Create a new wallet
midnight-cli wallet create --mnemonic

# Fund it from the faucet with your address
```

## Step 3: Update Environment

Add your wallet's seed phrase to `.env`:

```env
MNEMONIC="your 24-word seed phrase here"
```

⚠️ **WARNING:** Never commit `.env` to version control! It's already in `.gitignore`.

## Step 4: Compile the Contract

If on WSL, compile the contract:

```bash
npm run build
```

This generates the ZK circuits and proving keys in `managed/`.

## Step 5: Deploy the Contract

```bash
# Ensure you're in the WSL environment
npm run deploy
```

The script will:
1. Connect to the Preprod testnet indexer
2. Initialize your wallet
3. Generate ZK proofs for each circuit
4. Deploy the contract
5. Output the contract address

### Expected Output:
```
Connecting to Midnight Preprod Testnet...
Generating seed from mnemonic...
Initializing WalletBuilder...
Deploying contract...
✓ Contract deployed successfully!
Contract Address: <your_contract_address>
```

## Step 6: Verify Deployment

Once deployed, verify on the [Midnight Preprod Block Explorer](https://explorer.preprod.midnight.network/):

1. Navigate to the explorer
2. Search for your contract address
3. Confirm you can see:
   - Contract code
   - Initial state (`yesVotes: 0`, `noVotes: 0`, `topicHash: empty`)
   - Deployed transaction

## Troubleshooting

### Error: "Proof Server Connection Failed"
- Ensure Docker is running: `docker ps`
- Check proof server: `curl http://localhost:6300/health`
- Verify port 6300 is available

### Error: "Insufficient Balance"
- You need at least `0.1 tNIGHT` + `1 tDUST` for gas
- Request more tokens from the faucet
- Check balance in your wallet

### Error: "Mnemonic not found"
- Ensure `.env` has your seed phrase: `MNEMONIC="..."`
- Restart the deployment script

### Error: "Cannot find compact compiler"
- Run on WSL: `wsl`
- Install compiler: See main README Prerequisites section
- Run `source ~/.bashrc` after installation

## After Deployment

Once deployed, you can:

1. **View Contract State**: Use the Midnight CLI or SDK to query public ledger values
2. **Submit Transactions**: Call `openVoting`, `castVote`, `closeVoting` via the SDK
3. **Integrate with Frontend**: Use the contract's TypeScript API in `managed/contract/index.js`

## Next Steps

- Create a frontend UI to interact with the contract
- Implement voter registration with nullifiers
- Add multi-choice voting options
- Deploy to Mainnet when production-ready

---

For more details, see the [Midnight Documentation](https://docs.midnight.network/).
