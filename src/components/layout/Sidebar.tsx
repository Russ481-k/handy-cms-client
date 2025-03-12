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

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isSidebarOpen, onToggle }: SidebarProps) {
  const currentPath = usePathname();
  const [activePath, setActivePath] = useState("");
  const sidebarBg = useColorModeValue("#0A3981", "#1A1A1A");
  const borderColor = useColorModeValue("white", "gray.700");
  // const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const { colorMode } = useColorMode();
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
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderRightRadius="12px"
      borderColor={colorMode === "light" ? "whiteAlpha.800" : "whiteAlpha.100"}
      bg={sidebarBg}
      py="4"
      pl="5"
      display={{ base: "none", md: "block" }}
      transition="all 0.2s ease-in-out"
      overflow="hidden"
    >
      <Flex alignItems="center" justifyContent="left" w="full" height="38px">
        <Text
          fontSize={isSidebarOpen ? "36px" : "42px"}
          fontWeight="bold"
          transition="all 0.2s ease-in-out"
          color="white"
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
      >
        <Text
          color="white"
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
          as={isSidebarOpen ? LuChevronLeft : LuChevronRight}
          bg={colorMode === "light" ? "white" : "gray.800"}
          color={colorMode === "light" ? "#0A3981" : "whiteAlpha.900"}
          textAlign="right"
          borderWidth="0 0 0 1px"
          borderRadius="0"
          borderColor={borderColor}
        />
      </Flex>
      <Box>
        <Box mt="16">
          {MenuItems.map((item, index) => {
            console.log("activePath : ", activePath === item.path);
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
                  showArrow
                  content={isSidebarOpen ? "" : item.label}
                  disabled={isSidebarOpen}
                  positioning={{ placement: "right" }}
                  openDelay={100}
                  closeDelay={200}
                  contentProps={{
                    css: {
                      width: "68px",
                      textAlign: "center",
                      height: "18px",
                      alignItems: "center",
                      lineHeight: "18px",
                      fontSize: "12px",
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
                    color="white"
                    _hover={{
                      bg:
                        activePath === item.path
                          ? colorMode === "light"
                            ? "gray.100"
                            : "whiteAlpha.200"
                          : "transparent",
                      color:
                        activePath === item.path
                          ? colorMode === "light"
                            ? "#0A3981"
                            : "whiteAlpha.900"
                          : "white",
                    }}
                    _active={{
                      bg:
                        activePath === item.path
                          ? colorMode === "light"
                            ? "gray.100"
                            : "whiteAlpha.200"
                          : "transparent",
                      color:
                        activePath === item.path
                          ? colorMode === "light"
                            ? "#0A3981"
                            : "whiteAlpha.900"
                          : "white",
                    }}
                    css={{
                      "&[data-active='true']": {
                        bg:
                          colorMode === "light" ? "gray.100" : "whiteAlpha.200",
                        color:
                          colorMode === "light" ? "#0A3981" : "whiteAlpha.900",
                      },
                    }}
                    data-active={activePath === item.path}
                  >
                    <item.icon />
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
          <Avatar isSidebarOpen={isSidebarOpen} />
        </Box>
      </Box>
    </Box>
  );
}
