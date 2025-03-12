"use client";

import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { scrollbarStyle } from "@/styles/scrollbar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { Provider } from "@/components/ui/provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bottombar } from "@/components/layout/Bottombar";
import { Topbar } from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainBg = useColorModeValue("white", "black");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const isLargerThanLg = useBreakpointValue({ base: false, lg: true });
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  useEffect(() => {
    setIsSidebarOpen(!!isLargerThanLg);
  }, [isLargerThanLg]);

  return (
    <Box bg={mainBg}>
      <Global styles={[scrollbarStyle]} />
      {/* <Box position="fixed" inset="0" zIndex={-1} bg={mainBg} /> */}

      <Box
        color={textColor}
        bg={mainBg}
        transition="all 0.2s ease-in-out"
        w="full"
        overflowY="auto"
        pl={{ base: 0, md: !isRootPath && isSidebarOpen ? "36" : "0" }}
        h={{ base: !isRootPath ? "calc(100vh - 56px)" : "100vh", md: "auto" }}
        py={{ base: !isRootPath ? "56px" : "0", md: "0" }}
      >
        {!isRootPath && (
          <>
            <Topbar isSidebarOpen={isSidebarOpen} />
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />
            {children}
            <Bottombar />
          </>
        )}
        {isRootPath && children}
      </Box>
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
