"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import {arbitrumSepolia} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export const config = createConfig({
    chains: [arbitrumSepolia],
    transports : {
        [arbitrumSepolia.id] : http()
    }
});

const queryClient = new QueryClient();

const App = ({children} : {children : React.ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;