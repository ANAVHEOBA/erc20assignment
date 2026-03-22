import { useAccount, useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';

export function useTokenInfo() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'name',
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'symbol',
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'totalSupply',
      },
      {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: contractABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const name = data?.[0]?.result as string || '';
  const symbol = data?.[1]?.result as string || '';
  const totalSupply = data?.[2]?.result ? formatEther(data[2].result as bigint) : '0';
  const balance = data?.[3]?.result ? formatEther(data[3].result as bigint) : '0';

  return {
    balance,
    name,
    symbol,
    totalSupply,
    loading: isLoading,
    error: error?.message || '',
    refetch,
  };
}
