"use client";

import { Box, Link, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { Menu } from "../../../app/cms/menu/page";

interface MenuItemProps {
  menu: Menu;
  isNavHovered: boolean;
  isDark: boolean;
  isRoot: boolean;
  currentPage: string;
}

export function MenuItem({
  menu,
  isNavHovered,
  isDark,
  isRoot,
  currentPage,
}: MenuItemProps) {
  const isActive = currentPage === menu.url;
  const hasChildren = menu.children && menu.children.length > 0;

  return (
    <Box position="relative" flex="1">
      <Box
        position="relative"
        role="group"
        width="fit-content"
        _before={{
          content: '""',
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "0",
          height: "2px",
          bg: isDark ? "blue.200" : "blue.500",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: "0",
        }}
        _hover={{
          _before: {
            width: "100%",
            opacity: "1",
          },
        }}
      >
        <Link
          as={NextLink}
          href={menu.url || "#"}
          display="block"
          px={4}
          py={2}
          fontSize="sm"
          fontWeight={isRoot ? "bold" : "medium"}
          color={
            isActive
              ? isDark
                ? "blue.200"
                : "blue.500"
              : isDark
              ? "gray.300"
              : "gray.600"
          }
          _hover={{
            textDecoration: "none",
            color: isDark ? "blue.200" : "blue.500",
            transform: "translateY(-1px)",
          }}
          _focus={{
            boxShadow: "none",
            color: isDark ? "blue.200" : "blue.500",
            transform: "translateY(-1px)",
            outline: "none",
            border: "none",
          }}
          _groupHover={{
            color: isDark ? "blue.200" : "blue.500",
          }}
          _active={{
            bg: "transparent",
          }}
          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          borderRadius="md"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {menu.name}
        </Link>
      </Box>

      {/* 하위 메뉴 컨테이너 */}
      <Box
        position="static"
        overflow="hidden"
        maxHeight={isNavHovered && hasChildren ? "1000px" : "0"}
        opacity={isNavHovered && hasChildren ? 1 : 0}
        transform={`translateY(${isNavHovered && hasChildren ? "0" : "-10px"})`}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        visibility={isNavHovered && hasChildren ? "visible" : "hidden"}
      >
        {/* 하위 메뉴 내용 */}
        <Box pt={2}>
          <VStack align="stretch" gap={0}>
            {menu.children?.map((child) => (
              <Box
                key={child.id}
                role="group"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  left: "0",
                  width: "2px",
                  height: "0%",
                  bg: isDark ? "blue.200" : "blue.500",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: "0",
                }}
                _hover={{
                  _before: {
                    height: "80%",
                    opacity: "0.5",
                  },
                }}
              >
                <Link
                  as={NextLink}
                  href={!!child.url ? "/routes" + child.url : "#"}
                  display="block"
                  px={4}
                  py={2}
                  fontSize="sm"
                  fontWeight="medium"
                  color={isDark ? "gray.300" : "gray.600"}
                  _hover={{
                    textDecoration: "none",
                    color: isDark ? "blue.200" : "blue.500",
                    transform: "translateX(4px)",
                  }}
                  _focus={{
                    boxShadow: "none",
                    color: isDark ? "blue.200" : "blue.500",
                    transform: "translateX(4px)",
                    outline: "none",
                    border: "none",
                  }}
                  _groupHover={{
                    color: isDark ? "blue.200" : "blue.500",
                  }}
                  _active={{
                    bg: "transparent",
                  }}
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="md"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {child.name}
                </Link>

                {/* 3차 메뉴 */}
                {child.children && child.children.length > 0 && (
                  <VStack align="stretch" gap={0} pl={4}>
                    {child.children.map((grandChild) => (
                      <Box
                        key={grandChild.id}
                        role="group"
                        position="relative"
                        _before={{
                          content: '""',
                          position: "absolute",
                          left: "0",
                          width: "2px",
                          height: "0%",
                          bg: isDark ? "blue.200" : "blue.500",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: "0",
                        }}
                        _hover={{
                          _before: {
                            height: "80%",
                            opacity: "0.3",
                          },
                        }}
                      >
                        <Link
                          as={NextLink}
                          href={
                            !!grandChild.url ? "/routes" + grandChild.url : "#"
                          }
                          display="block"
                          px={4}
                          py={1.5}
                          fontSize="sm"
                          color={isDark ? "gray.400" : "gray.500"}
                          _hover={{
                            textDecoration: "none",
                            color: isDark ? "blue.200" : "blue.500",
                            transform: "translateX(4px)",
                          }}
                          _focus={{
                            boxShadow: "none",
                            color: isDark ? "blue.200" : "blue.500",
                            transform: "translateX(4px)",
                            outline: "none",
                            border: "none",
                          }}
                          _groupHover={{
                            color: isDark ? "blue.200" : "blue.500",
                          }}
                          _active={{
                            bg: "transparent",
                          }}
                          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                          borderRadius="md"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {grandChild.name}
                        </Link>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
