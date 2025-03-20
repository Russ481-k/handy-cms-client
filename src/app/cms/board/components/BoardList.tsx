"use client";

import { Text, Box, Spinner, Center, Flex } from "@chakra-ui/react";

import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";
import { TreeItem } from "@/components/ui/tree-list";
import { LuInbox, LuLayoutList } from "react-icons/lu";
import { ListItem } from "@/components/ui/list-item";

export interface BoardListProps {
  menus: TreeItem[];
  onEditBoard: (board: TreeItem) => void;
  onDeleteBoard: (boardId: number) => void;
  isLoading: boolean;
  selectedBoardId?: number;
}

export function BoardList({
  menus,
  onEditBoard,
  onDeleteBoard,
  isLoading,
  selectedBoardId,
}: BoardListProps) {
  const colors = useColors();
  const emptyColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="full">
        <Spinner />
      </Flex>
    );
  }

  if (menus.length === 0) {
    return (
      <Center py={8} flexDirection="column" gap={2}>
        <LuInbox size={24} color={emptyColor} />
        <Text color={emptyColor}>등록된 게시판이 없습니다.</Text>
      </Center>
    );
  }

  return (
    <Box>
      {menus.map((menu) => (
        <ListItem
          key={menu.id}
          name={menu.name}
          icon={<LuLayoutList />}
          isSelected={menu.id === selectedBoardId}
          onEdit={() => onEditBoard(menu)}
          onDelete={() => onDeleteBoard(menu.id)}
          renderBadges={() => !menu.visible && "비활성"}
          onClick={() => onEditBoard(menu)}
        />
      ))}
    </Box>
  );
}
