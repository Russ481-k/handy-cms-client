"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Heading,
  Field,
  Switch,
  NativeSelect,
} from "@chakra-ui/react";
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
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={6}>
        {menu ? "메뉴 수정" : "새 메뉴 추가"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root invalid={!!errors.name} required>
            <Field.Label>메뉴명</Field.Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <Field.ErrorText>{errors.name}</Field.ErrorText>}
          </Field.Root>

          <Field.Root required>
            <Field.Label>메뉴 유형</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="LINK">링크</option>
                <option value="FOLDER">폴더</option>
                <option value="BOARD">게시판</option>
                <option value="CONTENT">컨텐츠</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {formData.type === "LINK" && (
            <Field.Root invalid={!!errors.url} required>
              <Field.Label>URL</Field.Label>
              <Input name="url" value={formData.url} onChange={handleChange} />
              {errors.url && <Field.ErrorText>{errors.url}</Field.ErrorText>}
            </Field.Root>
          )}

          {formData.type === "BOARD" && (
            <Field.Root invalid={!!errors.targetId} required>
              <Field.Label>게시판</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  name="targetId"
                  value={formData.targetId}
                  onChange={handleChange}
                  placeholder="게시판 선택"
                >
                  {boards.map((board) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              {errors.targetId && (
                <Field.ErrorText>{errors.targetId}</Field.ErrorText>
              )}
            </Field.Root>
          )}

          {formData.type === "CONTENT" && (
            <Field.Root invalid={!!errors.targetId} required>
              <Field.Label>컨텐츠</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  name="targetId"
                  value={formData.targetId}
                  onChange={handleChange}
                  placeholder="컨텐츠 선택"
                >
                  {contents.map((content) => (
                    <option key={content.id} value={content.id}>
                      {content.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              {errors.targetId && (
                <Field.ErrorText>{errors.targetId}</Field.ErrorText>
              )}
            </Field.Root>
          )}

          <Field.Root invalid={!!errors.displayPosition} required>
            <Field.Label>출력 위치</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                name="displayPosition"
                value={formData.displayPosition}
                onChange={handleChange}
              >
                <option value="HEADER">헤더</option>
                <option value="SIDEBAR">사이드바</option>
                <option value="FOOTER">푸터</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            {errors.displayPosition && (
              <Field.ErrorText>{errors.displayPosition}</Field.ErrorText>
            )}
          </Field.Root>

          <Flex alignItems="center">
            <Field.Label htmlFor="visible" mb="0" mr={2}>
              메뉴 노출
            </Field.Label>
            <Switch.Root>
              <Switch.HiddenInput
                id="visible"
                name="visible"
                checked={formData.visible}
                onChange={handleSwitchChange}
              />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </Flex>

          <Flex justify="flex-end" mt={4}>
            <Button variant="outline" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button type="submit" colorScheme="blue">
              {menu ? "수정" : "추가"}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
}
