"use client";

import { Box, Container, VStack } from "@chakra-ui/react";
import { Menu } from "@/app/cms/menu/page";

import { useColorMode } from "@/components/ui/color-mode";

import { useEffect } from "react";

import { Layout } from "./Layout";
import { CompanySection } from "@/components/sections/CompanySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";

interface MainProps {
  menus: Menu[];
}

export function Main({ menus }: MainProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    console.log("Raw menu data:", menus);
  }, [menus]);

  return (
    <Layout currentPage="메뉴">
      <Box
        width="100%"
        height="100%"
        bg={isDark ? "gray.900" : "white"}
        overflow="visible"
        position="relative"
      >
        {/* 메인 컨텐츠 */}
        <Box
          bg={isDark ? "gray.900" : "white"}
          minH="calc(100vh - 60px)"
          overflowY="auto"
          margin={0}
          padding={0}
          id="main-content"
        >
          <Box p={4} height="680px">
            <HeroSection />
          </Box>
          <Container maxW="container.xl" py={20}>
            <VStack gap={20} align="stretch">
              <CompanySection />
              <EducationSection />
              <NewsSection />
              <ApplicationSection />
            </VStack>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}
