"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";

import NextLink from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

import Image from "next/image";

export const Navbar = ({ boxClassName }: { boxClassName: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const isNotLoggedIn = ready && !authenticated;

  // Get account and balance
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <NextUINavbar
      maxWidth="full"
      position="sticky"
      className="py-2 font-clillax md:py-6"
      classNames={{
        wrapper: clsx("gap-2 md:gap-4 px-0", boxClassName),
      }}
    >
      <NavbarContent className="w-auto" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3 text-3xl">
          <NextLink
            className={clsx(
              "flex items-center hover:animate-pulse",
              pathname === "/en"
            )}
            href="/"
          >
            <Image 
             src={"/logo.svg"}
             width={36}
             height={36}
             alt=""
            >  
            </Image>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="md:pl-4" justify="end">
        <div className="flex items-center space-x-2 sm:space-x-6">
          {isNotLoggedIn && (
            <Button
              radius="full"
              variant="bordered"
              className="bg-transparent text-[#8181E5] border-[#8181E5] border"
              onPress={() => login()}
            >
              Login
            </Button>
          )}
          {!isNotLoggedIn && (
            <div className="flex items-center gap-4">
              <Button
                radius="none"
                className="bg-black text-white border-1 border-white"
                onPress={() => router.push("/profile")}
              >
                profile
              </Button>

              {/* Wallet Info */}
              <div className="hidden md:flex flex-col items-end text-sm">
                <span className="text-white font-medium">
                  {formatAddress(address || "")}
                </span>
                <span className="text-gray-400">
                  {balance
                    ? `${Number(formatEther(balance.value)).toFixed(4)} ETH`
                    : "0 ETH"}
                </span>
              </div>
            </div>
          )}
        </div>
      </NavbarContent>
    </NextUINavbar>
  );
};
