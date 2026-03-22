import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';

export function useFaucetCooldown() {
  const { address, isConnected } = useAccount();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canRequest, setCanRequest] = useState<boolean>(false);

  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractABI,
    functionName: 'getTimeUntilNextRequest',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 1000, // Update every second for countdown
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      const seconds = Number(data);
      setTimeRemaining(seconds);
      setCanRequest(seconds === 0);
    }
  }, [data]);

  const formatTime = () => {
    if (timeRemaining === 0) return 'Ready to claim!';
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    return `Retry in ${hours}h ${minutes}m ${seconds}s`;
  };

  return {
    timeRemaining,
    canRequest,
    formatTime,
    refetch,
  };
}
