import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';

export function useRequestToken() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const requestToken = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'requestToken',
      });
    } catch (err) {
      console.error('Error requesting tokens:', err);
    }
  };

  return {
    requestToken,
    isPending,
    isConfirming,
    isSuccess,
    error: error?.message || '',
    hash,
  };
}
