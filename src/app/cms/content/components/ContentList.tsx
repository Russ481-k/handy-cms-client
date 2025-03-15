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

interface Content {
  id: number;
  title: string;
  type: "PAGE" | "POST" | "NOTICE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface ContentListProps {
  onEditContent: (content: Content) => void;
  onDeleteContent: (content: Content) => void;
}

export function ContentList({
  onEditContent,
  onDeleteContent,
}: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const borderColor = useColorModeValue(colors.border, colors.border);

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/content");
      if (!response.ok) {
        throw new Error("Failed to fetch contents");
      }
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error fetching contents:", error);
      toaster.error({
        title: "컨텐츠 목록을 불러오는데 실패했습니다.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchContents();
    };

    window.addEventListener("refreshContentList", handleRefresh);
    return () => {
      window.removeEventListener("refreshContentList", handleRefresh);
    };
  }, []);

  return (
    <VStack gap={4} align="stretch">
      {contents.map((content) => (
        <Box
          key={content.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          bg="transparent"
        >
          <Flex justify="space-between" align="center" mb={2}>
            <HStack gap={2}>
              <Text fontSize="lg" fontWeight="medium" color={textColor}>
                {content.title}
              </Text>
              <Badge
                colorScheme={
                  content.type === "NOTICE"
                    ? "red"
                    : content.type === "POST"
                    ? "blue"
                    : "green"
                }
              >
                {content.type === "NOTICE"
                  ? "공지사항"
                  : content.type === "POST"
                  ? "게시글"
                  : "페이지"}
              </Badge>
              <Badge
                colorScheme={
                  content.status === "PUBLISHED"
                    ? "green"
                    : content.status === "DRAFT"
                    ? "yellow"
                    : "gray"
                }
              >
                {content.status === "PUBLISHED"
                  ? "발행"
                  : content.status === "DRAFT"
                  ? "임시저장"
                  : "보관"}
              </Badge>
            </HStack>
            <HStack gap={2}>
              <IconButton
                aria-label="Edit content"
                size="sm"
                variant="ghost"
                onClick={() => onEditContent(content)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuPencil />
              </IconButton>
              <IconButton
                aria-label="Delete content"
                size="sm"
                variant="ghost"
                onClick={() => onDeleteContent(content)}
                color={textColor}
                _hover={{ bg: colors.secondary.hover }}
              >
                <LuTrash />
              </IconButton>
            </HStack>
          </Flex>
          <HStack gap={4} mb={2}>
            <Text fontSize="sm" color={textColor}>
              작성자: {content.author}
            </Text>
            <Text fontSize="sm" color={textColor}>
              작성일: {new Date(content.createdAt).toLocaleString()}
            </Text>
            {content.publishedAt && (
              <Text fontSize="sm" color={textColor}>
                발행일: {new Date(content.publishedAt).toLocaleString()}
              </Text>
            )}
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
