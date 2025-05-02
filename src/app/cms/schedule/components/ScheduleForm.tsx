import React from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Textarea,
  Field as ChakraField,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { Schedule, ScheduleFormData } from "../types";
import { useForm } from "react-hook-form";
import { useColors } from "@/styles/theme";

interface ScheduleFormProps {
  schedule?: Schedule;
  onSubmit: (data: ScheduleFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  onSubmit,
  isSubmitting,
  onCancel,
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
          descriptionHtml: schedule.descriptionHtml,
          startTime: schedule.startTime.slice(0, 16), // YYYY-MM-DDTHH:mm
          endTime: schedule.endTime.slice(0, 16),
          place: schedule.place,
          displayYn: schedule.displayYn,
          color: schedule.color,
          extra: schedule.extra,
        }
      : {
          displayYn: true,
        },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" gap={4}>
        <ChakraField.Root invalid={!!errors.title}>
          <ChakraField.Label>제목</ChakraField.Label>
          <Input
            {...register("title", { required: "제목을 입력해주세요" })}
            placeholder="일정 제목"
          />
          {errors.title && (
            <ChakraField.ErrorText>
              {errors.title.message}
            </ChakraField.ErrorText>
          )}
        </ChakraField.Root>

        <ChakraField.Root>
          <ChakraField.Label>상세 내용</ChakraField.Label>
          <Textarea
            {...register("descriptionHtml")}
            placeholder="일정 상세 내용"
            rows={5}
          />
        </ChakraField.Root>

        <Stack direction="row" gap={4}>
          <ChakraField.Root invalid={!!errors.startTime}>
            <ChakraField.Label>시작 시간</ChakraField.Label>
            <Input
              {...register("startTime", {
                required: "시작 시간을 선택해주세요",
              })}
              type="datetime-local"
            />
            {errors.startTime && (
              <ChakraField.ErrorText>
                {errors.startTime.message}
              </ChakraField.ErrorText>
            )}
          </ChakraField.Root>

          <ChakraField.Root invalid={!!errors.endTime}>
            <ChakraField.Label>종료 시간</ChakraField.Label>
            <Input
              {...register("endTime", { required: "종료 시간을 선택해주세요" })}
              type="datetime-local"
            />
            {errors.endTime && (
              <ChakraField.ErrorText>
                {errors.endTime.message}
              </ChakraField.ErrorText>
            )}
          </ChakraField.Root>
        </Stack>

        <ChakraField.Root>
          <ChakraField.Label>장소</ChakraField.Label>
          <Input {...register("place")} placeholder="장소" />
        </ChakraField.Root>

        <ChakraField.Root>
          <ChakraField.Label>색상</ChakraField.Label>
          <Input {...register("color")} type="color" w="100px" h="40px" p={1} />
        </ChakraField.Root>

        <ChakraField.Root>
          <ChakraField.Label>공개 여부</ChakraField.Label>
          <ChakraSwitch.Root {...register("displayYn")} defaultChecked>
            <ChakraSwitch.HiddenInput />
            <ChakraSwitch.Control>
              <ChakraSwitch.Thumb />
            </ChakraSwitch.Control>
          </ChakraSwitch.Root>
        </ChakraField.Root>

        <Box
          borderWidth="1px"
          borderColor={colors.border}
          p={4}
          borderRadius="md"
        >
          <ChakraField.Root>
            <ChakraField.Label>추가 정보</ChakraField.Label>
            <Stack direction="column" gap={4}>
              <Stack direction="row" gap={4}>
                <ChakraField.Root>
                  <ChakraField.Label>담당자 이름</ChakraField.Label>
                  <Input
                    {...register("extra.manager.name")}
                    placeholder="담당자 이름"
                    size="sm"
                  />
                </ChakraField.Root>
                <ChakraField.Root>
                  <ChakraField.Label>담당자 연락처</ChakraField.Label>
                  <Input
                    {...register("extra.manager.tel")}
                    placeholder="담당자 연락처"
                    size="sm"
                  />
                </ChakraField.Root>
              </Stack>

              <Stack direction="row" gap={4}>
                <ChakraField.Root>
                  <ChakraField.Label>참가비</ChakraField.Label>
                  <Input
                    {...register("extra.fee", {
                      setValueAs: (v) =>
                        v === "" ? undefined : parseInt(v, 10),
                    })}
                    type="number"
                    placeholder="참가비"
                    size="sm"
                  />
                </ChakraField.Root>
                <ChakraField.Root>
                  <ChakraField.Label>카테고리</ChakraField.Label>
                  <Input
                    {...register("extra.category")}
                    placeholder="카테고리"
                    size="sm"
                  />
                </ChakraField.Root>
              </Stack>
            </Stack>
          </ChakraField.Root>
        </Box>

        <Button
          mt={4}
          colorScheme="blue"
          loading={isSubmitting}
          type="submit"
          size="lg"
        >
          {schedule ? "일정 수정" : "일정 등록"}
        </Button>
        <Button mt={4} variant="outline" onClick={onCancel} size="lg">
          취소
        </Button>
      </Stack>
    </Box>
  );
};
