import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useTotalSupply = (contract: ethers.Contract | null) => {
  const [totalSupply, setTotalSupply] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const fetchTotalSupply = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const supply = await contract.totalSupply();
      setTotalSupply(ethers.utils.formatEther(supply));
    } catch (error) {
      console.error('Error fetching total supply:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalSupply();
  }, [contract]);

  return { totalSupply, loading, refetch: fetchTotalSupply };
};
