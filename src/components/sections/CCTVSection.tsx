"use client";

import { Box, Text, AspectRatio } from "@chakra-ui/react";
import { Section } from "@/components/ui/section";
import { useColors } from "@/styles/theme";

export function CCTVSection() {
  const colors = useColors();
  
  return (
    <Section
      title="CCTV 모니터링"
      subtitle="실시간 현장 영상"
      headerRight={
        <Text fontSize="xs" color={colors.text.secondary}>
          Camera #1
        </Text>
      }
    >
      <AspectRatio ratio={16 / 9} h="full">
        <Box
          bg="blue.900"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          boxShadow={colors.shadow.sm}
          transition="all 0.3s ease-in-out"
          _hover={{ boxShadow: colors.shadow.md }}
          _after={{
            content: '""',
            position: "absolute",
            inset: 0,
            bg: "gray.500",
            opacity: 0.1,
          }}
        />
      </AspectRatio>
    </Section>
  );
}
