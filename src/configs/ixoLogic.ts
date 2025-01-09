import { base } from "viem/chains";
import { http, createPublicClient } from "viem";

export type Network = {
  id: string;
  name: string;
  ticker: string;
  env: string;
  version: string;
  icon: string;
  supportedPairTokens: string[];
  supportedDEXes: string[];
  rpcUrl: string;
  contracts: {
    usdt?: string;
    usdc?: string;
    fdusd?: string;
    wbnb?: string;
    weth?: string;
    ixoFactory: string;
    ixoPeriphery: string;
  };
  whitelistedPools: string[];
  blackListedPools: string[];
};

const DEFAULT_TOKEN_ICON = "/ixo.png";

const SUPPORTED_TRADE_POOL_TYPES = [
  {
    name: "Uniswap V2",
    value: "0",
  },
  {
    name: "Uniswap V3",
    value: "1",
  },
];

const getPublicClient = (network: Network) => {
  return createPublicClient({
    chain: base,
    cacheTime: 10_000,
    transport: http(network.rpcUrl, {
      batch: {
        wait: 20, // The maximum number of milliseconds to wait before sending a batch.
        batchSize: 2_000,
      },
      retryCount: 5,
      retryDelay: 300,
      timeout: 60_000,
    }),
  });
};

export {
  DEFAULT_TOKEN_ICON,
  SUPPORTED_TRADE_POOL_TYPES,
  //   getSupportedNetworks,
  getPublicClient,
  //   getChainIcon,
};
