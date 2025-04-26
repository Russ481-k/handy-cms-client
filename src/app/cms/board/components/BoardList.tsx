"use client";

import React from "react";
import { Box, VStack, Text, Button, Stack, Spinner } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { Board } from "../types";

interface BoardListProps {
  boards: Board[];
  onAddBoard: () => void;
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (boardId: number) => void;
  isLoading: boolean;
  selectedBoardId?: number;
  loadingBoardId: number | null;
}

export function BoardList({
  boards,
  onAddBoard,
  onEditBoard,
  onDeleteBoard,
  isLoading,
  selectedBoardId,
  loadingBoardId,
}: BoardListProps) {
  const colors = useColors();
  const bg = colors.bg;
  const hoverBg = colors.primary.light;
  const textColor = colors.text.primary;

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" color={colors.primary.default} />
      </Box>
    );
  }

  return (
    <VStack gap={2} align="stretch" p={4}>
      <Stack direction="row" justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          게시판 목록
        </Text>
        <Button
          onClick={onAddBoard}
          size="sm"
          colorScheme="primary"
          variant="ghost"
        >
          추가
        </Button>
      </Stack>

      {boards.length === 0 ? (
        <Text color={colors.text.secondary} textAlign="center" py={4}>
          등록된 게시판이 없습니다.
        </Text>
      ) : (
        boards.map((board) => (
          <Stack
            key={board.id}
            direction="row"
            p={3}
            borderRadius="md"
            bg={selectedBoardId === board.id ? hoverBg : bg}
            _hover={{ bg: hoverBg }}
            cursor="pointer"
            onClick={() => onEditBoard(board)}
            justify="space-between"
          >
            <Text color={textColor}>{board.name}</Text>
            <Stack direction="row">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBoard(board);
                }}
              >
                편집
              </Button>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBoard(board.id);
                }}
                disabled={loadingBoardId !== null}
              >
                {loadingBoardId === board.id ? <Spinner size="sm" /> : "삭제"}
              </Button>
            </Stack>
          </Stack>
        ))
      )}
    </VStack>
  );
}
