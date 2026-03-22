// Export all hooks from a single file for easy imports

// Core Web3 hooks
export { useWeb3 } from "./useWeb3";
export { useWeb3Wagmi } from "./useWeb3Wagmi";
export { useEthersProvider, useEthersSigner } from "./useEthersAdapters";

// Read hooks (5+ required)
export { useTokenInfo } from "./useTokenInfo";
export { useTokenBalance } from "./useTokenBalance";
export { useFaucetCooldown } from "./useFaucetCooldown";
export { useSupplyInfo } from "./useSupplyInfo";
export { useOwnerInfo } from "./useOwnerInfo";
export { useAllowance } from "./useAllowance";

// Write hooks (3 required)
export { useRequestToken } from "./useRequestToken";
export { useMintToken } from "./useMintToken";
export { useTransferToken } from "./useTransferToken";

// Bonus write hooks
export { useApprove } from "./useApprove";
export { useBurnToken } from "./useBurnToken";
