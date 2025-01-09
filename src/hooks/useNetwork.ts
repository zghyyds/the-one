import { useWallets } from "@privy-io/react-auth";
import { useState, useCallback, useEffect } from "react";
import { sepolia } from "viem/chains";
import { toast } from "sonner";

// Target network configuration
const TARGET_CHAIN = sepolia;

export function useNetwork() {
  const { wallets } = useWallets();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if current network is target network
  const checkNetwork = useCallback(() => {
    if (!wallets.length) {
      setIsCorrectNetwork(false);
      return false;
    }

    const currentWallet = wallets[0];
    const currentChainId = parseInt(currentWallet.chainId.split(":")[1]);
    const isCorrect = currentChainId === TARGET_CHAIN.id;

    setIsCorrectNetwork(isCorrect);
    return isCorrect;
  }, [wallets]);

  // Auto-check network when wallet changes
  useEffect(() => {
    checkNetwork();
  }, [wallets, checkNetwork]);

  const switchNetwork = useCallback(async () => {
    if (!wallets.length) return false;

    try {
      const wallet = wallets[0];
      await wallet.switchChain(TARGET_CHAIN.id);
      setIsCorrectNetwork(true);
      toast.success("Successfully switched to the correct network");
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      setIsCorrectNetwork(false);
      toast.error("Failed to switch network", {
        description:
          "Please try again or switch network manually in your wallet",
      });
      return false;
    }
  }, [wallets]);

  return {
    isCorrectNetwork,
    checkNetwork,
    switchNetwork,
  };
}
