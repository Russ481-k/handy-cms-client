"use client";

import { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiChevronRight, FiChevronDown, FiMenu } from "react-icons/fi";
import { Box, Flex, Text, Button, Center, Icon } from "@chakra-ui/react";
import { Menu } from "@/app/cms/menu/page";

interface MenuItemProps {
  menu: Menu;
  level: number;
  onEditMenu: (menu: Menu) => void;
  expanded: boolean;
  onToggle: () => void;
}

const MenuItem = ({
  menu,
  level,
  onEditMenu,
  expanded,
  onToggle,
}: MenuItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "MENU_ITEM",
    item: { id: menu.id, type: menu.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "MENU_ITEM",
    drop: (item: { id: number }) => {
      // Handle drop logic here
      console.log(`Dropped menu ${item.id} onto menu ${menu.id}`);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Flex
        pl={`${level * 1.5}rem`}
        py={2}
        px={2}
        alignItems="center"
        cursor="pointer"
        bg={isOver ? "blue.50" : "transparent"}
        _hover={{ bg: "gray.100" }}
        onClick={() => onEditMenu(menu)}
      >
        {menu.children && menu.children.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            p={1}
            minW="auto"
            h="auto"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <Icon size="sm">
              {expanded ? <FiChevronDown /> : <FiChevronRight />}
            </Icon>
          </Button>
        )}
        <Icon mr={2}>
          <FiMenu />
        </Icon>
        <Text color={!menu.visible ? "gray.400" : "inherit"}>{menu.name}</Text>
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

  useEffect(() => {
    // Fetch menus from API
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menus");
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };

    fetchMenus();
  }, []);

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

  const renderMenuItems = (items: Menu[], level: number = 0) => {
    return items.map((menu) => (
      <Box key={menu.id}>
        <MenuItem
          menu={menu}
          level={level}
          onEditMenu={onEditMenu}
          expanded={expandedMenus.has(menu.id)}
          onToggle={() => toggleExpanded(menu.id)}
        />
        {expandedMenus.has(menu.id) &&
          menu.children &&
          menu.children.length > 0 && (
            <Box>{renderMenuItems(menu.children, level + 1)}</Box>
          )}
      </Box>
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
      >
        {menus.length > 0 ? (
          renderMenuItems(menus)
        ) : (
          <Center p={4} color="gray.500">
            메뉴가 없습니다.
          </Center>
        )}
      </Box>
    </DndProvider>
  );
}
