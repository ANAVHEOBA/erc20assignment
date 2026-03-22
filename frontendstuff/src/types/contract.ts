export interface DeploymentInfo {
  network: string;
  chainId: number;
  contractAddress: string;
  contractName: string;
  tokenSymbol: string;
  tokenName: string;
  rpcUrl: string;
  blockExplorer: string;
  constants: {
    maxSupply: string;
    maxSupplyFormatted: string;
    faucetAmount: string;
    faucetAmountFormatted: string;
    cooldownTime: number;
    cooldownTimeFormatted: string;
  };
}

export interface TokenBalance {
  raw: string;
  formatted: string;
}
