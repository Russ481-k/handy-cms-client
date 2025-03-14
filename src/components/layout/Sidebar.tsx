"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { LuChevronLeft, LuChevronRight, LuMic } from "react-icons/lu";
import { Avatar } from "@/components/layout/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/ui/tooltip";
import { MenuItems } from "./MenuItems";
import { useColors } from "@/styles/theme";

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isSidebarOpen, onToggle }: SidebarProps) {
  const currentPath = usePathname();
  const [activePath, setActivePath] = useState("");
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // 홈페이지 스타일에 맞는 색상 적용
  const sidebarBg = useColorModeValue("white", "rgba(15, 23, 42, 0.95)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  useEffect(() => {
    setActivePath(currentPath || "");
  }, [currentPath]);

  return (
    <Box
      as="aside"
      position="fixed"
      left="0"
      top="0"
      h="100vh"
      w={isSidebarOpen ? "36" : "16"}
      borderRightWidth="1px"
      borderColor={borderColor}
      bg={sidebarBg}
      py="4"
      pl="5"
      display={{ base: "none", md: "block" }}
      transition="all 0.2s ease-in-out"
      overflow="hidden"
      backdropFilter="blur(8px)"
      boxShadow={colors.shadow.sm}
      zIndex="1000"
    >
      <Flex alignItems="center" justifyContent="left" w="full" height="38px">
        <Text
          fontSize={isSidebarOpen ? "36px" : "42px"}
          fontWeight="bold"
          transition="all 0.2s ease-in-out"
          bgGradient={colors.gradient.primary}
          bgClip="text"
        >
          {isSidebarOpen ? " Handy" : "H"}
        </Text>
      </Flex>
      <Flex
        position="absolute"
        h="36px"
        top="68px"
        right="0"
        borderY="1px solid"
        borderLeft="1px solid"
        borderColor={borderColor}
        borderRadius="10px 0 0 10px"
        w={isSidebarOpen ? "132px" : "24px"}
        transition="all 0.2s ease-in-out"
        justifyContent="right"
        alignItems="center"
        overflow="hidden"
        cursor="pointer"
        onClick={onToggle}
        bg={isDark ? "blackAlpha.50" : "whiteAlpha.50"}
        _hover={{
          borderColor: colors.primary.alpha,
        }}
      >
        <Text
          color={textColor}
          fontSize="10px"
          h="32px"
          transition="all 0.2s ease-in-out"
          textAlign="center"
          w="full"
        >
          Handy Content Management System
        </Text>
        <IconButton
          w="10px"
          h="36px"
          size="2xs"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          variant="ghost"
          bg={isDark ? "whiteAlpha.50" : "white"}
          color={isDark ? "white" : "gray.700"}
          textAlign="right"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderWidth="0 0 0 1px"
          borderRadius="0"
          borderColor={borderColor}
        >
          <Box
            as={isSidebarOpen ? LuChevronLeft : LuChevronRight}
            fontSize="14px"
            bgClip="text"
            color="inherit"
          />
        </IconButton>
      </Flex>
      <Box>
        <Box mt="16">
          {MenuItems.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.path}
                style={{
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                }}
                passHref
              >
                <Tooltip
                  content={isSidebarOpen ? "" : item.label}
                  disabled={isSidebarOpen}
                  positioning={{ placement: "right" }}
                  openDelay={50}
                  closeDelay={200}
                  contentProps={{
                    css: {
                      width: "80px",
                      textAlign: "center",
                      height: "24px",
                      alignItems: "center",
                      lineHeight: "16px",
                      fontSize: "12px",
                      bg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    },
                  }}
                >
                  <Button
                    variant="ghost"
                    h="10"
                    mb="2"
                    w={isSidebarOpen ? "full" : "0"}
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                    overflow="hidden"
                    textAlign="left"
                    borderRadius="4px"
                    ml="-9px"
                    p="9px"
                    bg="transparent"
                    transition="all 0.2s ease-in-out"
                    color={isDark ? colors.gradient.primary : "gray.700"}
                    _hover={{
                      bg:
                        activePath === item.path
                          ? isDark
                            ? "whiteAlpha.200"
                            : "gray.100"
                          : "transparent",
                      color:
                        activePath === item.path
                          ? isDark
                            ? "whiteAlpha.900"
                            : "#0A3981"
                          : isDark
                          ? "white"
                          : colors.gradient.primary,
                    }}
                    _active={{
                      bg:
                        activePath === item.path
                          ? isDark
                            ? "whiteAlpha.200"
                            : "gray.100"
                          : "transparent",
                      color:
                        activePath === item.path
                          ? isDark
                            ? "whiteAlpha.900"
                            : "#0A3981"
                          : isDark
                          ? "white"
                          : colors.gradient.primary,
                    }}
                    css={{
                      "&[data-active='true']": {
                        bg: isDark ? "whiteAlpha.200" : "gray.100",
                        color: isDark ? "whiteAlpha.900" : "#0A3981",
                      },
                    }}
                    data-active={activePath === item.path}
                  >
                    <Box as={item.icon} color="inherit" />
                    <Text
                      fontSize="14px"
                      h="5"
                      overflow="hidden"
                      opacity={isSidebarOpen ? 1 : 0}
                      w={isSidebarOpen ? "80px" : "0"}
                      color="inherit"
                    >
                      {item.label}
                    </Text>
                  </Button>
                </Tooltip>
              </Link>
            );
          })}
        </Box>

        <Box position="absolute" bottom="8" left="2" right="0" px="3">
          <Flex
            align="center"
            justify={isSidebarOpen ? "space-between" : "center"}
            width="full"
          >
            <Avatar isSidebarOpen={isSidebarOpen} gradientBorder={true} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
