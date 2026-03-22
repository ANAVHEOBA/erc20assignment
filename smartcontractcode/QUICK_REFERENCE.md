# 🚀 Quick Reference Card

## Contract Address
```
0x49728D5c119C0497c2478CD54c63097ed47Ce9E1
```

## Network Config
```javascript
{
  chainId: 4202,
  name: 'Lisk Sepolia',
  rpc: 'https://rpc.sepolia-api.lisk.com',
  explorer: 'https://sepolia-blockscout.lisk.com'
}
```

## Token Info
- **Symbol**: BRG
- **Name**: BridgeToken
- **Decimals**: 18
- **Max Supply**: 10,000,000

## Key Functions

### Read (5 required)
```typescript
balanceOf(address) → uint256
totalSupply() → uint256
getTimeUntilNextRequest(address) → uint256  // For countdown!
remainingMintableSupply() → uint256
owner() → address
```

### Write (3 required)
```typescript
requestToken()  // Claim 100 tokens every 24h
mint(address, uint256)  // Owner only
transfer(address, uint256)  // Send tokens
```

## Countdown Timer Formula
```typescript
const seconds = await contract.getTimeUntilNextRequest(userAddress);
const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
const secs = seconds % 60;
// Display: "Retry in {hours}h {minutes}m {secs}s"
```

## Import Contract
```typescript
import { ethers } from 'ethers';
import ABI from './CONTRACT_ABI.json';

const contract = new ethers.Contract(
  '0x49728D5c119C0497c2478CD54c63097ed47Ce9E1',
  ABI,
  signer
);
```

## Test on Block Explorer
https://sepolia-blockscout.lisk.com/address/0x49728D5c119C0497c2478CD54c63097ed47Ce9E1

## Get Testnet ETH
https://sepolia-faucet.lisk.com/

---
**Status**: ✅ DEPLOYED & TESTED  
**Tests Passed**: 71/71  
**Ready for**: Frontend Integration
