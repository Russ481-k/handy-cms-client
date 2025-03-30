"use client";

import "@/styles/globals.css";
import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { Global } from "@emotion/react";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import Layout from "@/components/layout/view/Layout";
import { useColors } from "@/styles/theme";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();

  return (
    <Layout>
      <Box
        as="main"
        bg={colors.bg}
        flex="1"
        position="relative"
        minH="100vh"
        mx="auto"
      >
        <Global styles={[getScrollbarStyle(isDark)]} />
        {children}
        <FloatingButtons />
      </Box>
    </Layout>
  );
}
