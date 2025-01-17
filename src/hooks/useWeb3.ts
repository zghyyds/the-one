"use client";
import { useEffect, useState } from "react";

export function useWeb3() {
  const [isWeb3Available, setIsWeb3Available] = useState(false);

  useEffect(() => {
    const checkWeb3 = () => {
      if (typeof window !== "undefined") {
        try {
          setIsWeb3Available(!!window.ethereum);
        } catch (error) {
          console.warn("Web3 not available:", error);
          setIsWeb3Available(false);
        }
      }
    };

    checkWeb3();
    window.addEventListener("ethereum#initialized", checkWeb3);
    return () => {
      window.removeEventListener("ethereum#initialized", checkWeb3);
    };
  }, []);

  return { isWeb3Available };
}
