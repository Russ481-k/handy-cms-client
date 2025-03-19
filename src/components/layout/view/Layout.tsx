"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Header } from "./Header";
import { Footer } from "@/components/layout/view/Footer";
import { Menu } from "@/app/cms/menu/page";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  menus?: Menu[];
}

export function Layout({
  children,
  currentPage = "홈",
  menus = [],
}: LayoutProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex
      width="100vw"
      direction="column"
      bg={isDark ? "gray.900" : "white"}
      position="relative"
    >
      <Header currentPage={currentPage} menus={menus} />
      <Box flex="1">{children}</Box>
      <Footer />
    </Flex>
  );
}
