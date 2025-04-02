"use client";

import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  FiCircle,
  FiX,
  FiLink,
  FiFolder,
  FiFolderPlus,
  FiFileText,
  FiFile,
  FiEdit2,
} from "react-icons/fi";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Spinner,
  Kbd,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { MenuItemProps, DragItem } from "../types";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";
import { Menu } from "../page";

export const MenuItem = ({
  menu,
  level,
  onEditMenu,
  expanded,
  onToggle,
  onMoveMenu,
  onDeleteMenu,
  index,
  selectedMenuId,
  refreshMenus,
}: MenuItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(menu.name);
  const [isSaving, setIsSaving] = useState(false);

  // 컬러 모드에 맞는 호버 색상 설정
  const hoverBg = useColorModeValue(
    "rgb(255, 255, 255)",
    "rgba(255, 255, 255, 0.01)"
  );
  const dropBg = useColorModeValue(
    "rgba(66, 153, 225, 0.12)",
    "rgba(99, 179, 237, 0.15)"
  );
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const menuBgColor = useColorModeValue("gray.100", "gray.700");
  const disabledTextColor = useColorModeValue("gray.400", "gray.500");
  const indicatorColor = useColorModeValue(
    colors.primary.default,
    colors.primary.light
  );
  const leafColor = useColorModeValue(
    "rgba(160, 174, 192, 0.6)",
    "rgba(160, 174, 192, 0.4)"
  );

  const selectedBg = useColorModeValue(
    "rgba(66, 153, 225, 0.08)",
    "rgba(99, 179, 237, 0.15)"
  );
  const selectedBorderColor = useColorModeValue(
    colors.primary.default,
    colors.primary.light
  );

  const [{ isDragging }, drag] = useDrag({
    type: "MENU_ITEM",
    item: { id: menu.id, index, level },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, dropPosition }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; dropPosition: DragItem | null }
  >({
    accept: "MENU_ITEM",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      dropPosition: monitor.getItem() as DragItem,
    }),
    drop: (item: DragItem, monitor) => {
      if (item.id === menu.id) return;

      const draggedLevel = item.level;
      const targetLevel = level;

      // Calculate the new level based on drag position
      let newLevel = targetLevel;
      if (draggedLevel < targetLevel) {
        // Moving deeper into the tree
        newLevel = targetLevel + 1;
      } else if (draggedLevel > targetLevel) {
        // Moving up in the tree
        newLevel = targetLevel;
      }

      // Determine the position based on the drag position
      let position: "before" | "after" | "inside" = "after";
      if (isOver) {
        const dragOffset = monitor.getClientOffset();
        if (dragOffset) {
          const rect = dragDropRef.current?.getBoundingClientRect();
          if (rect) {
            const threshold = rect.top + rect.height / 2;
            position = dragOffset.y < threshold ? "before" : "after";
          }
        }
      }

      onMoveMenu(item.id, menu.id, position);
    },
  });

  const isChildOf = (
    parentId: number,
    childId: number,
    menuItem: Menu
  ): boolean => {
    if (!menuItem.children || menuItem.children.length === 0) return false;
    return menuItem.children.some(
      (child: Menu) =>
        child.id === childId || isChildOf(parentId, childId, child)
    );
  };

  const dragDropRef = useRef<HTMLDivElement>(null);
  drag(drop(dragDropRef));

  const handleMenuClick = (e: React.MouseEvent) => {
    // 메뉴 아이콘 클릭 시 토글 동작
    if ((e.target as HTMLElement).closest(".menu-icon")) {
      e.stopPropagation();
      if (menu.children && menu.children.length > 0) {
        onToggle();
      }
      return;
    }

    // 액션 버튼 클릭 시 이벤트 전파 중단
    if ((e.target as HTMLElement).closest(".action-buttons")) {
      e.stopPropagation();
      return;
    }

    // 메뉴 편집 모드일 때는 이벤트 전파 중단
    if (isEditing) {
      e.stopPropagation();
      return;
    }

    // 메뉴 선택 및 편집기 표시
    e.preventDefault();
    e.stopPropagation();
    onEditMenu(menu);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = editedName.trim();
    if (newName && newName !== menu.name) {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/cms/menu/${menu.id}`, {
          method: "PUT",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...menu, name: newName }),
        });

        if (!response.ok) {
          throw new Error("Failed to update menu name");
        }

        const updatedMenu = await response.json();
        await onEditMenu(updatedMenu);
        await refreshMenus();
        setEditedName(newName);
        toaster.create({
          title: "메뉴 이름이 수정되었습니다.",
          type: "success",
        });
      } catch (error) {
        console.error("Failed to update menu name:", error);
        setEditedName(menu.name);
        toaster.create({
          title: "메뉴 이름 수정에 실패했습니다.",
          type: "error",
        });
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setEditedName(menu.name);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleNameSubmit(e);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      onDeleteMenu(menu.id);
      toaster.create({
        title: "메뉴가 삭제되었습니다.",
        type: "success",
      });
    }
  };

  const getMenuIcon = () => {
    const iconStyle = {
      color: leafColor,
      opacity: 0.7,
      transition: "all 0.2s ease",
    };

    switch (menu.type) {
      case "LINK":
        return <FiLink size={14} style={iconStyle} />;
      case "FOLDER":
        return expanded ? (
          <IconButton
            aria-label="Folder Plus"
            variant="ghost"
            size="2xs"
            colorScheme="gray"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiFolder size={14} style={{ ...iconStyle }} />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Folder"
            variant="ghost"
            size="2xs"
            colorScheme="gray"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiFolderPlus
              size={14}
              style={{ ...iconStyle, color: colors.primary.default }}
            />
          </IconButton>
        );
      case "BOARD":
        return <FiFileText size={14} style={iconStyle} />;
      case "CONTENT":
        return <FiFile size={14} style={iconStyle} />;
      default:
        return <FiCircle size={6} style={iconStyle} />;
    }
  };

  return (
    <div ref={dragDropRef}>
      <Flex
        pl={`${level * 0.5}rem`}
        py={1.5}
        px={2}
        alignItems="center"
        cursor="pointer"
        bg={
          isOver
            ? dropBg
            : selectedMenuId === menu.id
            ? selectedBg
            : "transparent"
        }
        borderLeft={selectedMenuId === menu.id ? "3px solid" : "none"}
        borderColor={
          selectedMenuId === menu.id ? selectedBorderColor : "transparent"
        }
        opacity={isDragging ? 0.5 : 1}
        transform={isDragging ? "scale(1.02)" : "none"}
        _hover={{
          bg: hoverBg,
          transform: "translateX(2px)",
          boxShadow: "sm",
          backdropFilter: "blur(4px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "& .menu-icon": {
            opacity: 1,
            transform: "scale(1.1)",
          },
          "& .action-buttons": {
            opacity: 1,
            transform: "translateX(0)",
          },
        }}
        transition="all 0.2s ease-out"
        borderRadius="md"
        onClick={handleMenuClick}
        position="relative"
        role="group"
        mb={1}
        mr={1}
      >
        {isOver && (
          <Box
            position="absolute"
            left="0"
            top="0"
            bottom="0"
            width="3px"
            bg={colors.primary.default}
            opacity={0.5}
            transition="all 0.2s ease"
          />
        )}
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
            <Flex
              width="24px"
              height="24px"
              alignItems="center"
              justifyContent="center"
              className="menu-icon"
              onClick={(e) => {
                e.stopPropagation();
                if (menu.children && menu.children.length > 0) {
                  onToggle();
                }
              }}
            >
              {getMenuIcon()}
            </Flex>
          </Box>
          <Flex
            flex="1"
            alignItems="center"
            pl={level > 0 ? 1 : 0}
            position="relative"
            minHeight="24px"
          >
            {isEditing ? (
              <form onSubmit={handleNameSubmit} style={{ width: "100%" }}>
                <Flex gap={1} alignItems="center">
                  <Input
                    value={editedName}
                    onChange={handleNameChange}
                    onKeyDown={handleNameKeyDown}
                    size="sm"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onBlur={handleNameSubmit}
                    borderColor={colors.primary.default}
                    _focus={{
                      borderColor: colors.primary.default,
                      boxShadow: `0 0 0 1px ${colors.primary.default}`,
                    }}
                    placeholder="Enter to save"
                  />
                  {isSaving ? (
                    <Spinner size="xs" color="blue.500" />
                  ) : (
                    <Kbd size="sm" color={colors.primary.default}>
                      Enter
                    </Kbd>
                  )}
                </Flex>
              </form>
            ) : (
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
            )}
            {!menu.visible && (
              <Box
                px={1.5}
                py={0.5}
                borderRadius="full"
                bg={menuBgColor}
                fontSize="xs"
                ml={2}
              >
                <Text fontSize="2xs" color={disabledTextColor}>
                  숨김
                </Text>
              </Box>
            )}
          </Flex>
          {menu.name !== "홈" && !isEditing && (
            <Flex
              className="action-buttons"
              opacity={0}
              transform="translateX(10px)"
              transition="all 0.2s ease"
              gap={1}
              ml={2}
            >
              <IconButton
                aria-label="Edit menu"
                size="xs"
                variant="ghost"
                onClick={handleEditClick}
                color="gray.500"
                _hover={{ color: "blue.500", bg: "blue.50" }}
                p={1}
                minW="auto"
                h="auto"
                borderRadius="full"
                className="action-button"
              >
                <FiEdit2 size={14} />
              </IconButton>
              <IconButton
                aria-label="Delete menu"
                size="xs"
                variant="ghost"
                onClick={handleDelete}
                color="gray.500"
                _hover={{ color: "red.500", bg: "red.50" }}
                p={1}
                minW="auto"
                h="auto"
                borderRadius="full"
              >
                <FiX size={14} />
              </IconButton>
            </Flex>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
