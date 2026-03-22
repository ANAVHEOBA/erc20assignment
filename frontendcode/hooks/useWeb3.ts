"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "@/lib/constants";
import { CONTRACT_ABI } from "@/lib/abi";

export interface Web3State {
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: Contract | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  error: string | null;
}

export function useWeb3() {
  const [state, setState] = useState<Web3State>({
    provider: null,
    signer: null,
    contract: null,
    account: null,
    chainId: null,
    isConnected: false,
    isCorrectNetwork: false,
    error: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize provider and contract
  const initializeWeb3 = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setState((prev) => ({
          ...prev,
          error: "MetaMask is not installed. Please install MetaMask to continue.",
        }));
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const isCorrectNetwork = chainId === NETWORK_CONFIG.chainId;

      // Get accounts
      const accounts = await provider.listAccounts();
      const account = accounts.length > 0 ? accounts[0].address : null;

      if (account) {
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        setState({
          provider,
          signer,
          contract,
          account,
          chainId,
          isConnected: true,
          isCorrectNetwork,
          error: null,
        });
      } else {
        setState({
          provider,
          signer: null,
          contract: null,
          account: null,
          chainId,
          isConnected: false,
          isCorrectNetwork,
          error: null,
        });
      }
    } catch (error) {
      console.error("Error initializing Web3:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to initialize Web3",
      }));
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await initializeWeb3();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      }));
    } finally {
      setIsConnecting(false);
    }
  }, [initializeWeb3, isConnecting]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      contract: null,
      account: null,
      chainId: null,
      isConnected: false,
      isCorrectNetwork: false,
      error: null,
    });
  }, []);

  // Switch to correct network
  const switchNetwork = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK_CONFIG.chainIdHex }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: NETWORK_CONFIG.chainIdHex,
                chainName: NETWORK_CONFIG.name,
                nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          throw addError;
        }
      } else {
        console.error("Error switching network:", error);
        throw error;
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        initializeWeb3();
      }
    };

    const handleChainChanged = () => {
      initializeWeb3();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [initializeWeb3, disconnect]);

  // Initialize on mount
  useEffect(() => {
    initializeWeb3();
  }, [initializeWeb3]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    isConnecting,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
