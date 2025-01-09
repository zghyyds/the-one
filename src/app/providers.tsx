"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { WagmiProvider } from "@privy-io/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Attribute } from "next-themes";
import { privyConfig } from "@/configs/privyConfig";
import { wagmiConfig } from "@/configs/wagmiConfig";
import { Toaster } from "sonner";

export function Providers(props: {
  attribute: Attribute;
  defaultTheme: string;
  children: React.ReactNode;
}) {
  const { attribute, defaultTheme, children } = props;
  const router = useRouter();
  const queryClient = new QueryClient();
  return (
    <NextUIProvider navigate={router.push}>
      <Toaster richColors />
      <NextThemesProvider
        attribute={attribute}
        defaultTheme={defaultTheme}
        forcedTheme={defaultTheme}
      >
        <PrivyProvider
          appId="cluhks0e204ix3625cdrd2jm1"
          config={{ ...privyConfig }}
        >
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
