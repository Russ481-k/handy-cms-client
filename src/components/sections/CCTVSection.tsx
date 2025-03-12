"use client";

import { Box, Text, AspectRatio } from "@chakra-ui/react";
import { Section } from "@/components/ui/section";

export function CCTVSection() {
  return (
    <Section
      title="CCTV 모니터링"
      subtitle="실시간 현장 영상"
      headerRight={
        <Text fontSize="xs" color="gray.500">
          Camera #1
        </Text>
      }
    >
      <AspectRatio ratio={16 / 9} h="full">
        <Box
          bg="blue.900"
          borderRadius="md"
          overflow="hidden"
          position="relative"
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
