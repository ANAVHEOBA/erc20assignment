import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ethers } from 'ethers';
import {
  requestToken,
  mint,
  transfer,
  approve,
  transferFrom,
  burn,
  increaseAllowance,
  decreaseAllowance,
} from '../contractWriteFunctions';

describe('contractWriteFunctions - Write Functions', () => {
  let mockContract: any;
  let mockTx: any;

  beforeEach(() => {
    mockTx = {
      hash: '0xabc123',
      wait: vi.fn().mockResolvedValue({ status: 1 }),
    };

    mockContract = {
      requestToken: vi.fn(),
      mint: vi.fn(),
      transfer: vi.fn(),
      approve: vi.fn(),
      transferFrom: vi.fn(),
      burn: vi.fn(),
      increaseAllowance: vi.fn(),
      decreaseAllowance: vi.fn(),
    };
  });

  describe('requestToken', () => {
    it('should call requestToken and return transaction', async () => {
      mockContract.requestToken.mockResolvedValue(mockTx);

      const tx = await requestToken(mockContract);
      
      expect(tx).toBe(mockTx);
      expect(mockContract.requestToken).toHaveBeenCalled();
    });
  });

  describe('mint', () => {
    it('should call mint with correct parameters', async () => {
      mockContract.mint.mockResolvedValue(mockTx);

      const tx = await mint(mockContract, '0x123', '100');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.mint).toHaveBeenCalledWith(
        '0x123',
        ethers.utils.parseEther('100')
      );
    });
  });

  describe('transfer', () => {
    it('should call transfer with correct parameters', async () => {
      mockContract.transfer.mockResolvedValue(mockTx);

      const tx = await transfer(mockContract, '0x456', '50');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.transfer).toHaveBeenCalledWith(
        '0x456',
        ethers.utils.parseEther('50')
      );
    });
  });

  describe('approve', () => {
    it('should call approve with correct parameters', async () => {
      mockContract.approve.mockResolvedValue(mockTx);

      const tx = await approve(mockContract, '0x789', '200');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.approve).toHaveBeenCalledWith(
        '0x789',
        ethers.utils.parseEther('200')
      );
    });
  });

  describe('transferFrom', () => {
    it('should call transferFrom with correct parameters', async () => {
      mockContract.transferFrom.mockResolvedValue(mockTx);

      const tx = await transferFrom(mockContract, '0x111', '0x222', '75');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.transferFrom).toHaveBeenCalledWith(
        '0x111',
        '0x222',
        ethers.utils.parseEther('75')
      );
    });
  });

  describe('burn', () => {
    it('should call burn with correct parameters', async () => {
      mockContract.burn.mockResolvedValue(mockTx);

      const tx = await burn(mockContract, '10');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.burn).toHaveBeenCalledWith(
        ethers.utils.parseEther('10')
      );
    });
  });

  describe('increaseAllowance', () => {
    it('should call increaseAllowance with correct parameters', async () => {
      mockContract.increaseAllowance.mockResolvedValue(mockTx);

      const tx = await increaseAllowance(mockContract, '0x333', '25');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.increaseAllowance).toHaveBeenCalledWith(
        '0x333',
        ethers.utils.parseEther('25')
      );
    });
  });

  describe('decreaseAllowance', () => {
    it('should call decreaseAllowance with correct parameters', async () => {
      mockContract.decreaseAllowance.mockResolvedValue(mockTx);

      const tx = await decreaseAllowance(mockContract, '0x444', '15');
      
      expect(tx).toBe(mockTx);
      expect(mockContract.decreaseAllowance).toHaveBeenCalledWith(
        '0x444',
        ethers.utils.parseEther('15')
      );
    });
  });
});
