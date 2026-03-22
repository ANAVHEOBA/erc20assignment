import { describe, it, expect } from 'vitest';
import {
  formatCooldownTime,
  formatAddress,
  formatTokenAmount,
  isValidAddress,
  isValidAmount,
  calculatePercentage,
} from '../helperFunctions';

describe('helperFunctions', () => {
  describe('formatCooldownTime', () => {
    it('should return "Ready to claim!" when seconds is 0', () => {
      expect(formatCooldownTime(0)).toBe('Ready to claim!');
    });

    it('should format time correctly for hours, minutes, and seconds', () => {
      expect(formatCooldownTime(3661)).toBe('Retry in 1h 1m 1s');
    });

    it('should format time correctly for only seconds', () => {
      expect(formatCooldownTime(45)).toBe('Retry in 0h 0m 45s');
    });

    it('should format time correctly for 24 hours', () => {
      expect(formatCooldownTime(86400)).toBe('Retry in 24h 0m 0s');
    });
  });

  describe('formatAddress', () => {
    it('should format a valid Ethereum address', () => {
      const address = '0x49728D5c119C0497c2478CD54c63097ed47Ce9E1';
      expect(formatAddress(address)).toBe('0x4972...e9E1');
    });

    it('should return empty string for empty address', () => {
      expect(formatAddress('')).toBe('');
    });
  });

  describe('formatTokenAmount', () => {
    it('should format token amount with default 2 decimals', () => {
      expect(formatTokenAmount('1234.5678')).toBe('1,234.57');
    });

    it('should format token amount with custom decimals', () => {
      expect(formatTokenAmount('1234.5678', 4)).toBe('1,234.5678');
    });

    it('should format large numbers with commas', () => {
      expect(formatTokenAmount('1000000')).toBe('1,000,000.00');
    });
  });

  describe('isValidAddress', () => {
    it('should return true for valid Ethereum address', () => {
      expect(isValidAddress('0x49728D5c119C0497c2478CD54c63097ed47Ce9E1')).toBe(true);
    });

    it('should return false for invalid address (too short)', () => {
      expect(isValidAddress('0x1234')).toBe(false);
    });

    it('should return false for address without 0x prefix', () => {
      expect(isValidAddress('49728D5c119C0497c2478CD54c63097ed47Ce9E1')).toBe(false);
    });

    it('should return false for invalid characters', () => {
      expect(isValidAddress('0x49728D5c119C0497c2478CD54c63097ed47Ce9G1')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should return true for valid positive number', () => {
      expect(isValidAmount('100')).toBe(true);
    });

    it('should return true for valid decimal', () => {
      expect(isValidAmount('0.5')).toBe(true);
    });

    it('should return false for zero', () => {
      expect(isValidAmount('0')).toBe(false);
    });

    it('should return false for negative number', () => {
      expect(isValidAmount('-10')).toBe(false);
    });

    it('should return false for non-numeric string', () => {
      expect(isValidAmount('abc')).toBe(false);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage('50', '100')).toBe(50);
    });

    it('should return 0 when max is 0', () => {
      expect(calculatePercentage('50', '0')).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(calculatePercentage('33.33', '100')).toBeCloseTo(33.33, 2);
    });

    it('should handle values over 100%', () => {
      expect(calculatePercentage('150', '100')).toBe(150);
    });
  });
});
