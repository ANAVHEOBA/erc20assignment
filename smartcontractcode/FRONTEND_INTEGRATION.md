# Frontend Integration Guide

## 🎉 Contract Successfully Deployed!

Your BridgeToken contract is live on Lisk Sepolia Testnet and ready for frontend integration.

## 📋 Contract Details

- **Contract Address**: `0x49728D5c119C0497c2478CD54c63097ed47Ce9E1`
- **Network**: Lisk Sepolia Testnet
- **Chain ID**: 4202
- **Token Name**: BridgeToken
- **Token Symbol**: BRG
- **Decimals**: 18

## 🔗 Important Links

- **Block Explorer**: https://sepolia-blockscout.lisk.com/address/0x49728D5c119C0497c2478CD54c63097ed47Ce9E1
- **Deployment Transaction**: https://sepolia-blockscout.lisk.com/tx/0x82ea3d0b127073d2ddb3cad45c412d5f31ff0b14fce951679ce9837461b93e17
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Faucet**: https://sepolia-faucet.lisk.com/

## 📦 Files for Frontend

1. **CONTRACT_ABI.json** - Complete contract ABI
2. **deployment-info.json** - All deployment details and constants

## 🔧 Required Read Functions (5+)

Integrate these read functions in your frontend:

### 1. `balanceOf(address account) → uint256`
Get token balance of any address
```typescript
const balance = await contract.balanceOf(userAddress);
```

### 2. `totalSupply() → uint256`
Get current total supply
```typescript
const supply = await contract.totalSupply();
```

### 3. `getTimeUntilNextRequest(address user) → uint256`
Get seconds until user can request tokens again (CRITICAL for countdown timer)
```typescript
const timeRemaining = await contract.getTimeUntilNextRequest(userAddress);
// Convert to hours, minutes, seconds for display
```

### 4. `remainingMintableSupply() → uint256`
Get remaining tokens that can be minted
```typescript
const remaining = await contract.remainingMintableSupply();
```

### 5. `owner() → address`
Get contract owner address
```typescript
const ownerAddress = await contract.owner();
```

### Additional Read Functions:
- `name() → string` - Token name
- `symbol() → string` - Token symbol
- `decimals() → uint8` - Token decimals (18)
- `allowance(address owner, address spender) → uint256` - Check allowance
- `lastRequestTime(address user) → uint256` - Last request timestamp
- `totalMinted() → uint256` - Total tokens minted (including burned)
- `MAX_SUPPLY() → uint256` - Maximum supply (10M tokens)
- `FAUCET_AMOUNT() → uint256` - Faucet amount (100 tokens)
- `COOLDOWN_TIME() → uint256` - Cooldown period (86400 seconds = 24 hours)

## ✍️ Required Write Functions (3+)

### 1. `requestToken()`
Users claim 100 tokens every 24 hours
```typescript
const tx = await contract.requestToken();
await tx.wait();
```

**Important**: 
- Check `getTimeUntilNextRequest()` before calling
- Show countdown timer: "Retry in 11h 12m 15s"
- Handle "Cooldown period not elapsed" error gracefully

### 2. `mint(address to, uint256 amount)`
Owner mints tokens (only owner can call)
```typescript
const tx = await contract.mint(recipientAddress, amount);
await tx.wait();
```

### 3. `transfer(address recipient, uint256 amount)`
Transfer tokens to another address
```typescript
const tx = await contract.transfer(recipientAddress, amount);
await tx.wait();
```

