"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Heading,
  Badge,
  Input,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { TemplateList } from "./components/TemplateList";
import { TemplateEditor } from "./components/TemplateEditor";
import { GridSection } from "@/components/ui/grid-section";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Main } from "@/components/layout/view/Main";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { templateApi } from "@/lib/api/template";
import { api } from "@/lib/api-client";
import { Template, TemplateListResponse } from "@/types/template";
import { CustomSelect } from "@/components/CustomSelect";
import { useForm, Controller } from "react-hook-form";
import { useColorModeValue } from "@/components/ui/color-mode";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SearchForm {
  type: string;
  status: string;
}

export default function TemplateManagementPage() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    page: 0,
    size: 10,
    keyword: "",
    type: "",
    status: "",
  });

  const {
    control,
    formState: { errors },
  } = useForm<SearchForm>();

  const queryClient = useQueryClient();

  const { data: templatesData, isLoading: isTemplatesLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templateApi.getTemplates(searchParams),
  });

  const saveTemplateMutation = useMutation({
    mutationFn: templateApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toaster.create({
        title: "템플릿 저장 성공",
        type: "success",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: templateApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toaster.create({
        title: "템플릿 삭제 성공",
        type: "success",
      });
    },
  });

  const handleCreateTemplate = async (
    templateData: Omit<Template, "templateId" | "createdAt" | "updatedAt">
  ) => {
    try {
      setLoading(true);
      await templateApi.createTemplate(templateData);
      toaster.create({
        title: "템플릿 생성 성공",
        type: "success",
      });
      fetchTemplates();
    } catch (error) {
      toaster.create({
        title: "템플릿 생성 실패",
        description: "템플릿 생성에 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (
    id: number,
    templateData: Omit<Template, "templateId" | "createdAt" | "updatedAt">
  ) => {
    try {
      setLoading(true);
      await templateApi.updateTemplate(id, templateData);
      toaster.create({
        title: "템플릿 수정 성공",
        type: "success",
      });
      fetchTemplates();
    } catch (error) {
      toaster.create({
        title: "템플릿 수정 실패",
        description: "템플릿 수정에 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    try {
      setLoading(true);
      await templateApi.deleteTemplate(id);
      toaster.create({
        title: "템플릿 삭제 성공",
        type: "success",
      });
      fetchTemplates();
    } catch (error) {
      toaster.create({
        title: "템플릿 삭제 실패",
        description: "템플릿 삭제에 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: number, published: boolean) => {
    try {
      setLoading(true);
      await templateApi.togglePublish(id, published);
      toaster.create({
        title: "템플릿 상태 변경 성공",
        type: "success",
      });
      fetchTemplates();
    } catch (error) {
      toaster.create({
        title: "템플릿 상태 변경 실패",
        description: "템플릿 상태 변경에 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateApi.getTemplates(searchParams);
      setTemplates(response.content);
    } catch (error) {
      toaster.create({
        title: "템플릿 목록 조회 실패",
        description: "템플릿 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchParams]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <VStack gap={6} align="stretch" p={6}>
          <Flex justify="space-between" align="center">
            <Heading size="lg">템플릿 관리</Heading>
            <Badge
              colorScheme="blue"
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              관리자
            </Badge>
          </Flex>

          <HStack
            gap={4}
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Input
              placeholder="템플릿 검색"
              value={searchParams.keyword}
              onChange={(e) =>
                setSearchParams({ ...searchParams, keyword: e.target.value })
              }
              width="300px"
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  errors={errors}
                  menu={null}
                  options={[
                    { id: 1, name: "페이지" },
                    { id: 2, name: "컴포넌트" },
                  ]}
                  selectStyle={{ width: "200px" }}
                  placeholder="유형 선택"
                />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  field={field}
                  errors={errors}
                  menu={null}
                  options={[
                    { id: 1, name: "공개" },
                    { id: 2, name: "비공개" },
                  ]}
                  selectStyle={{ width: "200px" }}
                  placeholder="상태 선택"
                />
              )}
            />
          </HStack>

          <Box
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <TemplateList
              templates={templates}
              onAdd={handleCreateTemplate}
              onEdit={handleUpdateTemplate}
              onDelete={handleDeleteTemplate}
              onTogglePublish={handleTogglePublish}
              isLoading={loading}
            />
          </Box>

          {selectedTemplate && (
            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <TemplateEditor
                template={selectedTemplate}
                onSubmit={(data) =>
                  handleUpdateTemplate(selectedTemplate.templateId, data)
                }
                isLoading={loading}
              />
            </Box>
          )}

          <Box
            p={4}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            {/* 미리보기 컴포넌트 구현 */}
          </Box>
        </VStack>
        <Toaster />
      </Box>
    </DndProvider>
  );
}
