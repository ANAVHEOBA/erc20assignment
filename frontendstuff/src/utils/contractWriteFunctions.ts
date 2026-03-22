import { ethers } from 'ethers';

// Write Functions
export async function requestToken(
  contract: ethers.Contract
): Promise<ethers.ContractTransaction> {
  const tx = await contract.requestToken();
  return tx;
}

export async function mint(
  contract: ethers.Contract,
  to: string,
  amount: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(amount);
  const tx = await contract.mint(to, amountInWei);
  return tx;
}

export async function transfer(
  contract: ethers.Contract,
  recipient: string,
  amount: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(amount);
  const tx = await contract.transfer(recipient, amountInWei);
  return tx;
}

export async function approve(
  contract: ethers.Contract,
  spender: string,
  amount: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(amount);
  const tx = await contract.approve(spender, amountInWei);
  return tx;
}

export async function transferFrom(
  contract: ethers.Contract,
  sender: string,
  recipient: string,
  amount: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(amount);
  const tx = await contract.transferFrom(sender, recipient, amountInWei);
  return tx;
}

export async function burn(
  contract: ethers.Contract,
  amount: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(amount);
  const tx = await contract.burn(amountInWei);
  return tx;
}

export async function increaseAllowance(
  contract: ethers.Contract,
  spender: string,
  addedValue: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(addedValue);
  const tx = await contract.increaseAllowance(spender, amountInWei);
  return tx;
}

export async function decreaseAllowance(
  contract: ethers.Contract,
  spender: string,
  subtractedValue: string
): Promise<ethers.ContractTransaction> {
  const amountInWei = ethers.utils.parseEther(subtractedValue);
  const tx = await contract.decreaseAllowance(spender, amountInWei);
  return tx;
}
