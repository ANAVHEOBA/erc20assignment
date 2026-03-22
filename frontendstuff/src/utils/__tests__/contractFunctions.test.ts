import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ethers } from 'ethers';
import {
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
} from '../contractFunctions';

describe('contractFunctions - Read Functions', () => {
  let mockContract: any;

  beforeEach(() => {
    mockContract = {
      balanceOf: vi.fn(),
      totalSupply: vi.fn(),
      getTimeUntilNextRequest: vi.fn(),
      remainingMintableSupply: vi.fn(),
      owner: vi.fn(),
      name: vi.fn(),
      symbol: vi.fn(),
      decimals: vi.fn(),
      allowance: vi.fn(),
      lastRequestTime: vi.fn(),
      totalMinted: vi.fn(),
      MAX_SUPPLY: vi.fn(),
      FAUCET_AMOUNT: vi.fn(),
      COOLDOWN_TIME: vi.fn(),
    };
  });

  describe('getBalance', () => {
    it('should return formatted balance', async () => {
      const mockBalance = ethers.utils.parseEther('100');
      mockContract.balanceOf.mockResolvedValue(mockBalance);

      const balance = await getBalance(mockContract, '0x123');
      
      expect(balance).toBe('100.0');
      expect(mockContract.balanceOf).toHaveBeenCalledWith('0x123');
    });
  });

  describe('getTotalSupply', () => {
    it('should return formatted total supply', async () => {
      const mockSupply = ethers.utils.parseEther('1000000');
      mockContract.totalSupply.mockResolvedValue(mockSupply);

      const supply = await getTotalSupply(mockContract);
      
      expect(supply).toBe('1000000.0');
      expect(mockContract.totalSupply).toHaveBeenCalled();
    });
  });

  describe('getTimeUntilNextRequest', () => {
    it('should return time remaining in seconds', async () => {
      mockContract.getTimeUntilNextRequest.mockResolvedValue(
        ethers.BigNumber.from(3600)
      );

      const time = await getTimeUntilNextRequest(mockContract, '0x123');
      
      expect(time).toBe(3600);
      expect(mockContract.getTimeUntilNextRequest).toHaveBeenCalledWith('0x123');
    });

    it('should return 0 when cooldown is complete', async () => {
      mockContract.getTimeUntilNextRequest.mockResolvedValue(
        ethers.BigNumber.from(0)
      );

      const time = await getTimeUntilNextRequest(mockContract, '0x123');
      
      expect(time).toBe(0);
    });
  });

  describe('getRemainingMintableSupply', () => {
    it('should return formatted remaining supply', async () => {
      const mockRemaining = ethers.utils.parseEther('9000000');
      mockContract.remainingMintableSupply.mockResolvedValue(mockRemaining);

      const remaining = await getRemainingMintableSupply(mockContract);
      
      expect(remaining).toBe('9000000.0');
      expect(mockContract.remainingMintableSupply).toHaveBeenCalled();
    });
  });

  describe('getOwner', () => {
    it('should return owner address', async () => {
      const ownerAddress = '0x6D21167d874C842386e8c484519B5ddBBaB87b43';
      mockContract.owner.mockResolvedValue(ownerAddress);

      const owner = await getOwner(mockContract);
      
      expect(owner).toBe(ownerAddress);
      expect(mockContract.owner).toHaveBeenCalled();
    });
  });

  describe('getName', () => {
    it('should return token name', async () => {
      mockContract.name.mockResolvedValue('BridgeToken');

      const name = await getName(mockContract);
      
      expect(name).toBe('BridgeToken');
      expect(mockContract.name).toHaveBeenCalled();
    });
  });

  describe('getSymbol', () => {
    it('should return token symbol', async () => {
      mockContract.symbol.mockResolvedValue('BRG');

      const symbol = await getSymbol(mockContract);
      
      expect(symbol).toBe('BRG');
      expect(mockContract.symbol).toHaveBeenCalled();
    });
  });

  describe('getDecimals', () => {
    it('should return token decimals', async () => {
      mockContract.decimals.mockResolvedValue(18);

      const decimals = await getDecimals(mockContract);
      
      expect(decimals).toBe(18);
      expect(mockContract.decimals).toHaveBeenCalled();
    });
  });

  describe('getAllowance', () => {
    it('should return formatted allowance', async () => {
      const mockAllowance = ethers.utils.parseEther('50');
      mockContract.allowance.mockResolvedValue(mockAllowance);

      const allowance = await getAllowance(mockContract, '0x123', '0x456');
      
      expect(allowance).toBe('50.0');
      expect(mockContract.allowance).toHaveBeenCalledWith('0x123', '0x456');
    });
  });

  describe('getLastRequestTime', () => {
    it('should return last request timestamp', async () => {
      const timestamp = 1711084800;
      mockContract.lastRequestTime.mockResolvedValue(
        ethers.BigNumber.from(timestamp)
      );

      const time = await getLastRequestTime(mockContract, '0x123');
      
      expect(time).toBe(timestamp);
      expect(mockContract.lastRequestTime).toHaveBeenCalledWith('0x123');
    });
  });

  describe('getTotalMinted', () => {
    it('should return formatted total minted', async () => {
      const mockMinted = ethers.utils.parseEther('1000000');
      mockContract.totalMinted.mockResolvedValue(mockMinted);

      const minted = await getTotalMinted(mockContract);
      
      expect(minted).toBe('1000000.0');
      expect(mockContract.totalMinted).toHaveBeenCalled();
    });
  });

  describe('getMaxSupply', () => {
    it('should return formatted max supply', async () => {
      const mockMax = ethers.utils.parseEther('10000000');
      mockContract.MAX_SUPPLY.mockResolvedValue(mockMax);

      const maxSupply = await getMaxSupply(mockContract);
      
      expect(maxSupply).toBe('10000000.0');
      expect(mockContract.MAX_SUPPLY).toHaveBeenCalled();
    });
  });

  describe('getFaucetAmount', () => {
    it('should return formatted faucet amount', async () => {
      const mockAmount = ethers.utils.parseEther('100');
      mockContract.FAUCET_AMOUNT.mockResolvedValue(mockAmount);

      const amount = await getFaucetAmount(mockContract);
      
      expect(amount).toBe('100.0');
      expect(mockContract.FAUCET_AMOUNT).toHaveBeenCalled();
    });
  });

  describe('getCooldownTime', () => {
    it('should return cooldown time in seconds', async () => {
      mockContract.COOLDOWN_TIME.mockResolvedValue(
        ethers.BigNumber.from(86400)
      );

      const cooldown = await getCooldownTime(mockContract);
      
      expect(cooldown).toBe(86400);
      expect(mockContract.COOLDOWN_TIME).toHaveBeenCalled();
    });
  });
});
