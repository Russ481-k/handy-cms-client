"use client";

import { RecoilRoot } from "recoil";
import { AuthProvider } from "@/lib/AuthContext";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}
