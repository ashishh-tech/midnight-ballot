# Midnight Ballot Frontend

React/Next.js frontend for the Midnight Ballot voting contract.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Wallet Connection**: Connect via Lace wallet
- **Vote Casting**: Cast votes privately using witness data
- **Circuit Integration**: Calls `castVote` circuit on Midnight Preprod
- **Privacy Demonstration**: Shows public state vs private witnesses

## Deployment

Deploy to Netlify:

```bash
npx netlify deploy --prod
```

Or build and export as static site:

```bash
npm run build
npm run export
```

## Environment Variables

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3
NEXT_PUBLIC_PREPROD_RPC=https://rpc.preprod.midnight.network
```
