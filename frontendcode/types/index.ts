import { Contract, BrowserProvider } from "ethers";

export interface Web3State {
  provider: BrowserProvider | null;
  signer: any;
  contract: Contract | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  error: string | null;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  totalSupplyRaw: bigint;
  maxSupply: string;
  maxSupplyRaw: bigint;
  faucetAmount: string;
  faucetAmountRaw: bigint;
  cooldownTime: number;
}

export interface SupplyInfo {
  totalSupply: string;
  totalSupplyRaw: bigint;
  totalMinted: string;
  totalMintedRaw: bigint;
  remainingMintable: string;
  remainingMintableRaw: bigint;
  maxSupply: string;
  maxSupplyRaw: bigint;
  supplyPercentage: number;
}

export interface CooldownInfo {
  timeRemaining: number;
  canRequest: boolean;
  lastRequestTime: number;
  nextRequestTime: number;
  formattedTime: string;
}

export interface TransactionState {
  loading: boolean;
  error: string | null;
  txHash: string | null;
}

export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
