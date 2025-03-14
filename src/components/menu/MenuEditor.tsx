"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";
import { Menu } from "@/app/cms/menu/page";

interface MenuEditorProps {
  menu?: Menu | null;
  onClose: () => void;
}

export function MenuEditor({ menu, onClose }: MenuEditorProps) {
  const [boards, setBoards] = useState<Array<{ id: number; name: string }>>([]);
  const [contents, setContents] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [formData, setFormData] = useState({
    name: menu?.name || "",
    type: menu?.type || "LINK",
    url: menu?.url || "",
    targetId: menu?.targetId || "",
    displayPosition: menu?.displayPosition || "HEADER",
    visible: menu?.visible ?? true,
    parentId: menu?.parentId || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const buttonHoverBg = useColorModeValue(
    colors.primary.hover,
    colors.primary.hover
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

  // 체크박스 스타일
  const checkboxStyle = {
    width: "1.5rem",
    height: "1.5rem",
    cursor: "pointer",
  };

  useEffect(() => {
    // Fetch boards and contents for selection
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "메뉴명을 입력해주세요.";
    }

    if (!formData.displayPosition) {
      newErrors.displayPosition = "출력 위치를 선택해주세요.";
    }

    if (formData.type === "LINK" && !formData.url) {
      newErrors.url = "URL을 입력해주세요.";
    }

    if (
      (formData.type === "BOARD" || formData.type === "CONTENT") &&
      !formData.targetId
    ) {
      newErrors.targetId = `${
        formData.type === "BOARD" ? "게시판" : "컨텐츠"
      }를 선택해주세요.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 서버에 전송할 데이터 준비
    const submitData = {
      ...formData,
      targetId: formData.targetId ? Number(formData.targetId) : undefined,
      parentId: formData.parentId ? Number(formData.parentId) : undefined,
    };

    try {
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

  return (
    <Box p={2}>
      <Heading size="md" mb={6} color={textColor}>
        {menu ? "메뉴 수정" : "새 메뉴 추가"}
      </Heading>

      <form onSubmit={handleSubmit}>
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
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              borderColor={errors.name ? errorColor : borderColor}
              color={textColor}
              bg="transparent"
            />
            {errors.name && (
              <Text color={errorColor} fontSize="sm" mt={1}>
                {errors.name}
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
            <Box>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="LINK">링크</option>
                <option value="FOLDER">폴더</option>
                <option value="BOARD">게시판</option>
                <option value="CONTENT">컨텐츠</option>
              </select>
            </Box>
          </Box>

          {formData.type === "LINK" && (
            <Box>
              <Flex mb={1}>
                <Text fontWeight="medium" color={textColor}>
                  URL
                </Text>
                <Text color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Input
                name="url"
                value={formData.url}
                onChange={handleChange}
                borderColor={errors.url ? errorColor : borderColor}
                color={textColor}
                bg="transparent"
              />
              {errors.url && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.url}
                </Text>
              )}
            </Box>
          )}

          {formData.type === "BOARD" && (
            <Box>
              <Flex mb={1}>
                <Text fontWeight="medium" color={textColor}>
                  게시판
                </Text>
                <Text color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Box>
                <select
                  name="targetId"
                  value={formData.targetId}
                  onChange={handleChange}
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
              </Box>
              {errors.targetId && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.targetId}
                </Text>
              )}
            </Box>
          )}

          {formData.type === "CONTENT" && (
            <Box>
              <Flex mb={1}>
                <Text fontWeight="medium" color={textColor}>
                  컨텐츠
                </Text>
                <Text color={errorColor} ml={1}>
                  *
                </Text>
              </Flex>
              <Box>
                <select
                  name="targetId"
                  value={formData.targetId}
                  onChange={handleChange}
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
              </Box>
              {errors.targetId && (
                <Text color={errorColor} fontSize="sm" mt={1}>
                  {errors.targetId}
                </Text>
              )}
            </Box>
          )}

          <Flex alignItems="center" mt={2}>
            <Text fontWeight="medium" color={textColor} mr={2}>
              메뉴 노출
            </Text>
            <Box>
              <input
                type="checkbox"
                id="visible"
                name="visible"
                checked={formData.visible}
                onChange={handleSwitchChange}
                style={checkboxStyle}
              />
            </Box>
          </Flex>

          <Flex justify="flex-end" gap={2} mt={4}>
            <Button
              variant="outline"
              onClick={onClose}
              borderColor={borderColor}
              color={textColor}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            >
              취소
            </Button>
            <Button
              type="submit"
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg }}
            >
              저장
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
