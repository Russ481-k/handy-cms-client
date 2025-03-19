"use client";

import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { useColors, useStyles } from "@/styles/theme";
import { useColorMode } from "@/components/ui/color-mode";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { Menu } from "../../../app/cms/menu/page";
import { MenuItem } from "./MenuItem";
import { createMenuTree } from "../../../app/cms/utils/menuTree";

interface HeaderProps {
  currentPage: string;
  menus?: Menu[];
}

export function Header({ currentPage, menus = [] }: HeaderProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navRef = useRef<HTMLDivElement>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const styles = useStyles(colors, false);

  const { rootMenus } = useMemo(() => createMenuTree(menus), [menus]);

  return (
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
              mt={1}
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
  );
}
