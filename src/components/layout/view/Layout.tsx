"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Header } from "./Header";
import { Footer } from "@/components/layout/view/Footer";
import { useMenu } from "@/lib/hooks/useMenu";
import { memo, Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

// Header를 메모이제이션하여 props가 변경되지 않으면 리렌더링되지 않도록 함
const MemoizedHeader = memo(Header);

// Footer를 메모이제이션
const MemoizedFooter = memo(Footer);

// 로딩 컴포넌트
const LoadingFallback = () => (
  <Box
    position="fixed"
    top={0}
    left={0}
    right={0}
    bottom={0}
    bg="white"
    zIndex={9999}
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Box
      width="40px"
      height="40px"
      border="4px solid"
      borderColor="blue.500"
      borderTopColor="transparent"
      borderRadius="full"
      animation="spin 1s linear infinite"
    />
  </Box>
);

export default function Layout({ children, currentPage = "홈" }: LayoutProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { menus, error } = useMenu();

  if (error) {
    return <div>Error loading menu data</div>;
  }

  return (
    <Flex
      width="100vw"
      direction="column"
      bg={isDark ? "gray.900" : "white"}
      position="relative"
      minHeight="100vh"
    >
      <MemoizedHeader currentPage={currentPage} menus={menus} />
      <Box flex="1" position="relative">
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </Box>
      <MemoizedFooter />
    </Flex>
  );
}
