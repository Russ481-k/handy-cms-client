"use client";

import { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FiChevronRight, FiChevronDown, FiCircle } from "react-icons/fi";
import { Box, Flex, Text, Button, Center, Icon } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { Menu } from "@/app/cms/menu/page";
import { toaster } from "@/components/ui/toaster";

interface DragItem {
  id: number;
  type: string;
  parentId?: number;
  index: number;
}

interface MenuItemProps {
  menu: Menu;
  level: number;
  onEditMenu: (menu: Menu) => void;
  expanded: boolean;
  onToggle: () => void;
  onMoveMenu: (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => void;
  index: number;
}

const MenuItem = ({
  menu,
  level,
  onEditMenu,
  expanded,
  onToggle,
  onMoveMenu,
  index,
}: MenuItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useColors();

  // 컬러 모드에 맞는 호버 색상 설정
  const hoverBg = useColorModeValue(
    "rgba(66, 153, 225, 0.08)",
    "rgba(255, 255, 255, 0.05)"
  );
  const dropBg = useColorModeValue(
    "rgba(66, 153, 225, 0.12)",
    "rgba(99, 179, 237, 0.15)"
  );
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const disabledTextColor = useColorModeValue("gray.400", "gray.500");
  const indicatorColor = useColorModeValue(
    colors.primary.default,
    colors.primary.light
  );
  const arrowColor = useColorModeValue(
    colors.text.secondary,
    "rgba(255, 255, 255, 0.7)"
  );
  const arrowHoverColor = useColorModeValue(
    colors.primary.default,
    colors.primary.light
  );
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.5)",
    "rgba(74, 85, 104, 0.2)"
  );
  const leafColor = useColorModeValue(
    "rgba(160, 174, 192, 0.6)",
    "rgba(160, 174, 192, 0.4)"
  );

  const [{ isDragging }, drag] = useDrag({
    type: "MENU_ITEM",
    item: {
      id: menu.id,
      type: menu.type,
      parentId: menu.parentId,
      index,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: "MENU_ITEM",
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      // 자기 자신을 드래그하는 경우 무시
      if (item.id === menu.id) {
        return;
      }

      // 부모-자식 관계인 경우 무시 (순환 참조 방지)
      if (isChildOf(menu.id, item.id, menu)) {
        return;
      }
    },
    drop: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      // 자기 자신을 드래그하는 경우 무시
      if (item.id === menu.id) {
        return;
      }

      // 부모-자식 관계인 경우 무시 (순환 참조 방지)
      if (isChildOf(menu.id, item.id, menu)) {
        return;
      }

      // 드롭 위치에 따라 다른 동작 수행
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 상단 1/3에 드롭한 경우 - 대상 메뉴 위에 배치
      if (hoverClientY < hoverMiddleY / 2) {
        onMoveMenu(item.id, menu.id, "before");
      }
      // 하단 1/3에 드롭한 경우 - 대상 메뉴 아래에 배치
      else if (hoverClientY > hoverMiddleY * 1.5) {
        onMoveMenu(item.id, menu.id, "after");
      }
      // 중간에 드롭한 경우 - 대상 메뉴의 하위 메뉴로 배치
      else {
        onMoveMenu(item.id, menu.id, "inside");
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isOverCurrent: !!monitor.isOver({ shallow: true }),
    }),
  });

  // 특정 메뉴가 다른 메뉴의 하위 메뉴인지 확인하는 함수
  const isChildOf = (
    parentId: number,
    childId: number,
    menuItem: Menu
  ): boolean => {
    if (!menuItem.children || menuItem.children.length === 0) {
      return false;
    }

    return menuItem.children.some(
      (child) => child.id === childId || isChildOf(parentId, childId, child)
    );
  };

  // Connect drag and drop refs
  const dragDropRef = useRef<HTMLDivElement>(null);
  drag(dragDropRef);
  drop(dragDropRef);

  return (
    <div ref={dragDropRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Flex
        pl={`${level * 0.5}rem`}
        py={1.5}
        px={2}
        alignItems="center"
        cursor="pointer"
        bg={isOver ? dropBg : "transparent"}
        _hover={{
          bg: hoverBg,
          transform: "translateX(2px)",
          boxShadow: "sm",
          backdropFilter: "blur(4px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        transition="all 0.2s ease-out"
        borderRadius="md"
        onClick={() => onEditMenu(menu)}
        position="relative"
        role="group"
        mb={1}
      >
        <Box
          position="absolute"
          left="0"
          top="0"
          bottom="0"
          width="0"
          bg={indicatorColor}
          opacity={0}
          transition="all 0.3s ease"
          className="menu-indicator"
          _groupHover={{
            opacity: 0.5,
            width: "3px",
          }}
        />
        {isOver && (
          <Box
            position="absolute"
            left="0"
            right="0"
            height="2px"
            bg={indicatorColor}
            zIndex="1"
            boxShadow={`0 0 8px ${indicatorColor}`}
            transition="all 0.3s ease"
            opacity={0.8}
            _after={{
              content: '""',
              position: "absolute",
              top: "-1px",
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${indicatorColor}, transparent)`,
              opacity: 0.5,
            }}
          />
        )}
        <Flex width="100%" alignItems="center">
          <Box width="24px" mr={2} textAlign="center">
            {menu.children && menu.children.length > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                p={0}
                minW="auto"
                h="auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                transition="all 0.2s ease"
                _hover={{ color: arrowHoverColor }}
                color={arrowColor}
                borderRadius="full"
              >
                {expanded ? (
                  <FiChevronDown size={16} />
                ) : (
                  <FiChevronRight size={16} />
                )}
              </Button>
            ) : (
              <Flex
                width="24px"
                height="24px"
                alignItems="center"
                justifyContent="center"
              >
                <FiCircle
                  size={6}
                  color={leafColor}
                  style={{
                    opacity: 0.7,
                    transition: "all 0.2s ease",
                  }}
                  className="group-hover:opacity-100"
                />
              </Flex>
            )}
          </Box>
          <Flex
            flex="1"
            alignItems="center"
            borderLeft={level > 0 ? `1px solid ${borderColor}` : "none"}
            pl={level > 0 ? 3 : 0}
            ml={level > 0 ? 1 : 0}
            position="relative"
            minHeight="24px"
          >
            {level > 0 && (
              <Box
                position="absolute"
                left="-1px"
                top="-12px"
                width="1px"
                height="12px"
                bg={borderColor}
              />
            )}
            <Text
              color={!menu.visible ? disabledTextColor : textColor}
              transition="all 0.2s ease"
              _groupHover={{ fontWeight: "medium" }}
              fontSize={level === 0 ? "sm" : "xs"}
              fontWeight={level === 0 ? "medium" : "normal"}
              lineHeight="short"
            >
              {menu.name}
            </Text>
            {!menu.visible && (
              <Box
                ml={2}
                px={1.5}
                py={0.5}
                borderRadius="full"
                bg={useColorModeValue("gray.100", "gray.700")}
                fontSize="xs"
              >
                <Text fontSize="2xs" color={disabledTextColor}>
                  숨김
                </Text>
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

interface MenuListProps {
  onEditMenu: (menu: Menu) => void;
}

export function MenuList({ onEditMenu }: MenuListProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const bgColor = useColorModeValue("transparent", "transparent");
  const lineColor = useColorModeValue(
    "rgba(226, 232, 240, 0.7)",
    "rgba(74, 85, 104, 0.3)"
  );
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.5)",
    "rgba(74, 85, 104, 0.2)"
  );

  useEffect(() => {
    fetchMenus();
  }, []);

  // 메뉴 데이터 가져오기
  const fetchMenus = async () => {
    try {
      const response = await fetch("/api/menus");
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      toaster.error({
        title: "메뉴 로드 실패",
        description: "메뉴 데이터를 불러오는데 실패했습니다.",
        duration: 3000,
      });
    }
  };

  const toggleExpanded = (menuId: number) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  // 메뉴 이동 처리 함수
  const handleMoveMenu = async (
    draggedId: number,
    targetId: number,
    position: "inside" | "before" | "after"
  ) => {
    try {
      // 서버에 메뉴 이동 요청
      const response = await fetch(`/api/menus/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draggedId,
          targetId,
          position,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to move menu");
      }

      // 성공 시 메뉴 데이터 다시 불러오기
      fetchMenus();

      toaster.success({
        title: "메뉴 이동 완료",
        description: "메뉴가 성공적으로 이동되었습니다.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to move menu:", error);
      toaster.error({
        title: "메뉴 이동 실패",
        description: "메뉴 이동 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  // 메뉴 항목 렌더링 함수
  const renderMenuItems = (
    items: Menu[],
    level: number = 0,
    parentIndex: number = 0
  ) => {
    return items.map((menu, index) => (
      <Box key={menu.id} mb={level === 0 ? 2 : 0}>
        <MenuItem
          menu={menu}
          level={level}
          onEditMenu={onEditMenu}
          expanded={expandedMenus.has(menu.id)}
          onToggle={() => toggleExpanded(menu.id)}
          onMoveMenu={handleMoveMenu}
          index={parentIndex * 100 + index}
        />
        {expandedMenus.has(menu.id) &&
          menu.children &&
          menu.children.length > 0 && (
            <Box
              pl={level === 0 ? 4 : 2}
              ml={2}
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                left: "0",
                top: "0",
                bottom: "8px",
                width: "1px",
                bg: borderColor,
                opacity: 0.7,
              }}
            >
              {renderMenuItems(
                menu.children,
                level + 1,
                parentIndex * 100 + index
              )}
            </Box>
          )}
      </Box>
    ));
  };

  return (
    <Box
      borderRadius="md"
      overflow="hidden"
      bg={bgColor}
      boxShadow="none"
      position="relative"
      py={2}
    >
      {menus.length > 0 ? (
        <Box>{renderMenuItems(menus)}</Box>
      ) : (
        <Center p={4} color="gray.500">
          메뉴가 없습니다.
        </Center>
      )}
    </Box>
  );
}
