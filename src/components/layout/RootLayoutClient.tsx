"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { Provider } from "@/components/ui/provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bottombar } from "@/components/layout/Bottombar";
import { Topbar } from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const mainBg = useColorModeValue("white", "black");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const isLargerThanLg = useBreakpointValue({ base: false, lg: true });
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  useEffect(() => {
    setIsSidebarOpen(!!isLargerThanLg);
  }, [isLargerThanLg]);

  return (
    <Box bg={mainBg} margin={0} padding={0} height="100vh" width="100vw" overflow="hidden">
      <Global styles={[getScrollbarStyle(isDark)]} />

      {!isRootPath && (
        <Box
          color={textColor}
          bg={mainBg}
          transition="all 0.2s ease-in-out"
          w="100%"
          h="100vh"
          position="relative"
        >
          <Topbar isSidebarOpen={isSidebarOpen} />
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen((prev) => !prev)}
          />
          <Box
            overflowY="auto"
            pl={{ base: 0, md: isSidebarOpen ? "36" : "0" }}
            h={{ base: "calc(100vh - 56px)", md: "100vh" }}
            py={{ base: "56px", md: "0" }}
          >
            {children}
          </Box>
          <Bottombar />
        </Box>
      )}
      
      {isRootPath && (
        <Box
          color={textColor}
          bg={mainBg}
          w="100%"
          h="100vh"
          position="relative"
          margin={0}
          padding={0}
          overflow="hidden"
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <Layout>{children}</Layout>
    </Provider>
  );
}
