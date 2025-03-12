"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { LuMic } from "react-icons/lu";
import { Avatar } from "@/components/layout/Avatar";

export function Topbar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("white", "gray.800");
  const { colorMode } = useColorMode();
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      borderBottom="1px solid"
      borderColor={borderColor}
      bg={bg}
      display={{ base: "block", md: "none" }}
      h="56px"
      w="100%"
      color={colorMode === "light" ? "gray.800" : "white"}
      zIndex={1000}
    >
      <Flex justify="space-between" align="center" px={4} py={2}>
        <Text fontSize="xl" fontWeight="bold">
          Handy
        </Text>
        <Flex gap={2} align="center">
          <Avatar isSidebarOpen={isSidebarOpen} />
        </Flex>
      </Flex>
    </Box>
  );
}
