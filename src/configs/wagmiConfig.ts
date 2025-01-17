import {
  mainnet,
  sepolia,
  bscTestnet,
  bsc,
  base,
  baseSepolia,
} from "viem/chains";
import { http } from "wagmi";

import { createConfig } from "@privy-io/wagmi";

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc, mainnet, base, sepolia, baseSepolia],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
