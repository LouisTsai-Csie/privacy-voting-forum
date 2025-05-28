// app/providers.tsx
"use client"

import { ReactNode } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { metaMask } from "@wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// 1. 建立 React Query client
const queryClient = new QueryClient()

// 2. 建立 Wagmi config
const wagmiConfig = createConfig({
  connectors: [ metaMask() ],
  chains:    [ mainnet, sepolia ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// 3. Providers 集合
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  )
}
