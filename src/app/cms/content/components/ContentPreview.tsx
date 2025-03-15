"use client";

import { Box, VStack, Text, Badge, Flex, Heading } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

interface Content {
  id: number;
  title: string;
  type: "PAGE" | "POST" | "NOTICE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  body?: string;
}

interface ContentPreviewProps {
  content: Content | null;
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const colors = useColors();
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const borderColor = useColorModeValue(colors.border, colors.border);
  const emptyMessageColor = useColorModeValue(
    colors.text.secondary,
    colors.text.secondary
  );

  if (!content) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        bg="transparent"
      >
        <Text color={emptyMessageColor}>컨텐츠를 선택해주세요.</Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      bg="transparent"
    >
      <VStack gap={4} align="stretch">
        <Box>
          <Heading size="md" color={textColor} mb={2}>
            {content.title}
          </Heading>
          <Flex gap={2}>
            <Badge colorScheme="blue">{content.type}</Badge>
            <Badge
              colorScheme={
                content.status === "PUBLISHED"
                  ? "green"
                  : content.status === "DRAFT"
                  ? "yellow"
                  : "gray"
              }
            >
              {content.status}
            </Badge>
          </Flex>
        </Box>

        <Box borderTopWidth="1px" borderColor={borderColor} pt={4}>
          <Text fontSize="sm" color={textColor} mb={1}>
            작성자: {content.author}
          </Text>
          <Text fontSize="sm" color={textColor} mb={1}>
            생성일: {new Date(content.createdAt).toLocaleString()}
          </Text>
          <Text fontSize="sm" color={textColor} mb={1}>
            수정일: {new Date(content.updatedAt).toLocaleString()}
          </Text>
          {content.publishedAt && (
            <Text fontSize="sm" color={textColor}>
              발행일: {new Date(content.publishedAt).toLocaleString()}
            </Text>
          )}
        </Box>

        {content.body && (
          <Box borderTopWidth="1px" borderColor={borderColor} pt={4}>
            <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
              {content.body}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
