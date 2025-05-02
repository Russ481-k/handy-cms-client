import React from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Button,
  HStack,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Schedule, ScheduleFormData } from "../../types";

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    defaultValues: schedule
      ? {
          ...schedule,
          descriptionHtml: schedule.descriptionHtml || "",
          place: schedule.place || "",
        }
      : {
          title: "",
          descriptionHtml: "",
          startTime: "",
          endTime: "",
          place: "",
          displayYn: true,
        },
  });

  const toast = useToast();

  const onSubmitHandler = async (data: ScheduleFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "일정이 저장되었습니다.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "일정 저장 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.title}>
          <FormLabel>제목</FormLabel>
          <Input
            {...register("title", {
              required: "제목을 입력해주세요",
              maxLength: {
                value: 255,
                message: "제목은 255자를 초과할 수 없습니다",
              },
            })}
            placeholder="일정 제목을 입력하세요"
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>설명</FormLabel>
          <Textarea
            {...register("descriptionHtml")}
            placeholder="일정에 대한 상세 설명을 입력하세요"
            minH="200px"
          />
        </FormControl>

        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.startTime}>
            <FormLabel>시작 시간</FormLabel>
            <Input
              {...register("startTime", {
                required: "시작 시간을 입력해주세요",
              })}
              type="datetime-local"
            />
            <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.endTime}>
            <FormLabel>종료 시간</FormLabel>
            <Input
              {...register("endTime", {
                required: "종료 시간을 입력해주세요",
              })}
              type="datetime-local"
            />
            <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>장소</FormLabel>
          <Input
            {...register("place")}
            placeholder="일정이 진행될 장소를 입력하세요"
          />
        </FormControl>

        <FormControl>
          <FormLabel>색상</FormLabel>
          <Input {...register("color")} type="color" w="100px" />
        </FormControl>

        <FormControl>
          <HStack>
            <FormLabel mb="0">표시 여부</FormLabel>
            <Switch {...register("displayYn")} />
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>추가 정보</FormLabel>
          <VStack spacing={3} align="stretch">
            <Box>
              <FormLabel fontSize="sm">담당자 이름</FormLabel>
              <Input
                {...register("extra.manager.name")}
                placeholder="담당자 이름"
              />
            </Box>
            <Box>
              <FormLabel fontSize="sm">담당자 연락처</FormLabel>
              <Input
                {...register("extra.manager.tel")}
                placeholder="담당자 연락처"
              />
            </Box>
            <Box>
              <FormLabel fontSize="sm">참가비</FormLabel>
              <Input
                {...register("extra.fee")}
                type="number"
                placeholder="참가비"
              />
            </Box>
            <Box>
              <FormLabel fontSize="sm">카테고리</FormLabel>
              <Input {...register("extra.category")} placeholder="카테고리" />
            </Box>
          </VStack>
        </FormControl>

        <HStack justify="flex-end" spacing={4} pt={4}>
          <Button onClick={onCancel}>취소</Button>
          <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
            {schedule ? "수정" : "등록"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
