import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { ZKConfigProvider, ProverKey, VerifierKey, ZKIR } from '@midnight-ntwrk/midnight-js-types';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { mnemonicToSeedSync } from 'bip39';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { Contract } from '../managed/contract/index.js';
import * as CompiledContract from '@midnight-ntwrk/compact-js/effect/CompiledContract';

dotenv.config();

class LocalZkConfigProvider extends ZKConfigProvider<string> {
    async getProverKey(circuitId: string): Promise<ProverKey> {
        const filePath = path.join(process.cwd(), 'managed', 'keys', `${circuitId}.prover`);
        return fs.readFileSync(filePath) as unknown as ProverKey;
    }
    async getVerifierKey(circuitId: string): Promise<VerifierKey> {
        const filePath = path.join(process.cwd(), 'managed', 'keys', `${circuitId}.verifier`);
        return fs.readFileSync(filePath) as unknown as VerifierKey;
    }
    async getZKIR(circuitId: string): Promise<ZKIR> {
        const filePath = path.join(process.cwd(), 'managed', 'zkir', `${circuitId}.zkir`);
        return fs.readFileSync(filePath) as unknown as ZKIR;
    }
}

class FacadeWalletProvider {
    wallet: any;
    state: any;
    constructor(wallet: any) {
        this.wallet = wallet;
        this.wallet.state().subscribe((s: any) => {
            this.state = s;
        });
    }
    
    async balanceTx(tx: any, ttl: any) {
        return await this.wallet.balanceTransaction(tx, []);
    }

    getCoinPublicKey() {
        return this.state.coinPublicKey;
    }

    getEncryptionPublicKey() {
        return this.state.encryptionPublicKey;
    }
}

class FacadeMidnightProvider {
    wallet: any;
    constructor(wallet: any) {
        this.wallet = wallet;
    }

    async submitTx(tx: any): Promise<any> {
        return await this.wallet.submitTransaction(tx);
    }
}

async function main() {
    console.log('🚀 Deploying Midnight Ballot to Preprod Testnet...');
    setNetworkId('test');

    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error('Please set MNEMONIC in the .env file');
    }

    const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD;
    if (!privateStatePassword) {
        throw new Error(
            'Please set PRIVATE_STATE_PASSWORD in the .env file. ' +
            'This is used to encrypt your local private state store. ' +
            'Choose a strong password and do NOT hardcode it.'
        );
    }

    console.log('🔑 Generating seed from mnemonic...');
    const seedBytes = mnemonicToSeedSync(mnemonic).subarray(0, 32);
    const seed = seedBytes.toString('hex');
    
    const indexerUrl = process.env.INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v4/graphql';
    const indexerWsUrl = process.env.INDEXER_WS_URL || 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
    const proofServerUrl = process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300';
    const nodeUrl = process.env.RPC_NODE_URL || 'https://rpc.preprod.midnight.network';
    
    console.log('🌐 Initializing Midnight Wallet...');
    console.log(`[INFO] NetworkId: TestNet`);
    console.log(`[INFO] Indexer URL: ${indexerUrl}`);
    console.log(`[INFO] Indexer WS URL: ${indexerWsUrl}`);
    console.log(`[INFO] Proof Server URL: ${proofServerUrl}`);
    console.log(`[INFO] RPC Node URL: ${nodeUrl}`);

    const wallet = await WalletBuilder.build(
        indexerUrl,
        indexerWsUrl,
        proofServerUrl,
        nodeUrl,
        seed,
        zswap.NetworkId.TestNet,
        'info'
    );
    
    wallet.start();

    const zkConfigProvider = new LocalZkConfigProvider();

    const providers: any = {
        privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: 'ballot-private-state',
            midnightDbName: 'ballot-db',
            accountId: crypto.randomBytes(16).toString('hex'), 
            privateStoragePasswordProvider: async () => privateStatePassword,
        }),
        publicDataProvider: indexerPublicDataProvider(indexerUrl, indexerWsUrl),
        zkConfigProvider,
        proofProvider: httpClientProofProvider(proofServerUrl, zkConfigProvider as ZKConfigProvider<string>),
        walletProvider: new FacadeWalletProvider(wallet),
        midnightProvider: new FacadeMidnightProvider(wallet)
    };

    await new Promise(r => setTimeout(r, 1000));

    console.log('📜 Submitting deployment transaction to Preprod...');
    
    // Admin key for managing the ballot — derived from the deployer's mnemonic
    const adminKey = crypto.createHash('sha256').update(seedBytes).digest();

    const witnesses = {
        getVoterSecret: (ctx: any) => [ctx.currentPrivateState, new Uint8Array(32)],
        getVoteChoice: (ctx: any) => [ctx.currentPrivateState, 0n],
        getNullifier: (ctx: any, _topic: any) => [ctx.currentPrivateState, new Uint8Array(32)],
        getEligibilityProof: (ctx: any) => [ctx.currentPrivateState, new Uint8Array(32)],
        getAdminKey: (ctx: any) => [ctx.currentPrivateState, adminKey],
    };

    try {
        const baseContract = CompiledContract.make('ballot', Contract as any);
        const compiledContract = (CompiledContract as any).withWitnesses(baseContract, witnesses);
        const deploymentResult = await deployContract(providers as any, {
            compiledContract: compiledContract as any,
            privateStateId: 'ballot-private-state',
            initialPrivateState: {},
            args: []
        } as any);
        
        const address = (deploymentResult as any).contractAddress
            || (deploymentResult as any).address
            || (deploymentResult as any).deployTxData?.public?.contractAddress
            || JSON.stringify(deploymentResult);
        const txHash = (deploymentResult as any).deployTxData?.txHash
            || (deploymentResult as any).transactionId
            || 'Check Midnight Explorer for deployment tx';

        console.log(`\n=================================================`);
        console.log(`✅ Contract deployed successfully!`);
        console.log(`✅ Contract Address: ${address}`);
        console.log(`✅ Deployment Tx Hash: ${txHash}`);
        console.log(`✅ Network: Midnight Preprod Testnet`);
        console.log(`✅ Admin Key Hash: ${adminKey.toString('hex').substring(0, 16)}...`);
        console.log(`✅ Explorer: https://explorer.preprod.midnight.network/contract/${address}`);
        console.log(`=================================================`);
        console.log(`\n⚠️  IMPORTANT: Update README.md with the above contract address and tx hash!\n`);
    } catch (e) {
        console.error('Deployment Error:', e);
    } finally {
        await wallet.close();
    }
}

main().catch(console.error);
