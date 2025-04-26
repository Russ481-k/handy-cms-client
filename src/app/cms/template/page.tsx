"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { TemplateList } from "./components/TemplateList";
import { TemplateEditor } from "./components/TemplateEditor";
import { GridSection } from "@/components/ui/grid-section";
import { useColors } from "@/styles/theme";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { templateApi, templateKeys } from "@/lib/api/template";
import { api } from "@/lib/api-client";

export interface Template {
  id: number;
  name: string;
  type: "PAGE" | "COMPONENT";
  content: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TemplateManagementPage() {
  const colors = useColors();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [tempTemplate, setTempTemplate] = useState<Template | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<number | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data: templates, isLoading: isTemplatesLoading } = useQuery({
    queryKey: templateKeys.all,
    queryFn: templateApi.getTemplates,
  });

  const saveTemplateMutation = useMutation({
    mutationFn: templateApi.saveTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toaster.create({
        title: "템플릿 저장 성공",
        type: "success",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: templateApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      toaster.create({
        title: "템플릿 삭제 성공",
        type: "success",
      });
    },
  });

  const handleAddTemplate = useCallback(() => {
    const newTemplate: Template = {
      id: Date.now(),
      name: "새 템플릿",
      type: "PAGE",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTempTemplate(newTemplate);
    setSelectedTemplate(newTemplate);
  }, []);

  const handleEditTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setTempTemplate(null);
  }, []);

  const handleDeleteTemplate = useCallback(
    async (templateId: number) => {
      try {
        setLoadingTemplateId(templateId);
        if (tempTemplate && tempTemplate.id === templateId) {
          setTempTemplate(null);
        } else {
          await deleteTemplateMutation.mutateAsync(templateId);
        }
      } finally {
        setLoadingTemplateId(null);
      }
    },
    [deleteTemplateMutation, tempTemplate]
  );

  const handleSubmit = useCallback(
    async (templateData: Omit<Template, "id" | "createdAt" | "updatedAt">) => {
      try {
        const templateId = tempTemplate ? undefined : selectedTemplate?.id;
        if (templateId !== undefined) {
          setLoadingTemplateId(templateId);
        }
        await saveTemplateMutation.mutateAsync({
          id: templateId,
          templateData,
        });
      } catch (error) {
        console.error("Error saving template:", error);
      } finally {
        setLoadingTemplateId(null);
      }
    },
    [saveTemplateMutation, selectedTemplate, tempTemplate]
  );

  // 템플릿 관리 페이지 레이아웃 정의
  const templateLayout = [
    {
      id: "header",
      x: 0,
      y: 0,
      w: 12,
      h: 1,
      isStatic: true,
      isHeader: true,
    },
    {
      id: "templateList",
      x: 0,
      y: 1,
      w: 3,
      h: 5,
      title: "템플릿 목록",
      subtitle: "템플릿 목록을 관리합니다.",
    },
    {
      id: "templateEditor",
      x: 0,
      y: 6,
      w: 3,
      h: 6,
      title: "템플릿 편집",
      subtitle: "템플릿의 상세 정보를 수정할 수 있습니다.",
    },
    {
      id: "preview",
      x: 3,
      y: 1,
      w: 9,
      h: 11,
      title: "미리보기",
      subtitle: "템플릿의 실시간 미리보기입니다.",
    },
  ];

  return (
    <Box bg={colors.bg} minH="100vh" w="full" position="relative">
      <Box w="full">
        <GridSection initialLayout={templateLayout}>
          <Flex justify="space-between" align="center" h="36px">
            <Flex align="center" gap={2} px={2}>
              <Heading
                size="lg"
                color={colors.text.primary}
                letterSpacing="tight"
              >
                템플릿 관리
              </Heading>
              <Badge
                bg={colors.secondary.light}
                color={colors.secondary.default}
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
              >
                관리자
              </Badge>
            </Flex>
          </Flex>

          <Box>
            <TemplateList
              templates={templates?.data || []}
              onAddTemplate={handleAddTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              isLoading={isTemplatesLoading}
              selectedTemplateId={selectedTemplate?.id}
              loadingTemplateId={loadingTemplateId}
            />
          </Box>

          <Box>
            <TemplateEditor
              template={selectedTemplate}
              onSubmit={handleSubmit}
              isLoading={loadingTemplateId !== null}
            />
          </Box>

          <Box>{/* 미리보기 컴포넌트 구현 */}</Box>
        </GridSection>
      </Box>
      <Toaster />
    </Box>
  );
}
