"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract } from "ethers";

interface CooldownInfo {
  timeRemaining: number;
  canRequest: boolean;
  lastRequestTime: number;
  nextRequestTime: number;
  formattedTime: string;
}

/**
 * Hook for faucet cooldown timer
 * READ FUNCTION #3: getTimeUntilNextRequest, lastRequestTime
 * This is CRITICAL for the countdown timer requirement
 */
export function useFaucetCooldown(contract: Contract | null, address: string | null) {
  const [cooldownInfo, setCooldownInfo] = useState<CooldownInfo>({
    timeRemaining: 0,
    canRequest: true,
    lastRequestTime: 0,
    nextRequestTime: 0,
    formattedTime: "Ready to claim!",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "Ready to claim!";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `Retry in ${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `Retry in ${minutes}m ${secs}s`;
    } else {
      return `Retry in ${secs}s`;
    }
  }, []);

  const fetchCooldown = useCallback(async () => {
    if (!contract || !address) {
      setCooldownInfo({
        timeRemaining: 0,
        canRequest: true,
        lastRequestTime: 0,
        nextRequestTime: 0,
        formattedTime: "Ready to claim!",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [timeRemaining, lastRequestTime] = await Promise.all([
        contract.getTimeUntilNextRequest(address),
        contract.lastRequestTime(address),
      ]);

      const timeRemainingNum = Number(timeRemaining);
      const lastRequestTimeNum = Number(lastRequestTime);
      const nextRequestTime = lastRequestTimeNum > 0 ? lastRequestTimeNum + 86400 : 0;

      setCooldownInfo({
        timeRemaining: timeRemainingNum,
        canRequest: timeRemainingNum === 0,
        lastRequestTime: lastRequestTimeNum,
        nextRequestTime,
        formattedTime: formatTime(timeRemainingNum),
      });
    } catch (err) {
      console.error("Error fetching cooldown:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cooldown");
    } finally {
      setLoading(false);
    }
  }, [contract, address, formatTime]);

  // Update every second for countdown
  useEffect(() => {
    fetchCooldown();

    const interval = setInterval(() => {
      if (cooldownInfo.timeRemaining > 0) {
        setCooldownInfo((prev) => {
          const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            canRequest: newTimeRemaining === 0,
            formattedTime: formatTime(newTimeRemaining),
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [contract, address]); // Don't include cooldownInfo in deps to avoid re-fetching

  // Refetch when cooldown reaches 0
  useEffect(() => {
    if (cooldownInfo.timeRemaining === 0 && !cooldownInfo.canRequest) {
      fetchCooldown();
    }
  }, [cooldownInfo.timeRemaining, cooldownInfo.canRequest, fetchCooldown]);

  return {
    cooldownInfo,
    loading,
    error,
    refetch: fetchCooldown,
  };
}
