"use client";

import React from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Stack,
  Spinner,
  Badge,
  IconButton,
  HStack,
  Card,
  Separator,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { Post } from "@/types/api";
import { LuTrash2, LuEye, LuPencil } from "react-icons/lu";

interface PostListProps {
  bbsId: number;
  posts: Post[];
  onAddPost: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (nttId: number) => void;
  onViewPost: (nttId: number) => void;
  isLoading: boolean;
  loadingNttId: number | null;
}

export function PostList({
  bbsId,
  posts,
  onAddPost,
  onEditPost,
  onDeletePost,
  onViewPost,
  isLoading,
  loadingNttId,
}: PostListProps) {
  const colors = useColors();

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" color={colors.primary.default} />
      </Box>
    );
  }

  return (
    <VStack gap={4} align="stretch" p={4}>
      <Stack direction="row" justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold" color={colors.text.primary}>
          게시글 목록
        </Text>
        <Button
          onClick={onAddPost}
          colorPalette="primary"
          size="sm"
        >
          새 게시글 작성
        </Button>
      </Stack>

      {posts.length === 0 ? (
        <Box
          p={8}
          textAlign="center"
          bg={colors.bg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <Text color={colors.text.secondary}>
            등록된 게시글이 없습니다.
          </Text>
        </Box>
      ) : (
        <VStack gap={4} align="stretch">
          {posts.map((post) => (
            <Card.Root
              key={post.nttId}
              variant="outline"
              cursor="pointer"
              onClick={() => onViewPost(post.nttId)}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              transition="all 0.2s"
            >
              <Card.Header>
                <Stack direction="row" justify="space-between" align="center">
                  <HStack>
                    <Text fontSize="lg" fontWeight="bold" maxLines={1}>
                      {post.title}
                    </Text>
                    {post.noticeState === 'Y' && (
                      <Badge colorPalette="primary">공지</Badge>
                    )}
                    {post.parentNttId && (
                      <Badge colorPalette="blue">답변</Badge>
                    )}
                  </HStack>
                  <HStack>
                    <IconButton
                      aria-label="View post"
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPost(post.nttId);
                      }}
                    >
                      <LuEye />
                    </IconButton>
                    <IconButton
                      aria-label="Edit post"
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPost(post);
                      }}
                    >
                      <LuPencil />
                    </IconButton>
                    <IconButton
                      aria-label="Delete post"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePost(post.nttId);
                      }}
                      disabled={loadingNttId !== null}
                    >
                      {loadingNttId === post.nttId ? <Spinner size="sm" /> : <LuTrash2 />}
                    </IconButton>
                  </HStack>
                </Stack>
              </Card.Header>
              <Separator />
              <Card.Body>
                <Stack gap={2}>
                  <Text fontSize="sm" color={colors.text.secondary}>
                    작성자: {post.writer}
                  </Text>
                  <Text fontSize="sm" color={colors.text.secondary}>
                    게시일: {new Date(post.publishStartDt).toLocaleDateString()}
                  </Text>
                  <Text fontSize="sm" color={colors.text.secondary}>
                    조회수: {post.hits}
                  </Text>
                  {post.categories && post.categories.length > 0 && (
                    <HStack>
                      {post.categories.map((category) => (
                        <Badge key={category} colorPalette="primary">
                          {category}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      )}
    </VStack>
  );
} 