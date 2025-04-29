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
import { toaster } from "@/components/ui/toaster";
import { CheckIcon, PlusIcon } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Template, TemplateVersion } from "@/types/api";
import { FiTrash2 } from "react-icons/fi";

interface TemplateEditorProps {
  template: Template | null;
  onClose: () => void;
  onDelete: (id: number) => void;
  onSubmit: (data: TemplateFormData) => void;
  onAddTemplate?: () => void;
  existingTemplates: Template[];
  isTempTemplate?: boolean;
}

// 템플릿 스키마 정의
const createTemplateSchema = (
  currentTemplate: Template | null,
  existingTemplates: Template[]
) =>
  z.object({
    templateName: z.string().min(1, "템플릿 이름을 입력해주세요."),
    type: z.enum(["MAIN", "SUB"]),
    description: z.string().nullable(),
    published: z.boolean(),
    displayPosition: z.enum(["HEADER", "FOOTER"]),
    visible: z.boolean(),
    sortOrder: z.number(),
    versions: z
      .array(
        z.object({
          versionId: z.number(),
          templateId: z.number(),
          versionNo: z.number(),
          layout: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              type: z.string(),
              x: z.number(),
              y: z.number(),
              width: z.number(),
              height: z.number(),
              widget: z
                .object({
                  type: z.string(),
                  config: z.record(z.unknown()).optional(),
                })
                .optional(),
            })
          ),
          updater: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
  });

type TemplateFormData = {
  templateName: string;
  type: "MAIN" | "SUB";
  description: string | null;
  published: boolean;
  versions?: TemplateVersion[];
  displayPosition: "HEADER" | "FOOTER";
  visible: boolean;
  sortOrder: number;
};

export function TemplateEditor({
  template,
  onClose,
  onDelete,
  onSubmit,
  onAddTemplate,
  existingTemplates,
  isTempTemplate,
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
  } = useForm<z.infer<ReturnType<typeof createTemplateSchema>>>({
    resolver: zodResolver(createTemplateSchema(template, existingTemplates)),
    defaultValues: {
      templateName: template?.templateName || "",
      type: template?.type || "MAIN",
      description: template?.description || null,
      published: template?.published ?? true,
      versions: template?.versions || [],
      displayPosition: template?.displayPosition || "HEADER",
      visible: template?.visible ?? true,
      sortOrder: template?.sortOrder || 0,
    },
  });

  const templateType = watch("type");

  // template prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (template) {
      reset({
        templateName: template.templateName,
        type: template.type,
        description: template.description,
        published: template.published,
        versions: template.versions || [],
        displayPosition: template.displayPosition || "HEADER",
        visible: template.visible ?? true,
        sortOrder: template.sortOrder || 0,
      });
    } else {
      reset({
        templateName: "",
        type: "MAIN",
        description: null,
        published: true,
        versions: [],
        displayPosition: "HEADER",
        visible: true,
        sortOrder: 0,
      });
    }
  }, [template, reset]);

  // 새 메뉴가 생성되면 이름 입력 필드에 포커스
  useEffect(() => {
    if (template && isTempTemplate) {
      // 약간의 지연을 두어 DOM이 업데이트된 후에 포커스
      setTimeout(() => {
        const nameInput = document.querySelector(
          'input[name="templateName"]'
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
      await onSubmit(data);
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

  const isDefaultTemplate = template?.id === 1; // 기본 메인 템플릿 ID가 1이라고 가정

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack gap={3} align="stretch">
            <Box>
              <Flex mb={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  템플릿 이름
                </Text>
                <Text fontSize="sm" color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Controller
                name="templateName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    borderColor={errors.templateName ? errorColor : borderColor}
                    color={textColor}
                    bg="transparent"
                    disabled={isDefaultTemplate}
                  />
                )}
              />
              {errors.templateName && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.templateName.message}
                </Text>
              )}
            </Box>

            <Box>
              <Flex mb={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  템플릿 유형
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
                    disabled={isDefaultTemplate}
                  >
                    <option value="MAIN">메인 템플릿</option>
                    <option value="SUB">서브 템플릿</option>
                  </select>
                )}
              />
            </Box>

            <Box>
              <Flex mb={1}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                  설명
                </Text>
              </Flex>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    borderColor={errors.description ? errorColor : borderColor}
                    color={textColor}
                    bg="transparent"
                    disabled={isDefaultTemplate}
                  />
                )}
              />
            </Box>

            <Flex alignItems="center">
              <Controller
                name="published"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                    disabled={isDefaultTemplate}
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
                        공개
                      </Text>
                    </Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
            </Flex>

            <Flex justify="space-between" gap={2} mt={4}>
              {template && !isDefaultTemplate ? (
                <Button
                  colorScheme="red"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={isDefaultTemplate}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <FiTrash2 />
                    <Text>삭제</Text>
                  </Box>
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
                    <PlusIcon /> 템플릿
                  </Button>
                )}
                <Button
                  type="submit"
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: colors.primary.hover }}
                  disabled={isDefaultTemplate || isSubmitting}
                >
                  <Box display="flex" alignItems="center" gap={2}>
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
