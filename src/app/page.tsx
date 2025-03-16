"use client";

import { Box, Container } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useColors, useStyles } from "@/styles/theme";

// Layout Components
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";

// Section Components
import { Hero } from "@/components/section/Hero";
import { QuickStats } from "@/components/section/QuickStats";
import { ContentTabs } from "@/components/section/ContentTabs";
import { ContactInfo } from "@/components/section/ContactInfo";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const colors = useColors();
  const styles = useStyles(colors, showScrollTop);

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById("main-content");
      if (!mainContent) return;

      const currentScrollY = mainContent.scrollTop;
      setShowScrollTop(currentScrollY > 300);
    };

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
      return () => mainContent.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scheduleData = [
    {
      phase: "1차 모집",
      period: "2025.03.01 - 2025.03.31",
      status: "진행 예정",
    },
    {
      phase: "1차 심사",
      period: "2025.04.01 - 2025.04.15",
      status: "진행 예정",
    },
    {
      phase: "2차 모집",
      period: "2025.07.01 - 2025.07.31",
      status: "진행 예정",
    },
    {
      phase: "2차 심사",
      period: "2025.08.01 - 2025.08.15",
      status: "진행 예정",
    },
  ];

  return (
    <Box
      width="100%"
      height="100vh"
      overflow="hidden"
      position="relative"
      margin={0}
      padding={0}
    >
      <Header />
      <Box
        bg={colors.bg}
        height="100vh"
        overflowY="auto"
        margin={0}
        padding={0}
        id="main-content"
      >
        <Container
          {...styles.container}
          maxW="100%"
          px={{ base: 4, md: 6, lg: 8 }}
        >
          <Hero scheduleData={scheduleData} />
          <QuickStats />
          <ContentTabs />
          <ContactInfo />
        </Container>

        <Footer />
        <FloatingButtons
          showScrollTop={showScrollTop}
          scrollToTop={scrollToTop}
        />
      </Box>
    </Box>
  );
}
