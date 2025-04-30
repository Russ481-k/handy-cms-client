"use client";

import {
  Box,
  Container,
  Flex,
  Link,
  useBreakpointValue,
  Button,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import Image from "next/image";
import { useRef, useState, useEffect, memo } from "react";
import NextLink from "next/link";
import { MenuItem } from "./MenuItem";
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu } from "@/app/cms/menu/page";
import { usePathname } from "next/navigation";

interface HeaderProps {
  currentPage: string;
  menus: Menu[];
  isPreview?: boolean;
}

// MenuItem을 메모이제이션하여 props가 변경되지 않으면 리렌더링되지 않도록 함
const MemoizedMenuItem = memo(MenuItem);

export const Header = memo(function Header({
  currentPage,
  menus = [],
  isPreview,
}: HeaderProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsNavHovered(false);
        setIsMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMouseEnter = () => {
    if (!isMobile && !isMenuOpen) {
      setIsNavHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isMenuOpen) {
      setIsNavHovered(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsNavHovered(!isMenuOpen);
  };

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={isPreview ? 50 : 0}
        left={0}
        right={0}
        zIndex={1000}
        bg={isDark ? "gray.800" : "white"}
        borderBottom="1px solid"
        borderColor={isDark ? "whiteAlpha.100" : "gray.100"}
        backdropFilter={
          isMainPage ? (isMenuOpen ? "blur(10px)" : "none") : "blur(10px)"
        }
        backgroundColor={
          isMainPage
            ? isMenuOpen
              ? isDark
                ? "rgba(26, 32, 44, 0.8)"
                : "rgba(255, 255, 255, 0.8)"
              : "transparent"
            : isDark
            ? "rgba(26, 32, 44, 0.8)"
            : "rgba(255, 255, 255, 0.8)"
        }
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        ref={navRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Main navigation"
        boxShadow={isNavHovered || isMenuOpen ? "lg" : "sm"}
        height={isNavHovered || isMenuOpen ? "auto" : "60px"}
        overflow="hidden"
        opacity={isMainPage ? (isMenuOpen ? 1 : 0) : 1}
        pointerEvents={isMainPage ? (isMenuOpen ? "auto" : "none") : "auto"}
      >
        <Container p={0} transition="all 0.3s" m={0} w="100%" maxW="100%">
          <Grid templateColumns="200px 1fr 200px" gap={0}>
            <GridItem w="200px">
              <Flex py={3} align="center">
                <Link
                  as={NextLink}
                  href="/"
                  _hover={{ textDecoration: "none", opacity: 0.8 }}
                  display="flex"
                  alignItems="center"
                  transition="opacity 0.2s"
                >
                  <Box position="relative" width="200px" height="36px">
                    <Image
                      src="/images/logo/logo.png"
                      alt="logo"
                      fill
                      sizes="200px"
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </Box>
                </Link>
              </Flex>
            </GridItem>

            <GridItem position="relative">
              <Flex py={3} align="center" justify="center">
                <Flex
                  as="nav"
                  justify="center"
                  display={{ base: "none", md: "flex" }}
                  gap={1}
                  width="fit-content"
                  mx="auto"
                >
                  {menus?.map((menu, index) => (
                    <MemoizedMenuItem
                      key={index + menu.id}
                      menu={menu}
                      isNavHovered={isNavHovered || isMenuOpen}
                      isDark={isDark}
                      isRoot={true}
                      currentPage={currentPage}
                    />
                  ))}
                </Flex>
              </Flex>
            </GridItem>

            <GridItem w="200px" textAlign="right" />
          </Grid>
        </Container>
      </Box>
      {isMainPage && (
        <Button
          aria-label="Toggle Menu"
          variant="ghost"
          size="md"
          color={isDark ? "gray.300" : "gray.600"}
          bg={
            isMenuOpen
              ? isDark
                ? "whiteAlpha.100"
                : "blackAlpha.50"
              : "transparent"
          }
          _hover={{
            bg: isDark ? "whiteAlpha.200" : "blackAlpha.100",
            color: isDark ? "blue.200" : "blue.500",
          }}
          _focus={{
            boxShadow: "none",
            bg: isDark ? "whiteAlpha.100" : "blackAlpha.50",
            color: isDark ? "blue.200" : "blue.500",
            outline: "none",
            border: "none",
          }}
          _active={{
            bg: "transparent",
          }}
          transform={isMenuOpen ? "scale(1.1)" : "scale(1)"}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          onClick={toggleMenu}
          borderRadius={0}
          w="60px"
          h="60px"
          position="fixed"
          top={isPreview ? 50 : 0}
          right={0}
          zIndex={1001}
        >
          <Icon
            as={GiHamburgerMenu}
            boxSize={5}
            transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isMenuOpen ? "rotate(180deg)" : "rotate(0)"}
          />
        </Button>
      )}
    </>
  );
});
