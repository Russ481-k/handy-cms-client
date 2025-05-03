"use client";

import {
  Box,
  VStack,
  Text,
  HStack,
  Badge,
  Separator,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { Post } from "@/types/api";
import { LuFolderGit2, LuTrash2 } from "react-icons/lu";

interface PostDetailProps {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onReply?: () => void;
}

export function PostDetail({ post, onEdit, onDelete, onReply }: PostDetailProps) {
  const colors = useColors();
  const textColor = colors.text.primary;
  const secondaryTextColor = colors.text.secondary;

  return (
    <Box p={4}>
      <VStack align="stretch" gap={4}>
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {post.title}
            </Text>
            <HStack>
              <IconButton
                aria-label="Edit post"
                size="sm"
                variant="ghost"
                onClick={onEdit}
             >
                <LuFolderGit2 />
             </IconButton>
              <IconButton
                aria-label="Delete post"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={onDelete}
              >
                <LuTrash2 />
              </IconButton>
            </HStack>
          </HStack>

          <HStack gap={4} color={secondaryTextColor} fontSize="sm">
            <Text>작성자: {post.writer}</Text>
            <Text>
              작성일: {new Date(post.createdAt).toLocaleString()}
            </Text>
            {post.publishStartDt && (
              <Text>
                게시일: {new Date(post.publishStartDt).toLocaleString()}
              </Text>
            )}
          </HStack>

          {post.categories && post.categories.length > 0 && (
            <HStack mt={2} gap={2}>
              {post.categories.map((category) => (
                <Badge key={category} colorScheme="blue">
                  {category}
                </Badge>
              ))}
            </HStack>
          )}
        </Box>

        <Separator />

        <Box
          dangerouslySetInnerHTML={{ __html: post.content }}
          color={textColor}
        />

        {post.attachments && post.attachments.length > 0 && (
          <Box>
            <Text fontWeight="bold" mb={2}>
              첨부파일
            </Text>
            <VStack align="stretch">
              {post.attachments.map((attachment) => (
                <Button
                  key={attachment.id}
                  variant="ghost"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() => window.open(attachment.downloadUrl, '_blank')}
                >
                  {attachment.fileName} ({Math.round(attachment.fileSize / 1024)} KB)
                </Button>
              ))}
            </VStack>
          </Box>
        )}

        {onReply && (
          <Box>
            <Button
              colorPalette="primary"
              variant="outline"
              onClick={onReply}
            >
              답변 작성
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
} 