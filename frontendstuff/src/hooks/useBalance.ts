import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useBalance = (contract: ethers.Contract | null, account: string) => {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!contract || !account) return;
    
    setLoading(true);
    try {
      const bal = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [contract, account]);

  return { balance, loading, refetch: fetchBalance };
};
