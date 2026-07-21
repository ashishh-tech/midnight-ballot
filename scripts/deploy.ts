import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { mnemonicToSeedSync } from 'bip39';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
import { Contract, pureCircuits, contractReferenceLocations } from '../managed/contract/index.js';

dotenv.config();

// Since @midnight-ntwrk/wallet 5.0 does not natively implement the MidnightProvider 
// and WalletProvider interfaces expected by midnight-js-contracts 4.1.1, we adapter it:
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
    console.log('Connecting to Midnight Preprod Testnet...');
    setNetworkId('test');

    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error('Please set MNEMONIC in the .env file');
    }

    console.log('Generating seed from mnemonic...');
    const seedBytes = mnemonicToSeedSync(mnemonic).subarray(0, 32);
    const seed = seedBytes.toString('hex');
    
    // Setup the endpoints for Preprod
    const indexerUrl = 'https://indexer.preprod.midnight.network/api/v4/graphql';
    const indexerWsUrl = 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws';
    const proofServerUrl = 'http://127.0.0.1:6300';
    const nodeUrl = 'https://rpc.preprod.midnight.network';
    
    console.log('Initializing WalletBuilder...');
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

    // The FetchZkConfigProvider requires a URL where the ZK configuration artifacts are stored.
    // Usually on local networks this is provided by the proving server or a static file server.
    const zkConfigUrl = 'http://127.0.0.1:6300';
    
    const providers = {
        privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: 'ballot-private-state',
            midnightDbName: 'ballot-db',
            accountId: crypto.randomBytes(16).toString('hex'), 
            privateStoragePasswordProvider: async () => 'password123Secure!@#',
        }),
        publicDataProvider: indexerPublicDataProvider(indexerUrl, indexerWsUrl),
        zkConfigProvider: new FetchZkConfigProvider(zkConfigUrl, fetch),
        proofProvider: httpClientProofProvider(proofServerUrl, new FetchZkConfigProvider(zkConfigUrl, fetch)),
        walletProvider: new FacadeWalletProvider(wallet),
        midnightProvider: new FacadeMidnightProvider(wallet)
    };

    console.log('Wallet Methods:', Object.keys(wallet));
    
    // Wait for wallet to initialize
    await new Promise(r => setTimeout(r, 1000));

    console.log('Deploying the Ballot contract...');
    
    try {
        const deploymentResult = await deployContract(providers, {
            compiledContract: {
                contractReferenceLocations,
                contractClass: Contract,
                pureCircuits
            } as any,
            args: [{
                getVoterSecret: (ctx: any) => [ctx.currentPrivateState, new Uint8Array(32)],
                getVoteChoice: (ctx: any) => [ctx.currentPrivateState, 0n]
            }]
        });
        
        console.log(`\n=================================================`);
        console.log(`✅ Contract deployed successfully!`);
        const address = (deploymentResult as any).contractAddress || (deploymentResult as any).address || JSON.stringify(deploymentResult);
        console.log(`✅ Contract Address: ${address}`);
        console.log(`=================================================\n`);
    } catch (e) {
        console.error('Deployment Failed:', e);
    } finally {
        await wallet.close();
    }
}

main().catch(console.error);
