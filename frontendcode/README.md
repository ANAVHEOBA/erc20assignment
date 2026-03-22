# BridgeToken DApp Frontend

A modern, responsive Web3 DApp for interacting with the BridgeToken (BRG) smart contract on Lisk Sepolia Testnet.

## 🎯 Features

### ✅ Assignment Requirements Met

#### Read Functions (5+ Required)
1. ✅ `balanceOf` - Display user token balance
2. ✅ `totalSupply` - Show current total supply
3. ✅ `getTimeUntilNextRequest` - Countdown timer for faucet
4. ✅ `remainingMintableSupply` - Show remaining mintable tokens
5. ✅ `owner` - Display contract owner
6. ✅ BONUS: name, symbol, decimals, allowance, totalMinted, etc.

#### Write Functions (3 Required)
1. ✅ `requestToken` - Claim 100 BRG every 24 hours
2. ✅ `mint` - Mint new tokens (owner only)
3. ✅ `transfer` - Send tokens to another address
4. ✅ BONUS: approve, burn

#### Special Features
- ✅ **Countdown Timer** - Shows "Retry in Xh Xm Xs" format
- ✅ **User-Specific** - Each user has their own cooldown
- ✅ **Real-time Updates** - Updates every second
- ✅ **Progress Bar** - Visual cooldown indicator

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Web3**: Ethers.js v6
- **Network**: Lisk Sepolia Testnet

## 📁 Project Structure

```
frontendcode/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with all components
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Wallet connection & network switcher
│   ├── BalanceCard.tsx     # User balance display
│   ├── FaucetCard.tsx      # Token faucet with countdown
│   ├── TransferCard.tsx    # Transfer tokens form
│   ├── MintCard.tsx        # Mint tokens (owner only)
│   ├── StatsCard.tsx       # Token statistics
│   ├── Footer.tsx          # Footer with links
│   └── index.ts            # Component exports
├── hooks/
│   ├── useWeb3.ts          # Core Web3 connection
│   ├── useTokenBalance.ts  # Balance hook
│   ├── useFaucetCooldown.ts # Countdown timer hook
│   ├── useSupplyInfo.ts    # Supply statistics
│   ├── useOwnerInfo.ts     # Owner information
│   ├── useRequestToken.ts  # Faucet hook
│   ├── useMintToken.ts     # Mint hook
│   ├── useTransferToken.ts # Transfer hook
│   └── index.ts            # Hook exports
├── lib/
│   ├── constants.ts        # Contract address & config
│   ├── abi.ts              # Contract ABI
│   └── utils.ts            # Helper functions
└── types/
    └── index.ts            # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Testnet ETH on Lisk Sepolia ([Get from faucet](https://sepolia-faucet.lisk.com/))

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

The contract is already configured in `lib/constants.ts`:

```typescript
CONTRACT_ADDRESS = "0x49728D5c119C0497c2478CD54c63097ed47Ce9E1"
NETWORK = Lisk Sepolia Testnet (Chain ID: 4202)
```

## 📱 Usage Guide

### 1. Connect Wallet
- Click "Connect Wallet" in the navbar
- Approve MetaMask connection
- If on wrong network, click "Switch Network"

### 2. Claim Tokens (Faucet)
- Click "Claim 100 BRG" button
- Wait for transaction confirmation
- Countdown timer shows when you can claim again
- Format: "Retry in 11h 12m 15s"

### 3. Transfer Tokens
- Enter recipient address
- Enter amount to send
- Click "Send Tokens"
- Confirm transaction in MetaMask

### 4. Mint Tokens (Owner Only)
- Only visible if you're the contract owner
- Enter recipient address
- Enter amount to mint
- Click "Mint Tokens"

### 5. View Statistics
- Total Supply
- Total Minted
- Remaining Mintable
- Max Supply
- Minting progress bar

## 🎨 Features Showcase

### Countdown Timer
```typescript
// Updates every second
"Retry in 23h 59m 45s"
"Retry in 12h 30m 15s"
"Retry in 5m 30s"
"Ready to claim!"
```

### Real-time Balance Updates
- Automatically refreshes after transactions
- Shows formatted balance with decimals
- Displays both short and full amounts

### Network Detection
- Automatically detects connected network
- Shows warning if on wrong network
- One-click network switching

### Transaction Feedback
- Loading states during transactions
- Success messages with explorer links
- User-friendly error messages
- Transaction hash display

## 🔐 Security Features

- Input validation for addresses and amounts
- Error handling for all transactions
- Network verification before actions
- Owner-only functions protected
- No private key storage

## 🌐 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Deploy to Netlify

```bash
# Build the app
npm run build

# Deploy to Netlify
# Drag and drop the .next folder
```

### Environment Variables

No environment variables needed! Everything is configured in the code.

## 📊 Contract Information

- **Address**: `0x49728D5c119C0497c2478CD54c63097ed47Ce9E1`
- **Network**: Lisk Sepolia Testnet
- **Chain ID**: 4202
- **Explorer**: [View on Blockscout](https://sepolia-blockscout.lisk.com/address/0x49728D5c119C0497c2478CD54c63097ed47Ce9E1)

## 🧪 Testing Checklist

- [x] Connect wallet
- [x] Switch network
- [x] Display balance
- [x] Request tokens from faucet
- [x] Countdown timer works
- [x] Timer is user-specific
- [x] Transfer tokens
- [x] Mint tokens (owner)
- [x] View statistics
- [x] Responsive design
- [x] Dark mode support
- [x] Error handling
- [x] Transaction links

## 🎯 Assignment Compliance

✅ React with TypeScript  
✅ 5+ Read Functions Integrated  
✅ 3 Write Functions (requestToken, mint, transfer)  
✅ Countdown Timer ("Retry in Xh Xm Xs")  
✅ User-specific cooldown  
✅ Good architecture with hooks  
✅ Deployed and tested  
✅ Code on GitHub  

## 📝 Notes

- All hooks are modular and reusable
- Components are fully typed with TypeScript
- Responsive design works on all devices
- Dark mode supported automatically
- Optimized for performance

## 🐛 Troubleshooting

### MetaMask not detected
- Install MetaMask extension
- Refresh the page

### Wrong network
- Click "Switch Network" button
- Or manually add Lisk Sepolia in MetaMask

### Transaction failed
- Check you have enough testnet ETH for gas
- Verify you're on correct network
- Check cooldown period for faucet

### Countdown not updating
- Refresh the page
- Check browser console for errors

## 📚 Resources

- [Contract Source Code](../smartcontractcode/)
- [Lisk Documentation](https://docs.lisk.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contributing

This is an assignment project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this code for learning!

---

Built with ❤️ using Next.js, TypeScript, and Ethers.js
