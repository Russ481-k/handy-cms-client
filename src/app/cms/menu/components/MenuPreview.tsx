"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { Menu } from "../page";

interface MenuPreviewProps {
  menus: Menu[];
}

export const MenuPreview = ({ menus }: MenuPreviewProps) => {
  const colors = useColors();

  const renderMenuItem = (menu: Menu, level: number = 0) => {
    return (
      <Box key={menu.id} ml={level * 4}>
        <Flex
          py={2}
          px={3}
          alignItems="center"
          borderBottom="1px"
          borderColor="gray.200"
          _last={{ borderBottom: "none" }}
        >
          <Text
            color={!menu.visible ? "gray.400" : colors.text.primary}
            fontSize="sm"
            fontWeight={level === 0 ? "medium" : "normal"}
          >
            {menu.name}
          </Text>
          {!menu.visible && (
            <Text
              ml={2}
              fontSize="xs"
              color="gray.400"
              bg="gray.100"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              숨김
            </Text>
          )}
        </Flex>
        {menu.children && menu.children.length > 0 && (
          <Box mt={1}>
            {menu.children.map((child) => renderMenuItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      p={6}
      bg={colors.bg}
      borderRadius="xl"
      height="100%"
      overflowY="auto"
      border="1px"
      borderColor="gray.200"
    >
      <Text
        color={colors.text.primary}
        fontSize="lg"
        fontWeight="medium"
        mb={4}
      >
        메뉴 구조 미리보기
      </Text>
      <Box>{menus.map((menu) => renderMenuItem(menu))}</Box>
    </Box>
  );
};
