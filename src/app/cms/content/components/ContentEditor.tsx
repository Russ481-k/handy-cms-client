"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  Text,
  Checkbox as ChakraCheckbox,
  Input,
  Select as ChakraSelect,
  Textarea,
  IconButton,
  HStack,
  Separator,
  useDisclosure,
  Dialog,
  Portal,
  CloseButton,
  Select,
  createListCollection,
  Checkbox,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { LuPlus, LuTrash2, LuPencil, LuCheck } from "react-icons/lu";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TreeItem } from "@/components/ui/tree-list";
import { Content, VisionSection } from "../types";
import dynamic from "next/dynamic";

const LexicalEditor = dynamic(() => import("./LexicalEditor"), { ssr: false });

const contentSchema = z.object({
  name: z.string().min(1, "제목을 입력해주세요"),
  description: z.string(),
  type: z.enum(["page", "vision", "news", "notice"]),
  content: z.string(),
  visible: z.boolean(),
  sections: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        type: z.enum(["text", "quote", "list"]),
        items: z.array(z.string()).optional(),
      })
    )
    .optional(),
  settings: z.object({
    layout: z.enum(["default", "wide", "full"]),
    showThumbnail: z.boolean(),
    showTags: z.boolean(),
    showDate: z.boolean(),
    showAuthor: z.boolean(),
    showRelatedContent: z.boolean(),
    showTableOfContents: z.boolean(),
  }),
  metadata: z
    .object({
      author: z.string().optional(),
      position: z.string().optional(),
      department: z.string().optional(),
      contact: z.string().optional(),
    })
    .optional(),
});

type ContentFormData = z.infer<typeof contentSchema> & {
  visible: boolean;
};

interface ContentEditorProps {
  content?: Content | null;
  onClose: () => void;
  onDelete?: (contentId: number) => void;
  onSubmit: (content: Omit<Content, "id" | "createdAt" | "updatedAt">) => void;
}

