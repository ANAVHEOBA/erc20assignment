import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';
import { parseEther } from 'viem';

export const useMint = () => {
  const [error, setError] = useState<string>('');

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (recipient: string, amount: string) => {
    setError('');
    
    try {
      const amountInWei = parseEther(amount);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'mint',
        args: [recipient as `0x${string}`, amountInWei],
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to mint tokens';
      setError(errorMsg);
      console.error('Error minting tokens:', err);
      return false;
    }
  };

  return { 
    mint, 
    loading: isPending || isConfirming, 
    error,
    isSuccess,
    hash,
  };
};
