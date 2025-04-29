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
  Spinner,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { LuCheck } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getToken } from "@/lib/auth-utils";
import { toaster } from "@/components/ui/toaster";
import { CheckIcon, DeleteIcon, PlusIcon } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CustomSelect } from "@/components/CustomSelect";
import { useQuery } from "@tanstack/react-query";
import { Template } from "@/types/api";

interface TemplateEditorProps {
  template: Template | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSubmit: (data: Omit<Template, "id" | "createdAt" | "updatedAt">) => void;
  parentId?: number | null;
  onAddTemplate?: () => void;
  existingTemplates: Template[];
  isTempTemplate?: boolean;
  tempTemplate?: Template | null;
  isDeleting?: boolean;
}

// 메뉴 스키마 정의
const createTemplateSchema = (
  currentTemplate: Template | null,
  existingTemplates: Template[]
) =>
  z
    .object({
      name: z.string().min(1, "메뉴 이름을 입력해주세요."),
      type: z.enum(["LINK", "FOLDER", "BOARD", "CONTENT"]),
      url: z.string().optional(),
      targetId: z.number().optional(),
      displayPosition: z.enum(["HEADER", "FOOTER"]),
      visible: z.boolean(),
      sortOrder: z.number(),
      parentId: z.number().nullable(),
    })
    .refine(
      (data) => {
        // LINK 타입일 때는 url이 필수
        if (data.type === "LINK") {
          return data.url && data.url.trim().length > 0;
        }
        return true;
      },
      {
        message: "링크 타입의 메뉴는 URL을 입력해야 합니다.",
        path: ["url"],
      }
    )
    .refine(
      (data) => {
        // LINK 타입일 때는 url이 중복되지 않아야 함
        if (data.type === "LINK" && data.url) {
          const isDuplicate = existingTemplates.some(
            (template) =>
              template.url === data.url && template.id !== currentTemplate?.id
          );
          return !isDuplicate;
        }
        return true;
      },
      {
        message: "이미 사용 중인 URL입니다.",
        path: ["url"],
      }
    );

type TemplateFormData = z.infer<ReturnType<typeof createTemplateSchema>>;

interface BoardResponse {
  id: number;
  name: string;
  slug: string;
  type: string;
  useCategory: boolean;
  allowComment: boolean;
  useAttachment: boolean;
  postsPerPage: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentResponse {
  id: number;
  name: string;
  title: string;
  slug: string;
  status: string;
  authorId: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function TemplateEditor({
  template,
  onClose,
  onDelete,
  onSubmit,
  parentId,
  onAddTemplate,
  existingTemplates,
  isTempTemplate,
  isDeleting,
}: TemplateEditorProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localIsDeleting, setLocalIsDeleting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(createTemplateSchema(template, existingTemplates)),
    defaultValues: {
      name: template?.name || "",
      type: template?.type || "LINK",
      url: template?.url || "",
      targetId: template?.targetId || undefined,
      displayPosition:
        template?.displayPosition === "FOOTER" ? "FOOTER" : "HEADER",
      visible: template?.visible ?? true,
      sortOrder: template?.sortOrder || 1,
      parentId: template?.parentId || null,
    },
  });

  const templateType = watch("type");

