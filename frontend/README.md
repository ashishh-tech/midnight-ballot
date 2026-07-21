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

Deploy to Vercel:

```bash
vercel deploy
```

Or build and export as static site:

```bash
npm run build
npm run export
```

## Environment Variables

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xac1b8cf244467604f60ff7a15f05edb779157c03
NEXT_PUBLIC_PREPROD_RPC=https://rpc.preprod.midnight.network
```
