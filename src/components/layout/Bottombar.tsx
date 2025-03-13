"use client";

import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItems } from "./MenuItems";
import { Tooltip } from "@/components/ui/tooltip";
import { useColors } from "@/styles/theme";

export function Bottombar() {
  const currentPath = usePathname();
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // 홈페이지 스타일에 맞는 색상 적용
  const borderColor = useColorModeValue(colors.border, "whiteAlpha.200");
  const bg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)", 
    "rgba(15, 23, 42, 0.95)"
  );
  const activeItemBg = useColorModeValue(colors.primary.light, "whiteAlpha.200");
  const activeItemColor = useColorModeValue(colors.primary.default, "whiteAlpha.900");
  const textColor = useColorModeValue(colors.text.primary, "white");
  
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
      backdropFilter="blur(8px)"
      boxShadow={colors.shadow.sm}
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
                color={currentPath === item.path ? colors.primary.default : textColor}
                _hover={{
                  bg: colors.primary.alpha,
                  color: colors.primary.default,
                }}
                _active={{
                  bg: activeItemBg,
                  color: activeItemColor,
                }}
                css={{
                  "&[data-active='true']": {
                    bg: activeItemBg,
                    color: activeItemColor,
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
