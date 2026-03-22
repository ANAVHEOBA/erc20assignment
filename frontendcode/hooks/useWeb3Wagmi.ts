"use client";

import { useAccount, useChainId } from 'wagmi';
import { Contract, BrowserProvider } from 'ethers';
import { useMemo } from 'react';
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from '@/lib/constants';
import { CONTRACT_ABI } from '@/lib/abi';
import { useEthersProvider, useEthersSigner } from './useEthersAdapters';

export function useWeb3Wagmi() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const isCorrectNetwork = chainId === NETWORK_CONFIG.chainId;

  const contract = useMemo(() => {
    if (!signer || !isConnected) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signer, isConnected]);

  return {
    account: address || null,
    isConnected,
    isCorrectNetwork,
    chainId,
    provider,
    signer,
    contract,
  };
}
