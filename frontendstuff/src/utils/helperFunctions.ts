export function formatCooldownTime(seconds: number): string {
  if (seconds === 0) return 'Ready to claim!';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `Retry in ${hours}h ${minutes}m ${secs}s`;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTokenAmount(amount: string, decimals: number = 2): string {
  const num = parseFloat(amount);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

export function calculatePercentage(current: string, max: string): number {
  const currentNum = parseFloat(current);
  const maxNum = parseFloat(max);
  
  if (maxNum === 0) return 0;
  return (currentNum / maxNum) * 100;
}
