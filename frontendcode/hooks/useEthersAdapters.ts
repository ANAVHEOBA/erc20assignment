"use client";

import { useMemo } from 'react';
import { type PublicClient, type WalletClient, usePublicClient, useWalletClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback') {
    return new BrowserProvider(transport.transports[0].value, network);
  }
  return new BrowserProvider(transport, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

export function useEthersProvider() {
  const publicClient = usePublicClient();
  return useMemo(() => (publicClient ? publicClientToProvider(publicClient) : null), [publicClient]);
}

export function useEthersSigner() {
  const { data: walletClient } = useWalletClient();
  return useMemo(() => (walletClient ? walletClientToSigner(walletClient) : null), [walletClient]);
}
