import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';

export const useOwner = () => {
  const [owner, setOwner] = useState<string>('');

  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'owner',
  });

  useEffect(() => {
    if (data) {
      setOwner(data as string);
    }
  }, [data]);

  return { owner, loading: isLoading };
};
