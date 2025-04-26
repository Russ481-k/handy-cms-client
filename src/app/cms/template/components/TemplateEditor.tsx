"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { Template } from "../page";
import { useColors } from "@/styles/theme";

interface TemplateEditorProps {
  template: Template | null;
  onSubmit: (
    templateData: Omit<Template, "id" | "createdAt" | "updatedAt">
  ) => void;
  isLoading: boolean;
}

export function TemplateEditor({
  template,
  onSubmit,
  isLoading,
}: TemplateEditorProps) {
  const colors = useColors();
  const [name, setName] = useState("");
  const [type, setType] = useState<"PAGE" | "COMPONENT">("PAGE");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setType(template.type);
      setContent(template.content);
      setDescription(template.description || "");
    } else {
      setName("");
      setType("PAGE");
      setContent("");
      setDescription("");
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      type,
      content,
      description,
    });
  };

  if (!template) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text color={colors.text.secondary}>템플릿을 선택하세요</Text>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            이름
          </Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="템플릿 이름"
          />
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            유형
          </Text>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "PAGE" | "COMPONENT")}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "inherit",
            }}
          >
            <option value="PAGE">페이지</option>
            <option value="COMPONENT">컴포넌트</option>
          </select>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            설명
          </Text>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="템플릿 설명"
          />
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            내용
          </Text>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="템플릿 내용"
            height="200px"
          />
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          loading={isLoading}
          loadingText="저장 중..."
        >
          저장
        </Button>
      </VStack>
    </form>
  );
}
