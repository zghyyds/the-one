import type { PrivyClientConfig } from "@privy-io/react-auth";
import { base, sepolia } from "viem/chains";

// TODO: Overriding a chain's RPC provider when need to scale
// https://docs.privy.io/guide/react/configuration/networks/evm#rpc-override

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  // Customize Privy's appearance in your app
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    showWalletLoginFirst: true,
    //   logo: "https://your-logo-url",
  },
  loginMethods: ["wallet"],
  defaultChain: base,
  supportedChains: [base, sepolia],
  // Create embedded wallets for users who don't have a wallet
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
};
