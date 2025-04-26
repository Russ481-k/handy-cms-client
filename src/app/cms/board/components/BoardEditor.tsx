"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { Board } from "../types";
import { useColors } from "@/styles/theme";
import { CheckIcon } from "lucide-react";

interface BoardEditorProps {
  board: Board | null;
  onSubmit: (boardData: Omit<Board, "id" | "createdAt" | "updatedAt">) => void;
  isLoading: boolean;
}

export function BoardEditor({ board, onSubmit, isLoading }: BoardEditorProps) {
  const colors = useColors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<Board, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    type: "FREE",
    title: "",
    status: "ACTIVE",
    visible: true,
    sortOrder: 0,
    displayPosition: "MAIN",
    settings: {
      allowComments: true,
      allowFiles: true,
      useCategory: false,
      useTags: false,
      listType: "list",
      postsPerPage: 10,
      showTitle: true,
      showSearch: true,
      showPagination: true,
      showWriteButton: true,
      layout: "list",
    },
  });

  useEffect(() => {
    if (board) {
      setFormData({
        name: board.name,
        type: board.type,
        title: board.title,
        status: board.status,
        visible: board.visible,
        sortOrder: board.sortOrder,
        displayPosition: board.displayPosition,
        settings: board.settings,
      });
    } else {
      setFormData({
        name: "",
        type: "FREE",
        title: "",
        status: "ACTIVE",
        visible: true,
        sortOrder: 0,
        displayPosition: "MAIN",
        settings: {
          allowComments: true,
          allowFiles: true,
          useCategory: false,
          useTags: false,
          listType: "list",
          postsPerPage: 10,
          showTitle: true,
          showSearch: true,
          showPagination: true,
          showWriteButton: true,
          layout: "list",
        },
      });
    }
  }, [board]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text color={colors.text.secondary}>게시판을 선택하세요</Text>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Box>
          <Flex mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              이름
            </Text>
            <Text fontSize="sm" color="red.500" ml={1}>
              *
            </Text>
          </Flex>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="게시판 이름"
          />
        </Box>

        <Box>
          <Flex mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              유형
            </Text>
            <Text fontSize="sm" color="red.500" ml={1}>
              *
            </Text>
          </Flex>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "inherit",
            }}
          >
            <option value="NOTICE">공지사항</option>
            <option value="QNA">Q&A</option>
            <option value="FREE">자유게시판</option>
          </select>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            설명
          </Text>
          <Textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="게시판 설명"
            height="200px"
          />
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          loading={isLoading || isSubmitting}
          loadingText="저장 중..."
        >
          <Box display="flex" alignItems="center" gap={2}>
            {isSubmitting ? <Spinner size="sm" /> : <CheckIcon />}
            <Text>저장</Text>
          </Box>
        </Button>
      </VStack>
    </form>
  );
}
