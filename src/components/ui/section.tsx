"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

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
  const bg = useColorModeValue("whiteAlpha.900", "#1A1A1A");
  const borderColor = useColorModeValue("gray.100", "whiteAlpha.100");
  const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const subtitleColor = useColorModeValue("gray.500", "whiteAlpha.700");

  return (
    <Flex
      position="absolute"
      inset="0"
      direction="column"
      overflow="hidden"
      borderRadius="md"
      border="0"
      pb="1"
      zIndex={1}
      bg={bg}
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
