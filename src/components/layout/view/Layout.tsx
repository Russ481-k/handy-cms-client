"use client";

import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Header } from "./Header";
import { Menu } from "../../../app/cms/menu/page";
import { Footer } from "@/components/layout/view/Footer";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  menus?: Menu[];
}

export function Layout({
  children,
  currentPage = "미리보기",
  menus = [],
}: LayoutProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      width="100%"
      height="100%"
      bg={isDark ? "gray.900" : "white"}
      position="relative"
      borderRadius="lg"
      overflow="hidden"
    >
      <Header currentPage={currentPage} menus={menus} />
      {children}
      <Footer />
    </Box>
  );
}
