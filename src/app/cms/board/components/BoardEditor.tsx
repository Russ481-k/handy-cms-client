"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Text,
  Checkbox,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { LuCheck } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TreeItem } from "@/components/ui/tree-list";
import { toaster } from "@/components/ui/toaster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface BoardEditorProps {
  board?: TreeItem | null;
  onClose: () => void;
  onDelete?: (boardId: number) => void;
  onSubmit: (board: Omit<TreeItem, "id" | "createdAt" | "updatedAt">) => void;
}

const boardSchema = z.object({
  name: z.string().min(1, "게시판명을 입력해주세요."),
  url: z.string().min(1, "URL을 입력해주세요."),
  visible: z.boolean().default(true),
  type: z.literal("BOARD"),
});

type BoardFormData = z.infer<typeof boardSchema>;

export function BoardEditor({
  board,
  onClose,
  onDelete,
  onSubmit,
}: BoardEditorProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "",
      url: board?.url || "",
      visible: board?.visible ?? true,
      type: "BOARD",
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // board prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (board) {
      reset({
        name: board.name,
        url: board.url || "",
        visible: board.visible,
        type: "BOARD",
      });
    } else {
      reset({
        name: "",
        url: "",
        visible: true,
        type: "BOARD",
      });
    }
  }, [board, reset]);

  // 컬러 모드에 맞는 색상 설정
  const colors = useColors();
  const bgColor = useColorModeValue(colors.cardBg, colors.cardBg);
  const borderColor = useColorModeValue(colors.border, colors.border);
  const textColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const errorColor = useColorModeValue("red.500", "red.300");
  const buttonBg = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete && board) {
      onDelete(board.id);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleFormSubmit = async (data: BoardFormData) => {
    try {
      const submitData = {
        ...data,
        sortOrder: board?.sortOrder || 0,
        displayPosition: board?.displayPosition || "TOP",
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving board:", error);
      toaster.error({
        title: "게시판 저장 중 오류가 발생했습니다.",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack gap={3} align="stretch">
            <Box>
              <Flex mb={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  게시판명
                </Text>
                <Text fontSize="sm" color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    borderColor={errors.name ? errorColor : borderColor}
                    color={textColor}
                    bg="transparent"
                  />
                )}
              />
              {errors.name && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.name.message}
                </Text>
              )}
            </Box>

            <Box>
              <Flex mb={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  URL
                </Text>
                <Text fontSize="sm" color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    borderColor={errors.url ? errorColor : borderColor}
                    color={textColor}
                    bg="transparent"
                  />
                )}
              />
              {errors.url && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.url.message}
                </Text>
              )}
            </Box>

            <Flex alignItems="center" gap={2}>
              <Controller
                name="visible"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control
                      borderColor={borderColor}
                      bg={bgColor}
                      _checked={{
                        borderColor: "transparent",
                        bgGradient: colors.gradient.primary,
                        color: "white",
                        _hover: {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>
                      <Text fontWeight="medium" color={textColor}>
                        게시판 노출
                      </Text>
                    </Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
            </Flex>

            <Flex justify="space-between" mt={4}>
              {board && (
                <Button
                  borderColor={colors.accent.delete.default}
                  color={colors.accent.delete.default}
                  onClick={handleDelete}
                  variant="outline"
                  _hover={{
                    bg: colors.accent.delete.bg,
                    borderColor: colors.accent.delete.hover,
                    color: colors.accent.delete.hover,
                    transform: "translateY(-1px)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s ease"
                >
                  삭제
                </Button>
              )}
              <Flex gap={2}>
                <Button
                  borderColor={borderColor}
                  color={textColor}
                  onClick={onClose}
                  variant="outline"
                  _hover={{ bg: colors.secondary.hover }}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: colors.primary.hover }}
                >
                  저장
                </Button>
              </Flex>
            </Flex>
          </VStack>
        </form>
      </Box>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="게시판 삭제"
        description="정말로 이 게시판을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
    </>
  );
}