  // template prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        type: template.type,
        url: template.url || "",
        targetId: template.targetId || undefined,
        displayPosition: template.displayPosition,
        visible: template.visible,
        sortOrder: template.sortOrder,
        parentId: template.parentId || null,
      });
    } else {
      reset({
        name: "",
        type: "LINK",
        url: "",
        targetId: undefined,
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 1,
        parentId: parentId || null,
      });
    }
  }, [template, reset, parentId]);

  // 새 메뉴가 생성되면 이름 입력 필드에 포커스
  useEffect(() => {
    if (template && isTempTemplate) {
      // 약간의 지연을 두어 DOM이 업데이트된 후에 포커스
      setTimeout(() => {
        const nameInput = document.querySelector(
          'input[name="name"]'
        ) as HTMLInputElement;
        if (nameInput) {
          nameInput.focus();
          // 커서를 입력 필드 끝으로 이동
          nameInput.setSelectionRange(
            nameInput.value.length,
            nameInput.value.length
          );
        }
      }, 100);
    }
  }, [template, isTempTemplate]);

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

  // 셀렉트 박스 스타일
  const selectStyle = {
    width: "100%",
    padding: "0.5rem",
    paddingRight: "2rem",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    borderColor: "inherit",
    backgroundColor: "transparent",
    fontSize: "14px",
  };

  // React Query를 사용하여 데이터 페칭
  const { data: boardsData } = useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetch("/api/board", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch boards");
      const data = await response.json();
      return data.map((board: BoardResponse) => ({
        id: board.id,
        name: board.name,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    enabled: templateType === "BOARD", // BOARD 타입일 때만 데이터 가져오기
  });

  const { data: contentsData } = useQuery({
    queryKey: ["contents"],
    queryFn: async () => {
      const response = await fetch("/api/content", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch contents");
      const data = await response.json();
      return data.map((content: ContentResponse) => ({
        id: content.id,
        name: content.name,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    enabled: templateType === "CONTENT", // CONTENT 타입일 때만 데이터 가져오기
  });

  const handleDelete = async () => {
    if (!template || !onDelete) return;
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!template || !onDelete) return;
    setIsDeleteDialogOpen(false);
    try {
      setLocalIsDeleting(true);
      await onDelete(template.id);
      onClose();
    } finally {
      setLocalIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleFormSubmit: SubmitHandler<TemplateFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      // LINK 타입일 때는 url이 필수
      if (data.type === "LINK" && !data.url?.trim()) {
        toaster.error({
          title: "URL을 입력해주세요.",
          duration: 3000,
        });
        return;
      }

      // 폼 데이터를 서버에 전송
      await onSubmit({
        ...data,
        parentId: data.parentId || undefined,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toaster.error({
        title: "메뉴 저장에 실패했습니다.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
                  메뉴명
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
                    disabled={template?.id === -1}
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
                  메뉴 유형
                </Text>
                <Text fontSize="sm" color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="custom-select"
                    style={{
                      ...selectStyle,
                      borderColor: errors.type
                        ? "var(--chakra-colors-red-500)"
                        : "inherit",
                    }}
                    disabled={template?.id === -1}
                  >
                    <option value="LINK">링크</option>
                    <option value="FOLDER">폴더</option>
                    <option value="BOARD">게시판</option>
                    <option value="CONTENT">컨텐츠</option>
                  </select>
                )}
              />
            </Box>

            {templateType === "BOARD" && (
              <Box>
                <Flex mb={1}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    게시판
                  </Text>
                  <Text fontSize="sm" color={errorColor} ml={1}>
                    *
                  </Text>
                </Flex>
                <Controller
                  name="targetId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      field={field as any}
                      errors={errors}
                      template={template}
                      options={boardsData || []}
                      selectStyle={selectStyle}
                      placeholder="게시판 선택"
                    />
                  )}
                />
              </Box>
            )}

            {templateType === "CONTENT" && (
              <Box>
                <Flex mb={1}>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    컨텐츠
                  </Text>
                  <Text fontSize="sm" color={errorColor} ml={1}>
                    *
                  </Text>
                </Flex>
                <Controller
                  name="targetId"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      field={field as any}
                      errors={errors}
                      template={template}
                      options={contentsData || []}
                      selectStyle={selectStyle}
                      placeholder="컨텐츠 선택"
                    />
                  )}
                />
              </Box>
            )}

            {templateType === "LINK" && (
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
                      disabled={template?.id === -1}
                    />
                  )}
                />
                {errors.url && (
                  <Text color={errorColor} fontSize="sm" mt={1}>
                    {errors.url.message}
                  </Text>
                )}
              </Box>
            )}
            <Flex alignItems="center">
              <Controller
                name="visible"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                    disabled={template?.id === -1}
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
                        메뉴 노출
                      </Text>
                    </Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
            </Flex>

            <Flex justify="space-between" gap={2} mt={4}>
              {template && template.name !== "홈" ? (
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
                  disabled={
                    template?.id === -1 ||
                    isDeleting ||
                    localIsDeleting ||
                    isSubmitting
                  }
                >
                  <Box display="flex" alignItems="center" gap={2} w={4}>
                    {isDeleting || localIsDeleting ? (
                      <Spinner size="sm" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </Box>
                  <Text>삭제</Text>
                </Button>
              ) : (
                <Box />
              )}
              <Flex gap={2}>
                {!isTempTemplate && (
                  <Button
                    onClick={onAddTemplate}
                    variant="outline"
                    colorScheme="blue"
                  >
                    <PlusIcon /> 메뉴
                  </Button>
                )}
                <Button
                  type="submit"
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: colors.primary.hover }}
                  disabled={
                    template?.id === -1 ||
                    isDeleting ||
                    localIsDeleting ||
                    isSubmitting
                  }
                >
                  <Box display="flex" alignItems="center" gap={2} w={4}>
                    {isSubmitting ? <Spinner size="sm" /> : <CheckIcon />}
                  </Box>
                  <Text>저장</Text>
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
        title="메뉴 삭제"
        description="정말로 이 메뉴를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
    </>
  );
}
