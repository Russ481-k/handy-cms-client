"use client";

import { RecoilRoot } from "recoil";
import { AuthProvider } from "@/lib/AuthContext";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