### Additional Write Functions:
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address sender, address recipient, uint256 amount)` - Transfer from approved address
- `burn(uint256 value)` - Burn tokens
- `increaseAllowance(address spender, uint256 addedValue)` - Increase allowance
- `decreaseAllowance(address spender, uint256 subtractedValue)` - Decrease allowance

## 🎯 Countdown Timer Implementation

For the "retry in Xh Xm Xs" requirement:

```typescript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function useRequestCooldown(contract: ethers.Contract, userAddress: string) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canRequest, setCanRequest] = useState<boolean>(false);

  useEffect(() => {
    const updateCooldown = async () => {
      if (!userAddress) return;
      
      const remaining = await contract.getTimeUntilNextRequest(userAddress);
      const remainingSeconds = remaining.toNumber();
      
      setTimeRemaining(remainingSeconds);
      setCanRequest(remainingSeconds === 0);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000); // Update every second

    return () => clearInterval(interval);
  }, [contract, userAddress]);

  const formatTime = () => {
    if (timeRemaining === 0) return "Ready to claim!";
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    return `Retry in ${hours}h ${minutes}m ${seconds}s`;
  };

  return { timeRemaining, canRequest, formatTime };
}
```

## 🌐 MetaMask Network Configuration

Add Lisk Sepolia to MetaMask:

```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x106A', // 4202 in hex
    chainName: 'Lisk Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
    blockExplorerUrls: ['https://sepolia-blockscout.lisk.com']
  }]
});
```

## 📝 Example React Component

```typescript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from './CONTRACT_ABI.json';

const CONTRACT_ADDRESS = '0x49728D5c119C0497c2478CD54c63097ed47Ce9E1';

function TokenFaucet() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        const tokenContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );
        
        setContract(tokenContract);
        setUserAddress(address);
        
        // Get balance
        const bal = await tokenContract.balanceOf(address);
        setBalance(ethers.utils.formatEther(bal));
        
        // Get cooldown
        const remaining = await tokenContract.getTimeUntilNextRequest(address);
        setTimeRemaining(remaining.toNumber());
      }
    };
    
    init();
  }, []);

  const requestTokens = async () => {
    if (!contract) return;
    
    try {
      const tx = await contract.requestToken();
      await tx.wait();
      alert('Successfully claimed 100 BRG tokens!');
      
      // Refresh balance
      const bal = await contract.balanceOf(userAddress);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.error('Error requesting tokens:', error);
      alert('Failed to claim tokens. Check cooldown period.');
    }
  };

  return (
    <div>
      <h2>BridgeToken Faucet</h2>
      <p>Your Balance: {balance} BRG</p>
      <p>Cooldown: {timeRemaining === 0 ? 'Ready!' : `${timeRemaining}s remaining`}</p>
      <button onClick={requestTokens} disabled={timeRemaining > 0}>
        Claim 100 BRG
      </button>
    </div>
  );
}
```

## 🧪 Testing Checklist

- [ ] Connect wallet to Lisk Sepolia
- [ ] Display user's BRG balance
- [ ] Request tokens from faucet
- [ ] Show countdown timer after requesting
- [ ] Prevent requesting before cooldown expires
- [ ] Transfer tokens to another address
- [ ] Mint tokens (owner only)
- [ ] Display total supply
- [ ] Display remaining mintable supply
- [ ] Handle errors gracefully

## 🚨 Common Errors

### "Cooldown period not elapsed"
User tried to request tokens before 24 hours passed. Show countdown timer.

### "Faucet is empty"
Contract needs more tokens. Contact owner to transfer tokens to contract.

### "Ownable: caller is not the owner"
Non-owner tried to call mint(). Only owner can mint.

### "Minting would exceed MAX_SUPPLY"
Trying to mint more than the 10M max supply.

## 💡 Tips

1. Always format token amounts using `ethers.utils.formatEther()` for display
2. Use `ethers.utils.parseEther()` when sending amounts to contract
3. Listen to contract events for real-time updates
4. Cache read calls to reduce RPC requests
5. Show loading states during transactions
6. Display transaction hashes with block explorer links

## 🎨 UI Suggestions

- Show a progress bar for cooldown timer
- Display token logo (create one!)
- Show transaction history
- Add a "Add to MetaMask" button for the token
- Show gas estimates before transactions
- Display total supply vs max supply as a progress bar

## 📞 Support

- Contract Owner: `0x6D21167d874C842386e8c484519B5ddBBaB87b43`
- Need testnet ETH? https://sepolia-faucet.lisk.com/

Good luck with your frontend! 🚀
