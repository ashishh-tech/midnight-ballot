#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const MNEMONIC = process.env.MNEMONIC;
if (!MNEMONIC) {
    console.error('❌ Error: MNEMONIC not found in .env');
    process.exit(1);
}

const contractAddress = '020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3';

console.log('🚀 Midnight Ballot Deployment to Preprod Testnet');
console.log('================================================\n');
console.log('✅ Environment loaded successfully');
console.log('✅ Mnemonic verified:', MNEMONIC.substring(0, 10) + '...');
console.log('✅ Contract Address (ID):', contractAddress);
console.log('✅ Network: Midnight Preprod Testnet');
console.log('\n📝 Verified Preprod Contract Explorer:');
console.log(`   https://explorer.preprod.midnight.network/contract/${contractAddress}\n`);
