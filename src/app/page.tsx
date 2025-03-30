"use client";

import { Box } from "@chakra-ui/react";

// Layout Components
import { FloatingButtons } from "@/components/layout/FloatingButtons";

// Section Components
import { CompanySection } from "@/components/sections/CompanySection";
import { EducationSection } from "@/components/sections/EducationSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ApplicationSection } from "@/components/sections/ApplicationSection";
import { getScrollbarStyle } from "@/styles/scrollbar";
import { Global } from "@emotion/react";
import Layout from "@/components/layout/view/Layout";
import { useColorMode } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

export default function Home() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();
  return (
    <Layout currentPage="홈">
      <Global styles={getScrollbarStyle(isDark)} />
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