export function ContentEditor({
  content,
  onClose,
  onDelete,
  onSubmit,
}: ContentEditorProps) {
  const colors = useColors();
  const { open, onOpen, onClose: onCloseModal } = useDisclosure();
  const [selectedSection, setSelectedSection] = useState<VisionSection | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      name: content?.name || "",
      description: content?.description || "",
      type: content?.type || "page",
      content: content?.content || "",
      visible: content?.visible ?? true,
      sections: content?.sections || [],
      settings: content?.settings || {
        layout: "default",
        showThumbnail: true,
        showTags: true,
        showDate: true,
        showAuthor: true,
        showRelatedContent: true,
        showTableOfContents: true,
      },
      metadata: content?.metadata || {
        author: "",
        position: "",
        department: "",
        contact: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const handleAddSection = () => {
    append({
      title: "",
      content: "",
      type: "text",
      items: [],
    });
  };

  const handleEditSection = (section: VisionSection) => {
    setSelectedSection(section);
    onOpen();
  };

  const handleSaveSection = (section: VisionSection) => {
    if (selectedSection) {
      const index = fields.findIndex((f) => f.id === selectedSection.id);
      if (index !== -1) {
        fields[index] = { ...section, id: fields[index].id };
      }
    } else {
      append(section);
    }
    onCloseModal();
  };

  const handleFormSubmit = (data: ContentFormData) => {
    onSubmit({
      ...data,
      title: data.name,
      status: data.visible ? "PUBLISHED" : "DRAFT",
      displayPosition: content?.displayPosition || "0",
      visible: data.visible,
      sortOrder: content?.sortOrder || 0,
    });
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack gap={4} align="stretch">
          <Box>
            <Text mb={2}>제목</Text>
            <Input {...register("name")} />
            {errors.name && (
              <Text color="red.500" fontSize="sm">
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Box>
            <Text mb={2}>설명</Text>
            <Textarea {...register("description")} />
          </Box>

          <Box>
            <Text mb={2}>컨텐츠 유형</Text>

            <Select.Root
              variant="outline"
              collection={createListCollection({
                items: [
                  { value: "page", label: "일반 페이지" },
                  { value: "vision", label: "비전 및 목표" },
                  { value: "news", label: "뉴스" },
                  { value: "notice", label: "공지사항" },
                ],
              })}
            >
              <Select.HiddenSelect />
              <Select.Label>Select framework - outline</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select framework" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {[
                      { value: "page", label: "일반 페이지" },
                      { value: "vision", label: "비전 및 목표" },
                      { value: "news", label: "뉴스" },
                      { value: "notice", label: "공지사항" },
                    ].map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>

          {watch("type") === "vision" && (
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text>섹션</Text>
                <IconButton
                  aria-label="섹션 추가"
                  size="sm"
                  onClick={handleAddSection}
                >
                  <LuPlus />
                </IconButton>
              </Flex>
              <VStack gap={2} align="stretch">
                {fields.map((field, index) => (
                  <Box key={field.id} p={4} borderWidth={1} borderRadius="md">
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold">
                        {field.title || "제목 없음"}
                      </Text>
                      <HStack>
                        <IconButton
                          aria-label="섹션 수정"
                          size="sm"
                          onClick={() => handleEditSection(field)}
                        >
                          <LuPencil />
                        </IconButton>
                        <IconButton
                          aria-label="섹션 삭제"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <LuTrash2 />
                        </IconButton>
                      </HStack>
                    </Flex>
                    <Text>{field.content}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          <Box>
            <Text mb={2}>내용</Text>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <LexicalEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </Box>

          <Separator />

          <Box>
            <Text mb={2}>설정</Text>
            <VStack gap={2} align="stretch">
              <Controller
                name="settings.layout"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    key={field.value}
                    variant="outline"
                    value={[field.value]}
                    onValueChange={({ value }) => field.onChange(value[0])}
                    collection={createListCollection({
                      items: [
                        { value: "default", label: "기본" },
                        { value: "wide", label: "와이드" },
                        { value: "full", label: "전체" },
                      ],
                    })}
                  >
                    <Select.HiddenSelect />
                    <Select.Label>Select framework - outline</Select.Label>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select framework" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {[
                            { value: "page", label: "일반 페이지" },
                            { value: "vision", label: "비전 및 목표" },
                            { value: "news", label: "뉴스" },
                            { value: "notice", label: "공지사항" },
                          ].map((framework) => (
                            <Select.Item item={framework} key={framework.value}>
                              {framework.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                )}
              />
              <Controller
                name="settings.showThumbnail"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>썸네일 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
              <Controller
                name="settings.showTags"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>태그 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
              <Controller
                name="settings.showDate"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>날짜 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
              <Controller
                name="settings.showAuthor"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>작성자 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
              <Controller
                name="settings.showRelatedContent"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>관련 컨텐츠 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
              <Controller
                name="settings.showTableOfContents"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox.Root
                    checked={value}
                    onCheckedChange={(e) => onChange(!!e.checked)}
                    colorPalette="blue"
                    size="sm"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <LuCheck />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>목차 표시</Checkbox.Label>
                  </Checkbox.Root>
                )}
              />
            </VStack>
          </Box>

          <Separator />

          <Box>
            <Text mb={2}>메타데이터</Text>
            <VStack gap={2} align="stretch">
              <Input placeholder="작성자" {...register("metadata.author")} />
              <Input placeholder="직위" {...register("metadata.position")} />
              <Input placeholder="부서" {...register("metadata.department")} />
              <Input placeholder="연락처" {...register("metadata.contact")} />
            </VStack>
          </Box>

          <Flex justify="flex-end" gap={2}>
            {content && onDelete && (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => onDelete(content.id)}
              >
                삭제
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" colorScheme="blue">
              저장
            </Button>
          </Flex>
        </VStack>
      </form>

      <Dialog.Root size="full" motionPreset="slide-in-bottom">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>섹션 편집</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap={4} align="stretch">
                  <Box>
                    <Text mb={2}>제목</Text>
                    <Input
                      value={selectedSection?.title || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSelectedSection((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                    />
                  </Box>
                  <Box>
                    <Text mb={2}>유형</Text>

                    <Select.Root
                      variant="outline"
                      collection={createListCollection({
                        items: [
                          { value: "text", label: "텍스트" },
                          { value: "quote", label: "인용구" },
                          { value: "list", label: "목록" },
                        ],
                      })}
                    >
                      <Select.HiddenSelect />
                      <Select.Label>Select framework - outline</Select.Label>
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select framework" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {[
                              { value: "text", label: "텍스트" },
                              { value: "quote", label: "인용구" },
                              { value: "list", label: "목록" },
                            ].map((type) => (
                              <Select.Item item={type} key={type.value}>
                                {type.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text mb={2}>내용</Text>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <LexicalEditor
                          value={selectedSection?.content || ""}
                          onChange={(value) =>
                            setSelectedSection((prev) =>
                              prev ? { ...prev, content: value || "" } : null
                            )
                          }
                        />
                      )}
                    />
                  </Box>
                  {selectedSection?.type === "list" && (
                    <Box>
                      <Text mb={2}>목록 항목</Text>
                      <VStack gap={2} align="stretch">
                        {selectedSection.items?.map((item, index) => (
                          <HStack key={index}>
                            <Input
                              value={item}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                setSelectedSection((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        items: prev.items?.map((i, idx) =>
                                          idx === index ? e.target.value : i
                                        ),
                                      }
                                    : null
                                )
                              }
                            />
                            <IconButton
                              aria-label="항목 삭제"
                              size="sm"
                              onClick={() =>
                                setSelectedSection((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        items: prev.items?.filter(
                                          (_, idx) => idx !== index
                                        ),
                                      }
                                    : null
                                )
                              }
                            >
                              <LuTrash2 />
                            </IconButton>
                          </HStack>
                        ))}
                        <Button
                          onClick={() =>
                            setSelectedSection((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    items: [...(prev.items || []), ""],
                                  }
                                : null
                            )
                          }
                        >
                          <LuPlus /> 항목 추가
                        </Button>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={onCloseModal}>
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorScheme="blue"
                  onClick={() =>
                    selectedSection && handleSaveSection(selectedSection)
                  }
                >
                  저장
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
