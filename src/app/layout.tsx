import { manrope } from "@/configs/fonts";
import clsx from "clsx";
import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from "@/providers/Web3Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={clsx(manrope.variable)}>
      <head />
      <body className="min-h-screen font-manrope text-white antialiased">
        <Web3Provider>
          <Providers attribute="class" defaultTheme="dark">
            <Toaster/>
            <div className="relative min-h-screen flex flex-col">
              {/* Scrollable content */}
              <div className="relative z-10 flex flex-col flex-1">
                <Navbar boxClassName="w-full px-2 md:px-5 mx-auto" />
                <main className="flex-1 w-full mx-auto px-2 md:px-5 pb-8">
                  {children}
                </main>
                {/* <Footer /> */}
              </div>
            </div>
          </Providers>
        </Web3Provider>
      </body>
    </html>
  );
}
