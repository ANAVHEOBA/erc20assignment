import { ethers } from 'ethers';

export async function connectWallet(): Promise<{
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  account: string;
}> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();

  return {
    provider,
    signer,
    account: accounts[0],
  };
}

export async function switchNetwork(chainId: number): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // Chain not added, add it
    if (error.code === 4902) {
      throw new Error('Network not added to MetaMask');
    }
    throw error;
  }
}

export async function addNetwork(
  chainId: number,
  chainName: string,
  rpcUrl: string,
  blockExplorerUrl: string
): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${chainId.toString(16)}`,
        chainName,
        nativeCurrency: {
          name: 'Sepolia Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: [rpcUrl],
        blockExplorerUrls: [blockExplorerUrl],
      },
    ],
  });
}

export async function addTokenToWallet(
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number
): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
      },
    },
  });
}
