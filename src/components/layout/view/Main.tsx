"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { Menu } from "@/app/cms/menu/page";
import { useEffect } from "react";
import { CompanySection } from "@/components/sections/CompanySection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import Layout from "./Layout";

interface MainProps {
  menus: Menu[];
  isPreview?: boolean;
}

export const Main = ({ menus, isPreview = false }: MainProps) => {
  useEffect(() => {
    console.log("Raw menu data:", menus);
  }, [menus]);

  return (
    <Layout currentPage="홈" isPreview={isPreview} menus={menus}>
      <Box as="main" flex="1" w="full">
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
        <Container maxW="container.xl" py={8}>
          <VStack gap={16} align="stretch">
            <CompanySection />
            <EducationSection />
            <NewsSection />
            <ApplicationSection />
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
};
