"use client";

import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { useMenu } from "@/lib/hooks/useMenu";

// Layout Components
import { Layout } from "@/components/layout/view/Layout";
import { FloatingButtons } from "@/components/layout/FloatingButtons";

// Section Components
import { HeroSection } from "@/components/sections/HeroSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { Global } from "@emotion/react";

export default function Home() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // useMenu 훅 사용
  const { menus, isLoading, error } = useMenu({
    autoFetch: true, // 컴포넌트가 마운트될 때 자동으로 메뉴를 가져옴
  });

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (error) {
    return <div>Error: {error.message}</div>; // 에러 상태 표시
  }

  return (
    <Layout currentPage="홈" menus={menus}>
      <Global styles={getScrollbarStyle(isDark)} />

      <Box
        as="main"
        id="main-content"
        bg={isDark ? "gray.900" : "white"}
        flex="1"
        overflowY="auto"
        position="relative"
      >
        <Box minH="680px">
          <HeroSection />
        </Box>

        <CompanySection />
        <EducationSection />
        <NewsSection />
        <ApplicationSection />

        <FloatingButtons />
      </Box>
    </Layout>
  );
}
