// Contract Configuration
export const CONTRACT_ADDRESS = "0x49728D5c119C0497c2478CD54c63097ed47Ce9E1";

export const NETWORK_CONFIG = {
  chainId: 4202,
  chainIdHex: "0x106A",
  name: "Lisk Sepolia Testnet",
  rpcUrl: "https://rpc.sepolia-api.lisk.com",
  blockExplorer: "https://sepolia-blockscout.lisk.com",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

export const TOKEN_INFO = {
  name: "BridgeToken",
  symbol: "BRG",
  decimals: 18,
  maxSupply: "10000000000000000000000000", // 10M tokens
  faucetAmount: "100000000000000000000", // 100 tokens
  cooldownTime: 86400, // 24 hours in seconds
};

export const LINKS = {
  faucet: "https://sepolia-faucet.lisk.com/",
  explorer: `${NETWORK_CONFIG.blockExplorer}/address/${CONTRACT_ADDRESS}`,
  github: "https://github.com/yourusername/bridge-token", // Update this
};
