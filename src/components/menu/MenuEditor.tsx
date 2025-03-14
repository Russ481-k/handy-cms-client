"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Heading,
  Text,
  Checkbox,
  NativeSelect,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { LuCheck } from "react-icons/lu";
import { Menu } from "@/app/cms/menu/page";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface MenuEditorProps {
  menu?: Menu | null;
  onClose: () => void;
  onDelete?: (menuId: number) => void;
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

export function MenuEditor({ menu, onClose, onDelete }: MenuEditorProps) {
  const [boards, setBoards] = useState<Array<{ id: number; name: string }>>([]);
  const [contents, setContents] = useState<Array<{ id: number; name: string }>>(
    []
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: menu?.name || "",
      type: menu?.type || "LINK",
      url: menu?.url || "",
      targetId: menu?.targetId?.toString() || "",
      displayPosition: menu?.displayPosition || "HEADER",
      visible: menu?.visible ?? true,
      parentId: menu?.parentId?.toString() || "",
    },
  });

  const menuType = watch("type");

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
          fetch("/api/boards"),
          fetch("/api/contents"),
        ]);
        const boardsData = await boardsResponse.json();
        const contentsData = await contentsResponse.json();
        setBoards(boardsData);
        setContents(contentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: MenuFormData) => {
    try {
      const submitData = {
        ...data,
        targetId: data.targetId ? Number(data.targetId) : undefined,
        parentId: data.parentId ? Number(data.parentId) : undefined,
      };

      const response = await fetch(`/api/menus${menu ? `/${menu.id}` : ""}`, {
        method: menu ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Failed to save menu");
      }

      alert(menu ? "메뉴가 수정되었습니다." : "메뉴가 추가되었습니다.");
      onClose();
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("메뉴 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!menu || !onDelete) return;

    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      onDelete(menu.id);
      onClose();
    }
  };

  return (
    <Box p={2}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md" color={textColor}>
          {menu ? "메뉴 수정" : "새 메뉴 추가"}
        </Heading>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={3} align="stretch">
          <Box>
            <Flex mb={1}>
              <Text fontWeight="medium" color={textColor}>
                메뉴명
              </Text>
              <Text color={errorColor} ml={1}>
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
              <Text fontWeight="medium" color={textColor}>
                메뉴 유형
              </Text>
              <Text color={errorColor} ml={1}>
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
                <Text fontWeight="medium" color={textColor}>
                  URL
                </Text>
                <Text color={errorColor} ml={1}>
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
                <Text fontWeight="medium" color={textColor}>
                  게시판
                </Text>
                <Text color={errorColor} ml={1}>
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
                <Text fontWeight="medium" color={textColor}>
                  컨텐츠
                </Text>
                <Text color={errorColor} ml={1}>
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

          <Flex alignItems="center" mt={2}>
            <Controller
              name="visible"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox.Root
                  checked={value}
                  onCheckedChange={(e) => onChange(!!e.checked)}
                  colorPalette="blue"
                  size="md"
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
            {menu && menu.name !== "홈" && (
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
            <Flex justify="flex-end" gap={2} mt={4}>
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
