"use client";

import { Flex, Text } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
}

export function SidebarHeader({ isSidebarOpen }: SidebarHeaderProps) {
  const colors = useColors();

  return (
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
  );
}
