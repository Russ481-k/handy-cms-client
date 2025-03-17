"use client";

import { Box, useBreakpointValue, Flex } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bottombar } from "@/components/layout/Bottombar";
import { Topbar } from "@/components/layout/Topbar";
import { usePathname, useRouter } from "next/navigation";
import { useColors } from "@/styles/theme";
import { ColorModeToggle } from "@/components/ui/ColorModeToggle";
import { useAuth } from "@/lib/AuthContext";

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // 홈페이지 스타일에 맞는 색상 적용
  const mainBg = useColorModeValue(colors.bg, colors.darkBg);
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);

  const isLargerThanLg = useBreakpointValue({ base: false, lg: true });
  const isRootPath = pathname === "/";
  const isCMSPath = pathname?.startsWith("/cms");
  const isLoginPage = pathname === "/cms/login";

  useEffect(() => {
    setIsSidebarOpen(!!isLargerThanLg);
  }, [isLargerThanLg]);

  useEffect(() => {
    if (!isLoading) {
      if (isCMSPath) {
        if (isAuthenticated) {
          if (isLoginPage || pathname === "/cms") {
            router.replace("/cms/menu");
          }
        } else {
          if (!isLoginPage) {
            router.replace("/cms/login");
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isCMSPath, isLoginPage]);

  // 로딩 중이거나 인증되지 않은 CMS 페이지인 경우 네비게이션 숨김
  if (isLoading || (isCMSPath && !isAuthenticated)) {
    return (
      <Box
        bg={mainBg}
        margin={0}
        padding={0}
        h="100vh"
        w="100vw"
        overflow="hidden"
      >
        <Global styles={[getScrollbarStyle(isDark)]} />
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
      </Box>
    );
  }

  return (
    <Box
      bg={mainBg}
      margin={0}
      padding={0}
      height="100vh"
      width="100vw"
      overflow="hidden"
    >
      <Global styles={[getScrollbarStyle(isDark)]} />
      <Box
        color={textColor}
        bg={mainBg}
        transition="all 0.2s ease-in-out"
        w="100%"
        h="100vh"
        position="relative"
      >
        {!isRootPath && isAuthenticated && (
          <>
            <Topbar isSidebarOpen={isSidebarOpen} />
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen((prev) => !prev)}
            />
            <Bottombar />
          </>
        )}
        <Box
          overflowY="auto"
          pl="0"
          pr="0"
          h={{ base: "calc(100vh - 56px)", md: "100vh" }}
          py={{ base: "56px", md: "0" }}
          bg={mainBg}
          transition="all 0.2s ease-in-out"
          position="relative"
          ml={
            !isRootPath && isAuthenticated
              ? { base: 0, md: isSidebarOpen ? "36" : "16" }
              : 0
          }
        >
          {children}
        </Box>

        {/* CMS 화면에서만 컬러 모드 토글 버튼 표시 */}
        {isCMSPath && isAuthenticated && (
          <Flex
            position="fixed"
            bottom="4"
            right="4"
            zIndex="1001"
            display={{ base: "none", md: "flex" }}
          >
            <ColorModeToggle size="md" variant="icon" />
          </Flex>
        )}
      </Box>
    </Box>
  );
}

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
