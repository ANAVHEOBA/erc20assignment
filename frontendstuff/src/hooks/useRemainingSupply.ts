import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';
import { formatEther } from 'viem';

export const useRemainingSupply = () => {
  const [remainingSupply, setRemainingSupply] = useState<string>('0');

  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'remainingMintableSupply',
    query: {
      refetchInterval: 10000,
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setRemainingSupply(formatEther(data as bigint));
    }
  }, [data]);

  return { remainingSupply, loading: isLoading };
};
