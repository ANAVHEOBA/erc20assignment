import { type ClassValue, clsx } from "clsx";

/**
 * Utility function for merging Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format address to short version (0x1234...5678)
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: string | number, decimals = 2): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format token amount (remove trailing zeros)
 */
export function formatTokenAmount(amount: string, decimals = 4): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "0";
  
  // If number is very small, show more decimals
  if (num > 0 && num < 0.0001) {
    return num.toFixed(8).replace(/\.?0+$/, "");
  }
  
  return num.toFixed(decimals).replace(/\.?0+$/, "");
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0s";
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(" ");
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate amount (positive number)
 */
export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

/**
 * Get explorer URL for address
 */
export function getExplorerAddressUrl(address: string, explorerUrl: string): string {
  return `${explorerUrl}/address/${address}`;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerTxUrl(txHash: string, explorerUrl: string): string {
  return `${explorerUrl}/tx/${txHash}`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  if (timestamp === 0) return "Never";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

/**
 * Get time ago string
 */
export function getTimeAgo(timestamp: number): string {
  if (timestamp === 0) return "Never";
  
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}
