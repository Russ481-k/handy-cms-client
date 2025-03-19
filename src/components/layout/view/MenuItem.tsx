"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { Menu } from "../../../app/cms/menu/page";
import { LuPlus } from "react-icons/lu";
import { useRef } from "react";

interface MenuItemProps {
  menu: Menu;
  isChild?: boolean;
  isNavHovered: boolean;
  isDark: boolean;
}

export function MenuItem({
  menu,
  isChild = false,
  isNavHovered,
  isDark,
}: MenuItemProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const hasChildren = menu.children && menu.children.length > 0;
  const colors = useColors();
  const lineColor = colors.border;

  return (
    <Box
      position="relative"
      width={isChild ? "100%" : "auto"}
      minW={isChild ? "80px" : "160px"}
      ref={menuRef}
    >
      <Flex
        px={1}
        py={1}
        alignItems="center"
        cursor="pointer"
        whiteSpace="nowrap"
        fontSize={isChild ? "sm" : "md"}
        fontWeight={isChild ? "normal" : "semibold"}
        _hover={{
          color: isDark ? "blue.200" : "blue.600",
          transform: "translateX(4px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        position="relative"
        zIndex={1}
        height="32px"
        width="100%"
      >
        <Text whiteSpace="nowrap">{menu.name}</Text>
        {hasChildren && (
          <Box
            as={LuPlus}
            ml={1}
            transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isNavHovered ? "rotate(180deg)" : "rotate(0deg)"}
          />
        )}
      </Flex>

      <Box
        pl={isChild ? 2 : 1}
        position="relative"
        opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
        maxHeight={hasChildren && (isChild || isNavHovered) ? "2000px" : "0"}
        overflow="hidden"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        width="100%"
      >
        {menu.children?.map((childMenu, index, array) => (
          <Box
            key={childMenu.id}
            position="relative"
            mb={index === array.length - 1 ? 0 : 1}
            transform={`translateY(${
              hasChildren && (isChild || isNavHovered) ? "0" : "-10px"
            })`}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            width="100%"
          >
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={index === array.length - 1 ? "16px" : "0"}
              width="2px"
              bg={lineColor}
              transition="opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
              borderRadius="full"
            />
            <Box
              position="absolute"
              left={0}
              top="16px"
              width="12px"
              height="2px"
              bg={lineColor}
              transform="translateY(0)"
              transition="opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
              borderRadius="full"
            />
            {index > 0 && (
              <Box
                position="absolute"
                left={0}
                top={-8}
                height="calc(100% + 8px)"
                width="2px"
                bg={lineColor}
                transition="opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                opacity={hasChildren && (isChild || isNavHovered) ? 1 : 0}
                borderRadius="full"
              />
            )}
            <Box pl={4} position="relative" width="100%">
              <MenuItem
                menu={childMenu}
                isChild={true}
                isNavHovered={isNavHovered}
                isDark={isDark}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
