import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useCooldown = (contract: ethers.Contract | null, account: string) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canRequest, setCanRequest] = useState<boolean>(false);

  const fetchCooldown = async () => {
    if (!contract || !account) return;
    
    try {
      const remaining = await contract.getTimeUntilNextRequest(account);
      const remainingSeconds = remaining.toNumber();
      setTimeRemaining(remainingSeconds);
      setCanRequest(remainingSeconds === 0);
    } catch (error) {
      console.error('Error fetching cooldown:', error);
    }
  };

  useEffect(() => {
    fetchCooldown();
    const interval = setInterval(fetchCooldown, 1000);
    return () => clearInterval(interval);
  }, [contract, account]);

  const formatTime = () => {
    if (timeRemaining === 0) return 'Ready to claim!';
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    return `Retry in ${hours}h ${minutes}m ${seconds}s`;
  };

  return { timeRemaining, canRequest, formatTime, refetch: fetchCooldown };
};
