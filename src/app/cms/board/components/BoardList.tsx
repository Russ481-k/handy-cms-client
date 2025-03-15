"use client";

import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "@/components/ui/color-mode";

interface Board {
  id: number;
  name: string;
  type: "GENERAL" | "GALLERY" | "QNA" | "NOTICE";
  description: string;
  managerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BoardListProps {
  onEditBoard: (board: Board) => void;
  onDeleteBoard: (board: Board) => void;
}

export function BoardList({ onEditBoard, onDeleteBoard }: BoardListProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const borderColor = useColorModeValue(colors.border, colors.border);

  const fetchBoards = async () => {
    try {
      const response = await fetch("/api/boards");
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
      toaster.error({
        title: "게시판 목록을 불러오는데 실패했습니다.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchBoards();
    };

    window.addEventListener("refreshBoardList", handleRefresh);
    return () => {
      window.removeEventListener("refreshBoardList", handleRefresh);
    };
  }, []);

  return (
    <VStack gap={4} align="stretch">
      {boards.map((board) => (
        <Box
          key={board.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          bg="transparent"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <HStack gap={2}>
              <Text fontSize="lg" fontWeight="medium" color={textColor}>
                {board.name}
              </Text>
              <Badge
                colorScheme={
                  board.type === "NOTICE"
                    ? "red"
                    : board.type === "QNA"
                    ? "blue"
                    : board.type === "GALLERY"
                    ? "green"
                    : "gray"
                }
              >
                {board.type === "NOTICE"
                  ? "공지사항"
                  : board.type === "QNA"
                  ? "Q&A"
                  : board.type === "GALLERY"
                  ? "갤러리"
                  : "일반"}
              </Badge>
              <Badge colorScheme={board.isActive ? "green" : "gray"}>
                {board.isActive ? "활성" : "비활성"}
              </Badge>
            </HStack>
            <HStack gap={2}>
              <IconButton
                aria-label="Edit board"
                size="sm"
                variant="ghost"
                onClick={() => onEditBoard(board)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuPencil />
              </IconButton>
              <IconButton
                aria-label="Delete board"
                size="sm"
                variant="ghost"
                onClick={() => onDeleteBoard(board)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuTrash />
              </IconButton>
            </HStack>
          </Flex>
          <Text fontSize="sm" color={textColor} mb={2}>
            {board.description}
          </Text>
          <Text fontSize="sm" color={textColor}>
            생성일: {new Date(board.createdAt).toLocaleString()}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
