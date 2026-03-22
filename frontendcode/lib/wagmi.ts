import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';

// Define Lisk Sepolia chain
export const liskSepoliaChain = {
  ...liskSepolia,
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'BridgeToken DApp',
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [liskSepoliaChain],
  transports: {
    [liskSepoliaChain.id]: http('https://rpc.sepolia-api.lisk.com'),
  },
  ssr: true,
});
