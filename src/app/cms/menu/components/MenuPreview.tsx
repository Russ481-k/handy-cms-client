"use client";

import {
  Box,
  Flex,
  Text,
  Link,
  HStack,
  Container,
  Button,
  Grid,
  GridItem,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { useColors, useStyles } from "@/styles/theme";
import { Menu } from "../page";
import { LuChevronDown, LuArrowRight } from "react-icons/lu";
import NextLink from "next/link";
import { useColorMode } from "@/components/ui/color-mode";
import { Hero } from "@/components/section/Hero";
import { QuickStats } from "@/components/section/QuickStats";
import { ContentTabs } from "@/components/section/ContentTabs";
import { ContactInfo } from "@/components/section/ContactInfo";
import { TopBanner } from "@/components/layout/TopBanner";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { IconButton } from "@chakra-ui/react";
import { HeroSection } from "./sections/HeroSection";
import { CompanySection } from "./sections/CompanySection";
import { EducationSection } from "./sections/EducationSection";
import { NewsSection } from "./sections/NewsSection";

interface MenuPreviewProps {
  menus: Menu[];
}

interface MenuItemProps {
  menu: Menu;
  isChild?: boolean;
  isNavHovered: boolean;
  isDark: boolean;
}

const MenuItem = ({
  menu,
  isChild = false,
  isNavHovered,
  isDark,
}: MenuItemProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const hasChildren = menu.children && menu.children.length > 0;
  const colors = useColors();
  const lineColor = colors.border;

  return (
    <Box
      position="relative"
      width={isChild ? "100%" : "auto"}
      minW={isChild ? "80px" : "160px"}
      ref={menuRef}
    >
      <Flex
        px={1}
        py={1}
        alignItems="center"
        cursor="pointer"
        whiteSpace="nowrap"
        fontSize={isChild ? "sm" : "md"}
        fontWeight={isChild ? "normal" : "semibold"}
        _hover={{ color: isDark ? "blue.200" : "blue.600" }}
        position="relative"
        zIndex={1}
        height="32px"
        width="100%"
      >
        <Text whiteSpace="nowrap">{menu.name}</Text>
      </Flex>

      <Box
        pl={isChild ? 2 : 1}
        position="relative"
        opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
        maxHeight={hasChildren && (isChild || isNavHovered) ? "2000px" : "0"}
        overflow="hidden"
        transition="all 0.3s ease-in-out"
        width="100%"
      >
        {menu.children?.map((childMenu, index, array) => (
          <Box
            key={childMenu.id}
            position="relative"
            mb={index === array.length - 1 ? 0 : 1}
            transform={`translateY(${
              hasChildren && (isChild || isNavHovered) ? "0" : "-10px"
            })`}
            transition="all 0.3s ease-in-out"
            width="100%"
          >
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={index === array.length - 1 ? "16px" : "0"}
              width="2px"
              bg={lineColor}
              transition="opacity 0.3s ease-in-out"
              opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
              borderRadius="full"
            />
            <Box
              position="absolute"
              left={0}
              top="16px"
              width="20px"
              height="2px"
              bg={lineColor}
              transform="translateY(0)"
              transition="opacity 0.3s ease-in-out"
              opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
              borderRadius="full"
            />
            {index > 0 && (
              <Box
                position="absolute"
                left={0}
                top={-8}
                height="calc(100% + 8px)"
                width="2px"
                bg={lineColor}
                transition="opacity 0.3s ease-in-out"
                opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
                borderRadius="full"
              />
            )}
            <Box pl={4} position="relative" width="100%">
              <MenuItem
                menu={childMenu}
                isChild={true}
                isNavHovered={isNavHovered}
                isDark={isDark}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export function MenuPreview({ menus }: MenuPreviewProps) {
  const colors = useColors();
  const styles = useStyles(colors, false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isNavHovered, setIsNavHovered] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Raw menu data:", menus);
  }, [menus]);

  const { menuMap, rootMenus } = useMemo(() => {
    if (!menus || menus.length === 0) {
      return { menuMap: new Map(), rootMenus: [] };
    }

    const map = new Map<number, Menu>();
    const roots: Menu[] = [];

    menus.forEach((menu) => {
      if (menu && menu.id) {
        map.set(menu.id, menu);
        if (!menu.parentId) {
          roots.push(menu);
        }
      }
    });

    roots.sort((a, b) => a.sortOrder - b.sortOrder);

    const sortChildren = (menu: Menu) => {
      if (menu.children && menu.children.length > 0) {
        menu.children.sort((a, b) => a.sortOrder - b.sortOrder);
        menu.children.forEach(sortChildren);
      }
    };

    roots.forEach(sortChildren);

    console.log("Processed menu data:", {
      roots,
      menuMap: Array.from(map.entries()),
      originalMenus: menus,
    });

    return { menuMap: map, rootMenus: roots };
  }, [menus]);

  const companies = [
    {
      // tags: ["숏폼 ", "AI추천"],
      name: "입주기업",
      description: "",
      image: "",
    },
    {
      tags: ["해외셀러", "해외직구"],

      name: "유니마스",
      description: "셀링지원 솔루션",
      image: "/images/companies/unimas.png",
    },
    {
      tags: ["생성AI", "모바일 키패드"],

      name: "삼선택",
      description: "생성형 AI를 활용한 모바일 키패드",
      image: "/images/companies/samsunteck.png",
    },
    {
      tags: ["웰니스 향기", "친환경 라이프"],
      name: "세로라",
      description: "실리카 나노 탈취 방향제",
      image: "/images/companies/serora.png",
    },
  ];

  return (
    <Box
      width="100%"
      height="100%"
      bg={isDark ? "gray.900" : "white"}
      overflow="visible"
      position="relative"
    >
      {/* TopBanner */}
      <TopBanner
        bgGradient={colors.gradient.primary}
        color={colors.text.inverse}
        position="sticky"
        top={0}
        zIndex={1000}
        height="40px"
      />

      {/* 헤더 */}
      <Box
        width="100%"
        transition="all 0.3s ease"
        backdropFilter="blur(8px)"
        backgroundColor={
          isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"
        }
        position="sticky"
        top={0}
        zIndex={1000}
        ref={navRef}
        py={4}
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        borderBottom="1px solid"
        borderColor={isDark ? "gray.700" : "gray.100"}
        boxShadow="sm"
      >
        <Container
          {...styles.container}
          maxW="100%"
          px={{ base: 2, md: 8, lg: 12 }}
        >
          <Flex
            gap={6}
            justify="space-between"
            align="flex-start"
            width="100%"
            height="100%"
          >
            {/* 로고 */}
            <Link as={NextLink} href="/" _hover={{ textDecoration: "none" }}>
              <HStack>
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={200}
                  height={40}
                  style={{ minWidth: "180px", height: "40px" }}
                />
              </HStack>
            </Link>

            {/* 메뉴 */}
            <Box>
              <HStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
              >
                {rootMenus.map((menu) => (
                  <MenuItem
                    key={menu.id}
                    menu={menu}
                    isNavHovered={isNavHovered}
                    isDark={isDark}
                  />
                ))}
              </HStack>
            </Box>
          </Flex>
        </Container>
      </Box>

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
          <HeroSection isDark={isDark} />
        </Box>

        <Container maxW="container.xl" py={20}>
          <CompanySection />
          <EducationSection />
          <NewsSection />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
