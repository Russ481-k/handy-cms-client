"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItems } from "./MenuItems";
import { Tooltip } from "@/components/ui/tooltip";

export function Bottombar() {
  const currentPath = usePathname();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("#0A3980", "gray.800");
  const { colorMode } = useColorMode();
  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      borderTop="1px solid"
      borderColor={borderColor}
      bg={bg}
      display={{ base: "block", md: "none" }}
      zIndex={1000}
      h="56px"
    >
      <Flex justify="space-around" py={1}>
        {MenuItems.map((item, index) => (
          <Link key={index} href={item.path}>
            <Tooltip
              showArrow
              content={item.label}
              positioning={{ placement: "top" }}
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
              <IconButton
                variant="ghost"
                aria-label={item.path}
                as={item.icon}
                bg="transparent"
                color="white"
                _hover={{
                  bg:
                    currentPath === item.path
                      ? colorMode === "light"
                        ? "gray.100"
                        : "whiteAlpha.200"
                      : "transparent",
                  color:
                    currentPath === item.path
                      ? colorMode === "light"
                        ? "#0A3981"
                        : "whiteAlpha.900"
                      : "white",
                }}
                _active={{
                  bg:
                    currentPath === item.path
                      ? colorMode === "light"
                        ? "gray.100"
                        : "whiteAlpha.200"
                      : "transparent",
                  color:
                    currentPath === item.path
                      ? colorMode === "light"
                        ? "#0A3981"
                        : "whiteAlpha.900"
                      : "white",
                }}
                css={{
                  "&[data-active='true']": {
                    bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200",
                    color: colorMode === "light" ? "#0A3981" : "whiteAlpha.900",
                  },
                }}
                data-active={currentPath === item.path}
                size="sm"
                p={1}
              />
            </Tooltip>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
