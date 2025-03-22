"use client"
import "./styles/globals.css";
import "./styles/style.css";
import Navbar from "@/app/components/Navbar";
import {Toaster} from "@/app/components/ui/sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {WagmiProvider} from "wagmi";
import {config} from "./configuration/wagmi"
import {BlockchainProvider} from "@/app/context/BlockchainContext";
import '@rainbow-me/rainbowkit/styles.css';
import {RainbowKitProvider} from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient()


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <div>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <BlockchainProvider>
                  <Navbar></Navbar>
                  <div className={"flex h-[100vh] justify-center align-center"}>
                    {children}
                  </div>
                  <Toaster />
                </BlockchainProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
      </div>

    </body>
    </html>
  );
}
