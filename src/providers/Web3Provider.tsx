"use client";
import { useWeb3 } from "@/hooks/useWeb3";

export function Web3Provider({ children }: { children: React.ReactNode }) {
  useWeb3(); // This will safely handle the ethereum object
  return <>{children}</>;
}
