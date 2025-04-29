"use client";

import "@/styles/globals.css";
import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { Global } from "@emotion/react";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import Layout from "@/components/layout/view/Layout";
import { useMenu } from "@/lib/hooks/useMenu";
import { useColors } from "@/styles/theme";
import { sortMenus } from "@/lib/api/menu";
import { useMemo } from "react";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();
  const { menus } = useMenu();
  const treeMenus = useMemo(() => {
    try {
      const responseData = menus;
      if (!responseData) return [];

      // API 응답이 배열인 경우
      if (Array.isArray(responseData)) {
        return sortMenus(responseData);
      }

      // API 응답이 객체인 경우 data 필드를 확인
      const menuData = responseData;
      if (!menuData) return [];

      // menuData가 배열인지 확인
      return Array.isArray(menuData) ? sortMenus(menuData) : [menuData];
    } catch (error) {
      console.error("Error processing menu data:", error);
      return [];
    }
  }, [menus]);

  return (
    <Layout menus={treeMenus}>
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
