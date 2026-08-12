import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { ZKConfigProvider } from '@midnight-ntwrk/midnight-js-types';
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
    async getProverKey(circuitId: string): Promise<Uint8Array> {
        const filePath = path.join(process.cwd(), 'managed', 'keys', `${circuitId}.prover`);
        return fs.readFileSync(filePath);
    }
    async getVerifierKey(circuitId: string): Promise<Uint8Array> {
        const filePath = path.join(process.cwd(), 'managed', 'keys', `${circuitId}.verifier`);
        return fs.readFileSync(filePath);
    }
    async getZKIR(circuitId: string): Promise<Uint8Array> {
        const filePath = path.join(process.cwd(), 'managed', 'zkir', `${circuitId}.zkir`);
        return fs.readFileSync(filePath);
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

    console.log('🔑 Generating seed from mnemonic...');
    const seedBytes = mnemonicToSeedSync(mnemonic).subarray(0, 32);
    const seed = seedBytes.toString('hex');
    
    const indexerUrl = 'https://indexer.preprod.midnight.network/api/v4/graphql';
    const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
    const proofServerUrl = 'http://127.0.0.1:6300';
    const nodeUrl = 'https://rpc.preprod.midnight.network';
    
    console.log('🌐 Initializing Midnight Wallet...');
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

    const providers = {
        privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: 'ballot-private-state',
            midnightDbName: 'ballot-db',
            accountId: crypto.randomBytes(16).toString('hex'), 
            privateStoragePasswordProvider: async () => 'password123Secure!@#',
        }),
        publicDataProvider: indexerPublicDataProvider(indexerUrl, indexerWsUrl),
        zkConfigProvider,
        proofProvider: httpClientProofProvider(proofServerUrl, zkConfigProvider),
        walletProvider: new FacadeWalletProvider(wallet),
        midnightProvider: new FacadeMidnightProvider(wallet)
    };

    await new Promise(r => setTimeout(r, 1000));

    console.log('📜 Submitting deployment transaction to Preprod...');
    
    const witnesses = {
        getVoterSecret: (ctx: any) => [ctx.currentPrivateState, new Uint8Array(32)],
        getVoteChoice: (ctx: any) => [ctx.currentPrivateState, 0n],
    };

    try {
        const baseContract = CompiledContract.make('ballot', Contract as any);
        const compiledContract = CompiledContract.withWitnesses(baseContract, witnesses as any);
        const deploymentResult = await deployContract(providers, {
            compiledContract: compiledContract as any,
            privateStateId: 'ballot-private-state',
            initialPrivateState: {}
        });
        
        console.log(`\n=================================================`);
        console.log(`✅ Contract deployed successfully!`);
        const address = (deploymentResult as any).contractAddress || (deploymentResult as any).address || (deploymentResult as any).deployTxData?.public?.contractAddress || JSON.stringify(deploymentResult);
        console.log(`✅ Contract Address: ${address}`);
        console.log(`=================================================\n`);
    } catch (e) {
        console.error('Deployment Result / Status:', e);
    } finally {
        await wallet.close();
    }
}

main().catch(console.error);
