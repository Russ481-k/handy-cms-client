"use client";

import { Box } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { useColors } from "@/styles/theme";
import { HeroSection } from "@/components/sections/HeroSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import Layout from "@/components/layout/view/Layout";
import { useColorMode } from "@/components/ui/color-mode";
import { useMenu } from "@/lib/hooks/useMenu";
import { sortMenus } from "@/lib/api/menu";
import { useMemo } from "react";

export default function Home() {
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
    <Layout currentPage="홈" menus={treeMenus}>
      <Global styles={getScrollbarStyle(isDark)} />
      <HeroSection
        slideContents={[
          {
            title: "AI와 함께 창업의 미래를 열다!",
            subtitle:
              "창업 공간 + 맞춤 교육 + 추가 지원까지\n지금 창업의 꿈을 실현하세요!",
            image: "/images/banners/banner_1.jpg",
          },
          {
            title: "혁신적인 창업 지원 시스템",
            subtitle:
              "AI 기반 맞춤형 솔루션으로\n당신의 창업을 성공으로 이끌어드립니다",
            image: "/images/banners/banner_2.gif",
          },
          {
            title: "함께 성장하는 창업 생태계",
            subtitle:
              "다양한 분야의 전문가와 함께\n창업의 모든 단계를 지원합니다",
            image: "/images/banners/banner_3.gif",
          },
        ]}
      />
      <Box
        as="main"
        id="main-content"
        bg={colors.bg}
        flex="1"
        overflowY="auto"
        position="relative"
      >
        <CompanySection />
        <EducationSection />
        <NewsSection />
        <ApplicationSection />

        <FloatingButtons />
      </Box>
    </Layout>
  );
}
