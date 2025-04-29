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
  Flex,
} from "@chakra-ui/react";
import { Board, BoardData } from "@/types/api";
import { useColors } from "@/styles/theme";
import { CheckIcon } from "lucide-react";

interface BoardEditorProps {
  board: Board | null;
  onSubmit: (boardData: Omit<Board, "id" | "createdAt" | "updatedAt">) => void;
  isLoading: boolean;
}

export function BoardEditor({ board, onSubmit, isLoading }: BoardEditorProps) {
  const colors = useColors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BoardData>({
    bbsName: "",
    skinType: "BASIC",
    manager: {
      name: "",
      email: "",
    },
    alarm: {
      mail: false,
      kakao: false,
      internal: false,
    },
    topContent: "",
    bottomContent: "",
    auth: {
      read: "PUBLIC",
      write: "STAFF",
      admin: "ADMIN",
    },
    displayYn: true,
    sortOrder: 0,
    extraSchema: {
      attachmentLimit: 0,
      category: false,
      formDownloadYn: false,
      customFields: [],
    },
  });

  useEffect(() => {
    if (board) {
      setFormData({
        bbsName: board.bbsName,
        skinType: board.skinType,
        manager: board.manager,
        alarm: board.alarm,
        topContent: board.topContent,
        bottomContent: board.bottomContent,
        auth: board.auth,
        displayYn: board.displayYn,
        sortOrder: board.sortOrder,
        extraSchema: board.extraSchema,
      });
    } else {
      setFormData({
        bbsName: "",
        skinType: "BASIC",
        manager: {
          name: "",
          email: "",
        },
        alarm: {
          mail: false,
          kakao: false,
          internal: false,
        },
        topContent: "",
        bottomContent: "",
        auth: {
          read: "PUBLIC",
          write: "STAFF",
          admin: "ADMIN",
        },
        displayYn: true,
        sortOrder: 0,
        extraSchema: {
          attachmentLimit: 0,
          category: false,
          formDownloadYn: false,
          customFields: [],
        },
      });
    }
  }, [board]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith("alarm.")) {
        const alarmKey = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          alarm: {
            ...prev.alarm,
            [alarmKey]: checked,
          },
        }));
      } else if (name.startsWith("extraSchema.")) {
        const extraKey = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          extraSchema: {
            ...prev.extraSchema,
            [extraKey]: checked,
          },
        }));
      }
    } else if (name.startsWith("manager.")) {
      const managerKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        manager: {
          ...prev.manager,
          [managerKey]: value,
        },
      }));
    } else if (name.startsWith("auth.")) {
      const authKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        auth: {
          ...prev.auth,
          [authKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text color={colors.text.secondary}>게시판을 선택하세요</Text>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Box>
          <Flex mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              이름
            </Text>
            <Text fontSize="sm" color="red.500" ml={1}>
              *
            </Text>
          </Flex>
          <Input
            name="bbsName"
            value={formData.bbsName}
            onChange={handleChange}
            placeholder="게시판 이름"
          />
        </Box>

        <Box>
          <Flex mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              유형
            </Text>
            <Text fontSize="sm" color="red.500" ml={1}>
              *
            </Text>
          </Flex>
          <select
            name="skinType"
            value={formData.skinType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid",
              borderColor: "inherit",
            }}
          >
            <option value="BASIC">기본형</option>
            <option value="CUSTOM">커스텀형</option>
          </select>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          loading={isLoading || isSubmitting}
          loadingText="저장 중..."
        >
          <Box display="flex" alignItems="center" gap={2}>
            {isSubmitting ? <Spinner size="sm" /> : <CheckIcon />}
            <Text>저장</Text>
          </Box>
        </Button>
      </VStack>
    </form>
  );
}
