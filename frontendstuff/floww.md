Phase 1: Wallet Connection (Start Here)

connectWallet() from walletFunctions.ts - Connect to MetaMask first
addNetwork() - Add Lisk Sepolia network if needed
Phase 2: Read Basic Info 3. getBalance() - Show user's token balance 4. getName() and getSymbol() - Display token info 5. getTotalSupply() - Show total supply

Phase 3: Faucet Feature (Core Functionality) 6. getTimeUntilNextRequest() - Check cooldown status 7. requestToken() - Claim tokens (write function) 8. formatCooldownTime() - Display countdown timer

Phase 4: Additional Features 9. transfer() - Send tokens to others 10. getRemainingMintableSupply() - Show remaining tokens 11. mint() - Owner-only function