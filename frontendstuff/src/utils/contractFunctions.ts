import { ethers } from 'ethers';

// Read Functions
export async function getBalance(
  contract: ethers.Contract,
  address: string
): Promise<string> {
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatEther(balance);
}

export async function getTotalSupply(
  contract: ethers.Contract
): Promise<string> {
  const supply = await contract.totalSupply();
  return ethers.utils.formatEther(supply);
}

export async function getTimeUntilNextRequest(
  contract: ethers.Contract,
  address: string
): Promise<number> {
  const remaining = await contract.getTimeUntilNextRequest(address);
  return remaining.toNumber();
}

export async function getRemainingMintableSupply(
  contract: ethers.Contract
): Promise<string> {
  const remaining = await contract.remainingMintableSupply();
  return ethers.utils.formatEther(remaining);
}

export async function getOwner(
  contract: ethers.Contract
): Promise<string> {
  return await contract.owner();
}

export async function getName(
  contract: ethers.Contract
): Promise<string> {
  return await contract.name();
}

export async function getSymbol(
  contract: ethers.Contract
): Promise<string> {
  return await contract.symbol();
}

export async function getDecimals(
  contract: ethers.Contract
): Promise<number> {
  return await contract.decimals();
}

export async function getAllowance(
  contract: ethers.Contract,
  owner: string,
  spender: string
): Promise<string> {
  const allowance = await contract.allowance(owner, spender);
  return ethers.utils.formatEther(allowance);
}

export async function getLastRequestTime(
  contract: ethers.Contract,
  address: string
): Promise<number> {
  const timestamp = await contract.lastRequestTime(address);
  return timestamp.toNumber();
}

export async function getTotalMinted(
  contract: ethers.Contract
): Promise<string> {
  const minted = await contract.totalMinted();
  return ethers.utils.formatEther(minted);
}

export async function getMaxSupply(
  contract: ethers.Contract
): Promise<string> {
  const maxSupply = await contract.MAX_SUPPLY();
  return ethers.utils.formatEther(maxSupply);
}

export async function getFaucetAmount(
  contract: ethers.Contract
): Promise<string> {
  const amount = await contract.FAUCET_AMOUNT();
  return ethers.utils.formatEther(amount);
}

export async function getCooldownTime(
  contract: ethers.Contract
): Promise<number> {
  const cooldown = await contract.COOLDOWN_TIME();
  return cooldown.toNumber();
}
