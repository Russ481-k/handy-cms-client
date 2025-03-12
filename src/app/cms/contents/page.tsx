"use client";

import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function ContentsPage() {
  const bg = useColorModeValue("white", "black");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Box bg={bg} color={textColor} minH="100vh">
      ContentsPage
    </Box>
  );
}
