"use client";

import {
  Box,
  Flex,
  Text,
  Link,
  HStack,
  Container,
  Icon,
} from "@chakra-ui/react";
import { useColors, useStyles } from "@/styles/theme";
import { Menu } from "../page";
import { LuChevronDown } from "react-icons/lu";
import NextLink from "next/link";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { Hero } from "@/components/section/Hero";
import { QuickStats } from "@/components/section/QuickStats";
import { ContentTabs } from "@/components/section/ContentTabs";
import { ContactInfo } from "@/components/section/ContactInfo";
import { TopBanner } from "@/components/layout/TopBanner";
import { Footer } from "@/components/layout/Footer";

interface MenuPreviewProps {
  menus: Menu[];
}

export function MenuPreview({ menus }: MenuPreviewProps) {
  const colors = useColors();
  const styles = useStyles(colors, false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // 메뉴를 계층 구조로 변환
  const menuMap = new Map<number, Menu>();
  const rootMenus: Menu[] = [];

  // 모든 메뉴를 맵에 저장
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 계층 구조 구성
  menus.forEach((menu) => {
    if (menu.parentId) {
      const parent = menuMap.get(menu.parentId);
      if (parent) {
        parent.children?.push(menuMap.get(menu.id)!);
      }
    } else {
      rootMenus.push(menuMap.get(menu.id)!);
    }
  });

  const renderMenuItem = (menu: Menu) => {
    const hasChildren = menus.some((m) => m.parentId === menu.id);

    return (
      <Box key={menu.id} position="relative" role="group">
        <Flex
          px={4}
          py={2}
          alignItems="center"
          cursor="pointer"
          _hover={{ bg: hoverBgColor }}
        >
          <Text>{menu.name}</Text>
          {hasChildren && <Icon as={LuChevronDown} ml={1} />}
        </Flex>

        {hasChildren && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            bg={bgColor}
            boxShadow="md"
            borderRadius="md"
            minW="240px"
            opacity={0}
            visibility="hidden"
            transform="translateY(-10px)"
            transition="all 0.2s"
            _groupHover={{
              opacity: 1,
              visibility: "visible",
              transform: "translateY(0)",
            }}
            zIndex={1000}
          >
            {menus
              .filter((m) => m.parentId === menu.id)
              .map((childMenu) => (
                <Box
                  key={childMenu.id}
                  px={4}
                  py={2}
                  _hover={{ bg: hoverBgColor }}
                >
                  <Text>{childMenu.name}</Text>
                </Box>
              ))}
          </Box>
        )}
      </Box>
    );
  };

  // 모의 데이터
  const scheduleData = [
    { phase: "1차 모집", period: "2025.03.01 - 2025.03.31", status: "진행중" },
    {
      phase: "2차 모집",
      period: "2025.04.01 - 2025.04.30",
      status: "진행 예정",
    },
    {
      phase: "3차 모집",
      period: "2025.05.01 - 2025.05.31",
      status: "진행 예정",
    },
  ];

  return (
    <Box
      width="100%"
      height="100%"
      bg={isDark ? "gray.900" : "gray.50"}
      overflow="hidden"
      position="relative"
      boxShadow={colors.shadow.lg}
    >
      {/* TopBanner */}
      <TopBanner />

      {/* 헤더 */}
      <Box
        boxShadow={colors.shadow.md}
        borderBottom="1px solid"
        borderColor={isDark ? "whiteAlpha.200" : colors.border}
        width="100%"
        transition="all 0.3s ease-in-out"
        backdropFilter="blur(8px)"
        backgroundColor={
          isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"
        }
        m={0}
        p={0}
        height="80px"
      >
        <Container
          {...styles.container}
          maxW="100%"
          px={{ base: 2, md: 6, lg: 8 }}
          py={0}
          height="100%"
        >
          <Flex
            justify="space-between"
            align="center"
            width="100%"
            height="100%"
          >
            {/* 로고 */}
            <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
              <HStack gap={{ base: 2, md: 3 }}>
                <Box
                  width={{ base: "80px", md: "110px" }}
                  height={{ base: "30px", md: "40px" }}
                  bg={isDark ? "whiteAlpha.200" : "gray.100"}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.3s ease-in-out"
                >
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color={isDark ? "whiteAlpha.700" : "gray.500"}
                  >
                    로고
                  </Text>
                </Box>
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "lg", md: "xl" }}
                  bgGradient={colors.gradient.primary}
                  bgClip="text"
                  transition="all 0.3s ease-in-out"
                  display="block"
                >
                  창업가꿈 4호점
                </Text>
              </HStack>
            </Link>

            {/* 메뉴 */}
            <HStack gap={1} display={{ base: "none", md: "flex" }}>
              {rootMenus.map((menu) => renderMenuItem(menu))}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 메인 컨텐츠 */}
      <Box
        bg={isDark ? "gray.900" : "gray.50"}
        minH="calc(100vh - 80px)"
        overflowY="auto"
        margin={0}
        padding={0}
        id="main-content"
      >
        <Container
          {...styles.container}
          maxW="100%"
          px={{ base: 4, md: 6, lg: 8 }}
          py={8}
        >
          {/* Hero 섹션 */}
          <Hero scheduleData={scheduleData} />

          {/* QuickStats 섹션 */}
          <QuickStats />

          {/* ContentTabs 섹션 */}
          <ContentTabs />

          {/* ContactInfo 섹션 */}
          <ContactInfo />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
