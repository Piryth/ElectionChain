"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { config } from "./config"

const queryClient = new QueryClient();

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </WagmiProvider>
    </body>
    </html>
  );
}
