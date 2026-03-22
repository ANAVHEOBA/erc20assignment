// Manual integration test - Run this in browser console or create a simple UI
// This tests the most basic flow: connect wallet -> read balance

import { connectWallet } from './utils/walletFunctions';
import { getContractInstance } from './utils/contractInstance';
import { getBalance, getName, getSymbol } from './utils/contractFunctions';

export async function testBasicFlow() {
  try {
    console.log('Step 1: Connecting wallet...');
    const { signer, account } = await connectWallet();
    console.log('✓ Connected:', account);

    console.log('\nStep 2: Getting contract instance...');
    const contract = getContractInstance(signer);
    console.log('✓ Contract loaded');

    console.log('\nStep 3: Reading token info...');
    const name = await getName(contract);
    const symbol = await getSymbol(contract);
    console.log(`✓ Token: ${name} (${symbol})`);

    console.log('\nStep 4: Reading balance...');
    const balance = await getBalance(contract, account);
    console.log(`✓ Your balance: ${balance} ${symbol}`);

    return { account, name, symbol, balance };
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Usage: import and call testBasicFlow() from your component or console
