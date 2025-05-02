import React from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Textarea,
  Field as ChakraField,
  Switch as ChakraSwitch,
  VStack,
  Flex,
  Text,
  Spinner,
  Checkbox,
} from "@chakra-ui/react";
import { Schedule, ScheduleFormData } from "../types";
import { useForm } from "react-hook-form";
import { useColors } from "@/styles/theme";
import { CheckIcon, DeleteIcon } from "lucide-react";

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: ScheduleFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  onDelete?: (id: number) => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  onSubmit,
  isSubmitting,
  onCancel,
  onDelete,
}) => {
  const colors = useColors();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ScheduleFormData>({
    defaultValues: schedule
      ? {
          title: schedule.title,
          content: schedule.content,
          startDateTime: schedule.startDateTime,
          endDateTime: schedule.endDateTime,
          displayYn: schedule.displayYn,
        }
      : {
          displayYn: true,
        },
  });

  const handleFormSubmit = async (data: ScheduleFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack gap={3} align="stretch">
          <Box>
            <Flex mb={1}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.text.primary}
              >
                제목
              </Text>
              <Text fontSize="sm" color="red.500" ml={1}>
                *
              </Text>
            </Flex>
            <Input
              {...register("title", { required: "제목을 입력해주세요" })}
              placeholder="일정 제목"
              borderColor={errors.title ? "red.500" : colors.border}
              color={colors.text.primary}
              bg="transparent"
            />
            {errors.title && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.title.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.text.primary}
              >
                상세 내용
              </Text>
            </Flex>
            <Textarea
              {...register("content")}
              placeholder="일정 상세 내용"
              rows={5}
              borderColor={errors.content ? "red.500" : colors.border}
              color={colors.text.primary}
              bg="transparent"
            />
          </Box>

          <Box>
            <Flex mb={1}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.text.primary}
              >
                시작 시간
              </Text>
              <Text fontSize="sm" color="red.500" ml={1}>
                *
              </Text>
            </Flex>
            <Input
              {...register("startDateTime", {
                required: "시작 시간을 선택해주세요",
              })}
              type="datetime-local"
              borderColor={errors.startDateTime ? "red.500" : colors.border}
              color={colors.text.primary}
              bg="transparent"
            />
            {errors.startDateTime && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.startDateTime.message}
              </Text>
            )}
          </Box>

          <Box>
            <Flex mb={1}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={colors.text.primary}
              >
                종료 시간
              </Text>
              <Text fontSize="sm" color="red.500" ml={1}>
                *
              </Text>
            </Flex>
            <Input
              {...register("endDateTime", {
                required: "종료 시간을 선택해주세요",
              })}
              type="datetime-local"
              borderColor={errors.endDateTime ? "red.500" : colors.border}
              color={colors.text.primary}
              bg="transparent"
            />
            {errors.endDateTime && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.endDateTime.message}
              </Text>
            )}
          </Box>

          <Flex alignItems="center">
            <Checkbox.Root
              {...register("displayYn")}
              defaultChecked
              colorPalette="blue"
              size="sm"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control
                borderColor={colors.border}
                bg={colors.bg}
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
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.Label>
                <Text fontWeight="medium" color={colors.text.primary}>
                  일정 노출
                </Text>
              </Checkbox.Label>
            </Checkbox.Root>
          </Flex>

          <Flex justify="space-between" gap={2} mt={4}>
            {schedule && onDelete ? (
              <Button
                borderColor={colors.accent.delete.default}
                color={colors.accent.delete.default}
                onClick={() => onDelete(schedule.scheduleId)}
                variant="outline"
                _hover={{
                  bg: colors.accent.delete.bg,
                  borderColor: colors.accent.delete.hover,
                  color: colors.accent.delete.hover,
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s ease"
                disabled={isSubmitting}
              >
                <Box display="flex" alignItems="center" gap={2} w={4}>
                  <DeleteIcon />
                </Box>
                <Text>삭제</Text>
              </Button>
            ) : (
              <Box />
            )}
            <Flex gap={2}>
              <Button onClick={onCancel} variant="outline" colorScheme="gray">
                취소
              </Button>
              <Button
                type="submit"
                bg={colors.primary.default}
                color="white"
                _hover={{ bg: colors.primary.hover }}
                disabled={isSubmitting}
              >
                <Box display="flex" alignItems="center" gap={2} w={4}>
                  {isSubmitting ? <Spinner size="sm" /> : <CheckIcon />}
                </Box>
                <Text>저장</Text>
              </Button>
            </Flex>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};
