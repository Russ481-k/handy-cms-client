"use client";

import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";

// Layout Components
import { FloatingButtons } from "@/components/layout/FloatingButtons";

// Section Components
import { HeroSection } from "@/components/sections/HeroSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { Global } from "@emotion/react";
import Layout from "@/components/layout/view/Layout";

export default function Home() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Layout currentPage="홈">
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
