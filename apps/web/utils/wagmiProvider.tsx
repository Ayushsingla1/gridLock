"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { flowTestnet } from 'viem/chains';

const U2U = {
  id: 39,
  name: 'U2U',
  iconBackground: '#fff',
  nativeCurrency: { name: 'U2U Solaris Mainnet', symbol: 'U2U', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-mainnet.u2u.xyz'] },
  },
  blockExplorers: {
    default: { name: 'u2uScan', url: 'https://u2uscan.xyz' },
  }
} as const satisfies Chain;


export const config = createConfig({
  chains: [flowTestnet],
  transports: {
    // [U2U.id]: http(),
    [flowTestnet.id] : http()
  }
});

const queryClient = new QueryClient();

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
};

export default App;