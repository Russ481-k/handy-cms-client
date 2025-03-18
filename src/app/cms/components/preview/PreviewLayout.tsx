"use client";

import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { PreviewHeader } from "./PreviewHeader";
import { Menu } from "../../menu/page";
import { Footer } from "@/components/layout/Footer";

interface PreviewLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  menus?: Menu[];
}

export function PreviewLayout({
  children,
  currentPage = "미리보기",
  menus = [],
}: PreviewLayoutProps) {
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
      <PreviewHeader currentPage={currentPage} menus={menus} />
      {children}
      <Footer />
    </Box>
  );
}
