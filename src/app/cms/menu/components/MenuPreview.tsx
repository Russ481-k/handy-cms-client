"use client";

import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  HStack,
  VStack,
  Container,
  Icon,
  AspectRatio,
  Heading,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import { useColors, useStyles } from "@/styles/theme";
import { Menu } from "../page";
import { LuChevronDown } from "react-icons/lu";
import { FiFolder, FiLink, FiFileText, FiFile } from "react-icons/fi";
import NextLink from "next/link";
import { useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";

interface MenuPreviewProps {
  menus: Menu[];
}

export function MenuPreview({ menus }: MenuPreviewProps) {
  const colors = useColors();
  const styles = useStyles(colors, false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

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

  const getMenuIcon = (type: Menu["type"]) => {
    const iconStyle = {
      color: isDark ? "whiteAlpha.700" : "gray.500",
      opacity: 0.7,
      transition: "all 0.2s ease",
    };

    switch (type) {
      case "LINK":
        return <Icon as={FiLink} boxSize={4} style={iconStyle} />;
      case "FOLDER":
        return <Icon as={FiFolder} boxSize={4} style={iconStyle} />;
      case "BOARD":
        return <Icon as={FiFileText} boxSize={4} style={iconStyle} />;
      case "CONTENT":
        return <Icon as={FiFile} boxSize={4} style={iconStyle} />;
      default:
        return null;
    }
  };

  const renderMenuItem = (menu: Menu) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isFolder = menu.type === "FOLDER";

    return (
      <Box
        key={menu.id}
        position="relative"
        onMouseEnter={() => setActiveMenu(menu.id)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <Button
          variant="ghost"
          px={4}
          py={2}
          fontWeight="semibold"
          color={isDark ? "whiteAlpha.900" : "inherit"}
          _hover={{
            bg: isDark ? "whiteAlpha.200" : "rgba(99, 102, 241, 0.1)",
            color: colors.primary.default,
          }}
          fontSize="md"
          transition="all 0.3s ease-in-out"
          display="flex"
          alignItems="center"
          gap={2}
        >
          {getMenuIcon(menu.type)}
          {menu.name}
          {(hasChildren || isFolder) && <Icon as={LuChevronDown} ml={1} />}
        </Button>

        {(hasChildren || isFolder) && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            width="240px"
            bg={isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"}
            borderWidth="1px"
            borderColor={isDark ? "whiteAlpha.200" : colors.border}
            borderRadius="md"
            boxShadow={colors.shadow.md}
            p={2}
            display={activeMenu === menu.id ? "block" : "none"}
            zIndex={10}
            backdropFilter="blur(8px)"
          >
            <VStack align="stretch" gap={0}>
              {menu.children?.map((child) => (
                <Link
                  key={child.id}
                  as={NextLink}
                  href={child.url || "#"}
                  p={3}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  color={isDark ? "whiteAlpha.900" : "inherit"}
                  _hover={{
                    bg: isDark ? "whiteAlpha.200" : "rgba(99, 102, 241, 0.1)",
                    color: colors.primary.default,
                    textDecoration: "none",
                  }}
                >
                  {getMenuIcon(child.type)}
                  {child.name}
                </Link>
              ))}
            </VStack>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      width="100%"
      height="100%"
      bg={isDark ? "gray.900" : "gray.50"}
      overflow="hidden"
      position="relative"
      borderRadius="xl"
      boxShadow={colors.shadow.lg}
    >
      {/* 헤더 */}
      <Box
        boxShadow={colors.shadow.md}
        borderBottom="1px solid"
        borderColor={isDark ? "whiteAlpha.200" : colors.border}
        width="100%"
        transition="all 0.3s ease-in-out"
        py={0}
        backdropFilter="blur(8px)"
        backgroundColor={
          isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)"
        }
        margin={0}
        padding={0}
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
          {/* 히어로 섹션 */}
          <Box mb={12}>
            <AspectRatio ratio={16 / 9} mb={6}>
              <Box
                bg={isDark ? "gray.800" : "gray.100"}
                borderRadius="xl"
                overflow="hidden"
                position="relative"
                boxShadow={colors.shadow.sm}
                transition="all 0.3s ease-in-out"
                _hover={{ boxShadow: colors.shadow.md }}
              >
                <Flex
                  position="absolute"
                  inset={0}
                  direction="column"
                  justify="center"
                  align="center"
                  p={8}
                  textAlign="center"
                >
                  <Heading
                    size="2xl"
                    mb={4}
                    bgGradient={colors.gradient.primary}
                    bgClip="text"
                  >
                    창업가꿈 4호점
                  </Heading>
                  <Text fontSize="xl" color={colors.text.secondary}>
                    혁신적인 창업 아이디어를 실현하세요
                  </Text>
                </Flex>
              </Box>
            </AspectRatio>

            {/* 퀵 스탯스 */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
              {[1, 2, 3].map((i) => (
                <Box
                  key={i}
                  bg={isDark ? "gray.800" : "white"}
                  p={6}
                  borderRadius="xl"
                  boxShadow={colors.shadow.sm}
                >
                  <Heading size="lg" mb={2}>
                    {i * 100}
                  </Heading>
                  <Text color={colors.text.secondary}>참여 기업</Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* 컨텐츠 탭 */}
            <Box
              bg={isDark ? "gray.800" : "white"}
              p={6}
              borderRadius="xl"
              boxShadow={colors.shadow.sm}
            >
              <Heading size="md" mb={4}>
                최근 소식
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                {[1, 2].map((i) => (
                  <Box
                    key={i}
                    p={4}
                    borderWidth="1px"
                    borderColor={isDark ? "whiteAlpha.200" : colors.border}
                    borderRadius="md"
                  >
                    <Badge colorScheme="blue" mb={2}>
                      공지사항
                    </Badge>
                    <Text fontWeight="medium" mb={2}>
                      {i}월 창업가꿈 4호점 모집 안내
                    </Text>
                    <Text fontSize="sm" color={colors.text.secondary}>
                      2024.03.{i}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
