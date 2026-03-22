import { describe, it, expect, vi, beforeEach } from 'vitest';
import { connectWallet, switchNetwork, addNetwork, addTokenToWallet } from '../walletFunctions';

describe('walletFunctions', () => {
  let mockEthereum: any;

  beforeEach(() => {
    mockEthereum = {
      request: vi.fn(),
    };
    (global as any).window = {
      ethereum: mockEthereum,
    };
  });

  describe('connectWallet', () => {
    it('should connect wallet and return provider, signer, and account', async () => {
      mockEthereum.request.mockResolvedValue(['0x123456789']);

      const result = await connectWallet();

      expect(result.account).toBe('0x123456789');
      expect(result.provider).toBeDefined();
      expect(result.signer).toBeDefined();
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
        params: [],
      });
    });

    it('should throw error when MetaMask is not installed', async () => {
      (global as any).window = {};

      await expect(connectWallet()).rejects.toThrow('MetaMask not installed');
    });
  });

  describe('switchNetwork', () => {
    it('should switch to specified network', async () => {
      mockEthereum.request.mockResolvedValue(null);

      await switchNetwork(4202);

      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x106a' }],
      });
    });

    it('should throw error when network not added', async () => {
      mockEthereum.request.mockRejectedValue({ code: 4902 });

      await expect(switchNetwork(4202)).rejects.toThrow('Network not added to MetaMask');
    });

    it('should throw error when MetaMask is not installed', async () => {
      (global as any).window = {};

      await expect(switchNetwork(4202)).rejects.toThrow('MetaMask not installed');
    });
  });

  describe('addNetwork', () => {
    it('should add network to MetaMask', async () => {
      mockEthereum.request.mockResolvedValue(null);

      await addNetwork(
        4202,
        'Lisk Sepolia Testnet',
        'https://rpc.sepolia-api.lisk.com',
        'https://sepolia-blockscout.lisk.com'
      );

      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x106a',
            chainName: 'Lisk Sepolia Testnet',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
            blockExplorerUrls: ['https://sepolia-blockscout.lisk.com'],
          },
        ],
      });
    });

    it('should throw error when MetaMask is not installed', async () => {
      (global as any).window = {};

      await expect(
        addNetwork(4202, 'Test', 'http://rpc', 'http://explorer')
      ).rejects.toThrow('MetaMask not installed');
    });
  });

  describe('addTokenToWallet', () => {
    it('should add token to MetaMask', async () => {
      mockEthereum.request.mockResolvedValue(null);

      await addTokenToWallet('0x123', 'BRG', 18);

      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x123',
            symbol: 'BRG',
            decimals: 18,
          },
        },
      });
    });

    it('should throw error when MetaMask is not installed', async () => {
      (global as any).window = {};

      await expect(addTokenToWallet('0x123', 'BRG', 18)).rejects.toThrow(
        'MetaMask not installed'
      );
    });
  });
});
