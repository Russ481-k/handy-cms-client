"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Badge } from "@chakra-ui/react";
import { GridSection } from "@/components/ui/grid-section";
import { useColors } from "@/styles/theme";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { templateApi } from "@/lib/api/template";
import { api } from "@/lib/api-client";
import { ApiResponse } from "@/lib/api-client";
import { TemplateEditor } from "./components/TemplateEditor";
import { TemplateList } from "./components/TemplateList";
import { Template, TemplateData, TemplateListResponse } from "@/types/api";
import { menuKeys, sortMenus } from "@/lib/api/menu";

export default function TemplateManagementPage() {
  const renderCount = React.useRef(0);
  renderCount.current += 1;

  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [parentTemplateId, setParentTemplateId] = useState<number | null>(null);
  const [tempTemplate, setTempTemplate] = useState<Template | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<number | null>(
    null
  );
  const [forceExpandTemplateId, setForceExpandTemplateId] = useState<
    number | null
  >(null);
  const colors = useColors();

  // 메뉴 목록 가져오기
  const { data: menuResponse, isLoading: isMenusLoading } = useQuery<
    ApiResponse<any>
  >({
    queryKey: menuKeys.list(""),
    queryFn: async () => {
      const response = await api.public.menu.getMenus();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const menus = React.useMemo(() => {
    try {
      const responseData = menuResponse?.data;
      if (!responseData) return [];

      // API 응답이 배열인 경우
      if (Array.isArray(responseData)) {
        return sortMenus(responseData);
      }

      // API 응답이 객체인 경우 data 필드를 확인
      const menuData = responseData.data;
      if (!menuData) return [];

      // menuData가 배열인지 확인
      return Array.isArray(menuData) ? sortMenus(menuData) : [menuData];
    } catch (error) {
      console.error("Error processing menu data:", error);
      return [];
    }
  }, [menuResponse]);

  // 템플릿 목록 가져오기
  const { data: templateResponse, isLoading } = useQuery<
    ApiResponse<TemplateListResponse>
  >({
    queryKey: ["templates"],
    queryFn: () => api.private.template.getTemplates(),
  });

  const templates = React.useMemo(() => {
    try {
      const responseData = templateResponse?.data;
      if (!responseData) return [];
      console.log(responseData.data.content);
      // API 응답이 TemplateListResponse 타입인 경우
      if (responseData.data.content) {
        return responseData.data.content;
      }

      return [];
    } catch (error) {
      console.error("Error processing template data:", error);
      return [];
    }
  }, [templateResponse]);

  // 템플릿 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: templateApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setSelectedTemplate(null);
      toaster.create({
        title: "템플릿가 삭제되었습니다.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
      toaster.create({
        title: "템플릿 삭제에 실패했습니다.",
        type: "error",
      });
    },
  });

  // 템플릿 저장/업데이트 뮤테이션
  const saveTemplateMutation = useMutation({
    mutationFn: (data: {
      id?: string;
      templateData: Omit<Template, "id" | "createdAt" | "updatedAt">;
    }) => {
      const mappedData = {
        templateName: data.templateData.name,
        templateType: data.templateData.type,
        layout: [
          {
            blockId: "1",
            x: 0,
            y: 0,
            w: 12,
            h: 1,
            widget: {
              type: data.templateData.displayPosition,
            },
          },
        ],
        ...data.templateData,
      };
      return data.id
        ? api.private.template.updateTemplate(data.id, mappedData)
        : api.private.template.createTemplate(mappedData);
    },
    onSuccess: (savedTemplate) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setSelectedTemplate(savedTemplate.data);
      setParentTemplateId(savedTemplate.data.parentId || null);
      setTempTemplate(null);
      toaster.create({
        title: tempTemplate
          ? "템플릿가 생성되었습니다."
          : "템플릿가 수정되었습니다.",
        type: "success",
      });
    },
    onError: (error) => {
      console.error("Error saving template:", error);
      toaster.create({
        title: tempTemplate
          ? "템플릿 생성에 실패했습니다."
          : "템플릿 수정에 실패했습니다.",
        type: "error",
      });
    },
  });

  const handleDeleteTemplate = useCallback(
    async (templateId: number) => {
      try {
        setLoadingTemplateId(templateId);
        if (tempTemplate && tempTemplate.id === templateId) {
          setTempTemplate(null);
        } else {
          await deleteMutation.mutateAsync(templateId.toString());
        }
        const parentTemplate = findParentTemplate(templates, templateId);
        if (parentTemplate) {
          setSelectedTemplate(parentTemplate);
          setParentTemplateId(parentTemplate.parentId || null);
          if (parentTemplate.type === "FOLDER") {
            setForceExpandTemplateId(parentTemplate.id);
          }
        }
      } finally {
        setLoadingTemplateId(null);
      }
    },
    [deleteMutation, templates, tempTemplate]
  );

  const handleSubmit = useCallback(
    async (templateData: Omit<Template, "id" | "createdAt" | "updatedAt">) => {
      try {
        const templateId = tempTemplate ? undefined : selectedTemplate?.id;
        if (templateId !== undefined) {
          setLoadingTemplateId(templateId);
        }
        await saveTemplateMutation.mutateAsync({
          id: templateId?.toString(),
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

  // 템플릿 목록에 새 템플릿 추가하는 함수
  const addTemplateToList = useCallback(
    (newTemplate: Template, targetTemplate: Template | null = null) => {
      if (!targetTemplate) {
        return [...templates, newTemplate];
      }

      const updateTemplateTree = (templateList: Template[]): Template[] => {
        return templateList.map((template) => {
          if (template.id === targetTemplate.id) {
            const updatedChildren = [...(template.children || [])];
            updatedChildren.push(newTemplate);
            return {
              ...template,
              children: updatedChildren,
            };
          }
          if (template.children && template.children.length > 0) {
            return {
              ...template,
              children: updateTemplateTree(template.children),
            };
          }
          return template;
        });
      };

      return updateTemplateTree(templates);
    },
    [templates]
  );

  // 임시 템플릿 생성 함수
  const handleAddTemplate = useCallback(
    (parentTemplate: Template) => {
      const newTempTemplate: Template = {
        id: Date.now(), // 임시 ID
        name: "새 템플릿",
        type: "LINK",
        displayPosition: parentTemplate.displayPosition,
        visible: true,
        sortOrder: 0,
        parentId: parentTemplate.id,
        children: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTempTemplate(newTempTemplate);
      setSelectedTemplate(newTempTemplate);
      setParentTemplateId(parentTemplate.id);

      // 임시 템플릿를 템플릿 목록에 추가
      const updatedTemplates = [...(templates || [])];
      if (parentTemplate.id === -1) {
        // 최상위 템플릿에 추가
        updatedTemplates.push(newTempTemplate);
      } else {
        // 부모 템플릿의 children에 추가
        const parentIndex = updatedTemplates.findIndex(
          (m) => m.id === parentTemplate.id
        );
        if (parentIndex !== -1) {
          const parent = updatedTemplates[parentIndex];
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(newTempTemplate);
        }
      }

      // React Query 캐시 업데이트
      queryClient.setQueryData(["templates"], updatedTemplates);
    },
    [templates, queryClient]
  );

  const handleEditTemplate = useCallback(
    (template: Template) => {
      if (tempTemplate) {
        // 임시 템플릿 수정 중인 경우 경고 모달 표시
        if (window.confirm("새 템플릿 추가가 취소됩니다. 취소하시겠습니까?")) {
          // 임시 템플릿를 템플릿 목록에서 제거
          const updatedTemplates =
            templates?.filter((m: Template) => m.id !== tempTemplate.id) || [];
          queryClient.setQueryData(["templates"], updatedTemplates);

          setTempTemplate(null);
          setSelectedTemplate(template);
          setParentTemplateId(template.parentId || null);
        }
      } else {
        setSelectedTemplate(template);
        setParentTemplateId(template.parentId || null);
      }
    },
    [templates, queryClient, tempTemplate]
  );

  const handleCloseEditor = useCallback(() => {
    if (tempTemplate) {
      // 임시 템플릿인 경우 삭제
      const updatedTemplates =
        templates?.filter((m: Template) => m.id !== tempTemplate.id) || [];
      queryClient.setQueryData(["templates"], updatedTemplates);

      setTempTemplate(null);
      setSelectedTemplate(templates?.[0] || null);
    } else {
      // 기존 템플릿 편집 중 취소
      setSelectedTemplate(null);
    }
  }, [templates, queryClient, tempTemplate]);

  const handleCancelConfirm = useCallback(() => {
    setTempTemplate(null);
    setSelectedTemplate(null);
    setParentTemplateId(null);
  }, []);

  const handleCancelCancel = useCallback(() => {
    // Implementation of handleCancelCancel
  }, []);

  const findParentTemplate = useCallback(
    (templates: Template[], targetId: number): Template | null => {
      // 전체 템플릿인 경우
      if (targetId === -1) {
        return {
          id: -1,
          name: "전체",
          type: "FOLDER",
          visible: true,
          sortOrder: 0,
          children: templates,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          displayPosition: "HEADER",
        };
      }

      for (const template of templates) {
        if (template.id === targetId) {
          return template;
        }
        if (template.children && template.children.length > 0) {
          const found = findParentTemplate(template.children, targetId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    []
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
      subtitle: "드래그 앤 드롭으로 템플릿 순서를 변경할 수 있습니다.",
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
      subtitle: "템플릿 구조의 실시간 미리보기입니다.",
    },
  ];

  // 템플릿 목록이 업데이트될 때 선택된 템플릿를 동기화
  useEffect(() => {
    if (templates?.length > 0) {
      // 임시 템플릿가 없는 경우에만 초기 템플릿 선택
      if (!tempTemplate && !selectedTemplate) {
        setSelectedTemplate(templates[0]);
      }
      // 임시 템플릿가 있는 경우, 해당 템플릿를 계속 선택 상태로 유지
      else if (tempTemplate) {
        setSelectedTemplate(tempTemplate);
      }
    }
  }, [templates, tempTemplate, selectedTemplate]);

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
              templates={templates}
              onAddTemplate={handleAddTemplate}
              onEditTemplate={handleEditTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              isLoading={isLoading}
              selectedTemplateId={selectedTemplate?.id}
              loadingTemplateId={loadingTemplateId}
              forceExpandTemplateId={forceExpandTemplateId}
            />
          </Box>

          <Box>
            <TemplateEditor
              template={selectedTemplate}
              onClose={handleCloseEditor}
              onDelete={handleDeleteTemplate}
              onSubmit={handleSubmit}
              parentId={parentTemplateId}
              onAddTemplate={() => {
                if (selectedTemplate?.type === "FOLDER") {
                  handleAddTemplate(selectedTemplate);
                } else if (selectedTemplate?.parentId) {
                  const parentTemplate = findParentTemplate(
                    templates,
                    selectedTemplate.parentId
                  );
                  if (parentTemplate) {
                    handleAddTemplate(parentTemplate);
                  }
                } else {
                  handleAddTemplate({
                    id: -1,
                    name: "전체",
                    type: "FOLDER",
                    visible: true,
                    sortOrder: 0,
                    children: templates,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    displayPosition: "HEADER",
                  });
                }
              }}
              existingTemplates={templates}
              isTempTemplate={!!tempTemplate}
            />
          </Box>

          <Box>
            <Main menus={menus} isPreview={true} />
          </Box>
        </GridSection>
      </Box>
      <ConfirmDialog
        isOpen={false}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
        title="템플릿 추가 취소"
        description="새 템플릿 추가가 취소됩니다. 취소하시겠습니까?"
        confirmText="취소"
        cancelText="계속"
        backdrop="rgba(0, 0, 0, 0.5)"
      />
      <Toaster />
    </Box>
  );
}
