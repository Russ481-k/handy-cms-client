"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Text,
  Checkbox,
  NativeSelect,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { LuCheck } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Menu } from "../page";
import { getAuthHeader } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";

interface MenuEditorProps {
  menu?: Menu | null;
  onClose: () => void;
  onDelete?: (menuId: number) => void;
  onSubmit: (menu: Omit<Menu, "id" | "createdAt" | "updatedAt">) => void;
  parentId?: number | null;
}

const menuSchema = z
  .object({
    name: z.string().min(1, "메뉴명을 입력해주세요."),
    type: z.enum(["LINK", "FOLDER", "BOARD", "CONTENT"]),
    url: z.string().optional(),
    targetId: z.string().optional(),
    displayPosition: z.string().min(1, "출력 위치를 선택해주세요."),
    visible: z.boolean().default(true),
    parentId: z.string().optional(),
    sortOrder: z.number().default(0),
  })
  .refine(
    (data) => {
      if (data.type === "LINK") {
        return !!data.url;
      }
      if (data.type === "BOARD" || data.type === "CONTENT") {
        return !!data.targetId;
      }
      return true;
    },
    {
      message: "필수 항목을 입력해주세요.",
      path: ["url", "targetId"],
    }
  );

type MenuFormData = z.infer<typeof menuSchema>;

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

export function MenuEditor({
  menu,
  onClose,
  onDelete,
  onSubmit,
  parentId,
}: MenuEditorProps) {
  const [boards, setBoards] = useState<Array<{ id: number; name: string }>>([]);
  const [contents, setContents] = useState<Array<{ id: number; name: string }>>(
    []
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu?.name || "",
      type: menu?.type || "LINK",
      url: menu?.url || "",
      targetId: menu?.targetId?.toString() || "",
      displayPosition: menu?.displayPosition || "HEADER",
      visible: menu?.visible ?? true,
      parentId: menu?.parentId?.toString() || parentId?.toString() || "",
      sortOrder: menu?.sortOrder || 0,
    },
  });

  const menuType = watch("type");

  // menu prop이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (menu) {
      reset({
        name: menu.name,
        type: menu.type,
        url: menu.url || "",
        targetId: menu.targetId?.toString() || "",
        displayPosition: menu.displayPosition,
        visible: menu.visible,
        parentId: menu.parentId?.toString() || "",
        sortOrder: menu.sortOrder,
      });
    } else {
      reset({
        name: "",
        type: "LINK",
        url: "",
        targetId: "",
        displayPosition: "HEADER",
        visible: true,
        parentId: parentId?.toString() || "",
        sortOrder: 0,
      });
    }
  }, [menu, reset, parentId]);

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
    borderWidth: "1px",
    borderRadius: "0.375rem",
    borderColor: "inherit",
    backgroundColor: "transparent",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardsResponse, contentsResponse] = await Promise.all([
          fetch("/api/board", {
            headers: getAuthHeader(),
          }),
          fetch("/api/content", {
            headers: getAuthHeader(),
          }),
        ]);

        if (!boardsResponse.ok || !contentsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const boardsData = (await boardsResponse.json()) as BoardResponse[];
        const contentsData =
          (await contentsResponse.json()) as ContentResponse[];

        // 필요한 데이터만 매핑
        const mappedBoards = boardsData.map((board) => ({
          id: board.id,
          name: board.name,
        }));

        const mappedContents = contentsData.map((content) => ({
          id: content.id,
          name: content.name,
        }));

        setBoards(mappedBoards);
        setContents(mappedContents);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toaster.create({
          title: "데이터를 불러오는데 실패했습니다.",
          type: "error",
        });
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!menu || !onDelete) return;

    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      onDelete(menu.id);
      onClose();
    }
  };

  const handleFormSubmit = async (data: MenuFormData) => {
    try {
      const submitData = {
        ...data,
        targetId: data.targetId ? Number(data.targetId) : undefined,
        parentId: data.parentId ? Number(data.parentId) : undefined,
        sortOrder: menu?.sortOrder || 0,
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("메뉴 저장 중 오류가 발생했습니다.");
    }
  };

  return (
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
                <NativeSelect.Root>
                  <NativeSelect.Field {...field} style={selectStyle}>
                    <option value="LINK">링크</option>
                    <option value="FOLDER">폴더</option>
                    <option value="BOARD">게시판</option>
                    <option value="CONTENT">컨텐츠</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              )}
            />
          </Box>

          {menuType === "LINK" && (
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
          )}

          {menuType === "BOARD" && (
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
                  <select
                    {...field}
                    style={{
                      ...selectStyle,
                      borderColor: errors.targetId
                        ? "var(--chakra-colors-red-500)"
                        : "inherit",
                    }}
                  >
                    <option value="">게시판 선택</option>
                    {boards.map((board) => (
                      <option key={board.id} value={board.id}>
                        {board.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.targetId && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.targetId.message}
                </Text>
              )}
            </Box>
          )}

          {menuType === "CONTENT" && (
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
                  <select
                    {...field}
                    style={{
                      ...selectStyle,
                      borderColor: errors.targetId
                        ? "var(--chakra-colors-red-500)"
                        : "inherit",
                    }}
                  >
                    <option value="">컨텐츠 선택</option>
                    {contents.map((content) => (
                      <option key={content.id} value={content.id}>
                        {content.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.targetId && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.targetId.message}
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
            {menu && menu.name !== "홈" ? (
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
            ) : (
              <Box />
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
  );
}
