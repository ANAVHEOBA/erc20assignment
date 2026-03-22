import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config/contract';
import contractABI from '../CONTRACT_ABI.json';

export function getContractInstance(
  signer: ethers.Signer
): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}

export function getContractWithProvider(
  provider: ethers.providers.Provider
): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
}
