"use client";

import { Box, VStack, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

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

interface BoardPreviewProps {
  board: Board | null;
}

export function BoardPreview({ board }: BoardPreviewProps) {
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const emptyMessageColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );

  if (!board) {
    return (
      <Box p={4}>
        <Text color={emptyMessageColor}>게시판을 선택해주세요.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="md" color={textColor} mb={2}>
            {board.name}
          </Heading>
          <Flex gap={2} mb={2}>
            <Badge
              colorScheme={
                board.type === "NOTICE"
                  ? "red"
                  : board.type === "QNA"
                  ? "green"
                  : board.type === "GALLERY"
                  ? "purple"
                  : "blue"
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
          </Flex>
        </Box>

        <Box borderTopWidth="1px" borderColor="inherit" pt={4}>
          <Text fontSize="sm" fontWeight="medium" color={textColor} mb={1}>
            설명
          </Text>
          <Text color={textColor}>{board.description}</Text>
        </Box>

        <Box borderTopWidth="1px" borderColor="inherit" pt={4}>
          <Text fontSize="sm" fontWeight="medium" color={textColor} mb={1}>
            관리자
          </Text>
          <Text color={textColor}>ID: {board.managerId}</Text>
        </Box>

        <Box borderTopWidth="1px" borderColor="inherit" pt={4}>
          <Text fontSize="sm" fontWeight="medium" color={textColor} mb={1}>
            생성일
          </Text>
          <Text color={textColor}>
            {new Date(board.createdAt).toLocaleString()}
          </Text>
        </Box>

        <Box borderTopWidth="1px" borderColor="inherit" pt={4}>
          <Text fontSize="sm" fontWeight="medium" color={textColor} mb={1}>
            수정일
          </Text>
          <Text color={textColor}>
            {new Date(board.updatedAt).toLocaleString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
