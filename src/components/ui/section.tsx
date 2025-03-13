"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

interface SectionProps {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Section({
  title,
  subtitle,
  headerRight,
  children,
  footer,
}: SectionProps) {
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // 홈페이지 스타일에 맞는 색상 적용
  const bg = useColorModeValue(colors.cardBg, colors.cardBg);
  const borderColor = useColorModeValue(colors.border, "whiteAlpha.100");
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const subtitleColor = useColorModeValue(colors.text.secondary, "whiteAlpha.700");

  return (
    <Flex
      position="absolute"
      inset="0"
      direction="column"
      overflow="hidden"
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      pb="1"
      zIndex={1}
      bg={bg}
      boxShadow={colors.shadow.sm}
      backdropFilter="blur(8px)"
      transition="all 0.3s ease-in-out"
      _hover={{
        boxShadow: colors.shadow.md,
        borderColor: colors.primary.alpha,
      }}
    >
      {/* Header */}
      <Box p="3" borderBottom="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <Box>
            <Text
              fontSize="sm"
              fontWeight="600"
              color={textColor}
              letterSpacing="tight"
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                fontSize="xs"
                color={subtitleColor}
                mt="0.5"
                fontFamily="mono"
              >
                {subtitle}
              </Text>
            )}
          </Box>
          {headerRight && <Box>{headerRight}</Box>}
        </Flex>
      </Box>

      {/* Body */}
      <Box flex="1" overflow="auto" pl="2" pr="1" py="2" mr="1">
        {children}
      </Box>

      {/* Footer */}
      {footer && (
        <Box p="3" borderTop="1px solid" borderColor={borderColor}>
          {footer}
        </Box>
      )}
    </Flex>
  );
}
