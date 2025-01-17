import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Manrope } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
