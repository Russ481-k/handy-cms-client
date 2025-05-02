import React from "react";
import { Dialog, Text, Stack, Badge, Box, Separator } from "@chakra-ui/react";
import { Schedule } from "../types";
import { formatDateTime, getStatusColor, getStatusText } from "../utils";
import { useColors } from "@/styles/theme";

interface SchedulePopupProps {
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SchedulePopup: React.FC<SchedulePopupProps> = ({
  schedule,
  isOpen,
  onClose,
}) => {
  const colors = useColors();

  if (!schedule) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Stack direction="row" gap={2}>
              <Text>{schedule.title}</Text>
              <Badge colorScheme={getStatusColor(schedule.status)}>
                {getStatusText(schedule.status)}
              </Badge>
            </Stack>
            <Dialog.CloseTrigger asChild />
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <Stack direction="column" gap={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>
                  일시
                </Text>
                <Text>
                  {formatDateTime(schedule.startTime)} ~{" "}
                  {formatDateTime(schedule.endTime)}
                </Text>
              </Box>

              {schedule.place && (
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    장소
                  </Text>
                  <Text>{schedule.place}</Text>
                </Box>
              )}

              {schedule.descriptionHtml && (
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    상세 내용
                  </Text>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: schedule.descriptionHtml,
                    }}
                    css={{
                      "& p": { margin: 0 },
                      "& ul, & ol": { paddingLeft: "1rem" },
                    }}
                  />
                </Box>
              )}

              {schedule.extra && (
                <>
                  <Separator />
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      추가 정보
                    </Text>
                    <Stack direction="column" gap={2}>
                      {schedule.extra.manager && (
                        <Box>
                          <Text fontSize="sm" color={colors.text.secondary}>
                            담당자
                          </Text>
                          <Stack direction="row">
                            <Text>{schedule.extra.manager.name}</Text>
                            <Text color={colors.text.secondary}>
                              {schedule.extra.manager.tel}
                            </Text>
                          </Stack>
                        </Box>
                      )}
                      {schedule.extra.fee !== undefined && (
                        <Box>
                          <Text fontSize="sm" color={colors.text.secondary}>
                            참가비
                          </Text>
                          <Text>{schedule.extra.fee.toLocaleString()}원</Text>
                        </Box>
                      )}
                      {schedule.extra.category && (
                        <Box>
                          <Text fontSize="sm" color={colors.text.secondary}>
                            카테고리
                          </Text>
                          <Text>{schedule.extra.category}</Text>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
