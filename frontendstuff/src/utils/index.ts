// Contract Instance
export { getContractInstance, getContractWithProvider } from './contractInstance';

// Read Functions
export {
  getBalance,
  getTotalSupply,
  getTimeUntilNextRequest,
  getRemainingMintableSupply,
  getOwner,
  getName,
  getSymbol,
  getDecimals,
  getAllowance,
  getLastRequestTime,
  getTotalMinted,
  getMaxSupply,
  getFaucetAmount,
  getCooldownTime,
} from './contractFunctions';

// Write Functions
export {
  requestToken,
  mint,
  transfer,
  approve,
  transferFrom,
  burn,
  increaseAllowance,
  decreaseAllowance,
} from './contractWriteFunctions';

// Wallet Functions
export {
  connectWallet,
  switchNetwork,
  addNetwork,
  addTokenToWallet,
} from './walletFunctions';

// Helper Functions
export {
  formatCooldownTime,
  formatAddress,
  formatTokenAmount,
  isValidAddress,
  isValidAmount,
  calculatePercentage,
} from './helperFunctions';
