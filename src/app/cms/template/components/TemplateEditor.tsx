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
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { Template } from "@/types/template";
import { useColors } from "@/styles/theme";

interface TemplateEditorProps {
  template: Template | null;
  onSubmit: (
    templateData: Omit<Template, "templateId" | "createdAt" | "updatedAt">
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
  const [type, setType] = useState<string>("PAGE");
  const [layout, setLayout] = useState<any[]>([]);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.templateName);
      setType(template.templateType);
      setLayout(template.layout);
      setPublished(template.published);
    } else {
      setName("");
      setType("PAGE");
      setLayout([]);
      setPublished(false);
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      templateName: name,
      templateType: type,
      layout,
      published,
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
          <Text mb="2">이름</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="템플릿 이름"
          />
        </Box>

        <Box>
          <Text mb="2">유형</Text>
          <select
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setType(e.target.value)
            }
          >
            <option value="PAGE">페이지</option>
            <option value="COMPONENT">컴포넌트</option>
          </select>
        </Box>

        <Box display="flex" alignItems="center">
          <Text mb="0" mr="2">
            공개 상태
          </Text>
          <ChakraSwitch.Root
            defaultChecked={published}
            onCheckedChange={(details: { checked: boolean }) =>
              setPublished(details.checked)
            }
          >
            <ChakraSwitch.Control>
              <ChakraSwitch.Thumb />
            </ChakraSwitch.Control>
          </ChakraSwitch.Root>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            레이아웃
          </Text>
          <Textarea
            value={JSON.stringify(layout, null, 2)}
            onChange={(e) => {
              try {
                setLayout(JSON.parse(e.target.value));
              } catch (error) {
                // JSON 파싱 에러 무시
              }
            }}
            placeholder="레이아웃 JSON"
            height="200px"
            fontFamily="monospace"
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
