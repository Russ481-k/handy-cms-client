import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Button,
  useDisclosure,
  Text,
  Flex,
  Select,
  Input,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Schedule, ScheduleStatus } from "../../types";

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (scheduleId: number) => void;
  onToggleDisplay: (schedule: Schedule) => void;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
  currentPage: number;
  totalPages: number;
}

const StatusBadge: React.FC<{ status: ScheduleStatus }> = ({ status }) => {
  const statusProps = {
    UPCOMING: { colorScheme: "blue", label: "예정" },
    ONGOING: { colorScheme: "green", label: "진행중" },
    ENDED: { colorScheme: "gray", label: "종료" },
    HIDDEN: { colorScheme: "red", label: "숨김" },
  }[status];

  return (
    <Badge colorScheme={statusProps.colorScheme}>{statusProps.label}</Badge>
  );
};

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onEdit,
  onDelete,
  onToggleDisplay,
  onPageChange,
  onSortChange,
  currentPage,
  totalPages,
}) => {
  return (
    <Box>
      <Flex justify="space-between" mb={4}>
        <HStack spacing={4}>
          <Select
            placeholder="정렬 기준"
            onChange={(e) => onSortChange(e.target.value)}
            w="200px"
          >
            <option value="+startTime">시작 시간 ↑</option>
            <option value="-startTime">시작 시간 ↓</option>
            <option value="+title">제목 ↑</option>
            <option value="-title">제목 ↓</option>
          </Select>
          <Input placeholder="검색어를 입력하세요" w="300px" />
        </HStack>
        <Button colorScheme="blue">새 일정 등록</Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>상태</Th>
            <Th>제목</Th>
            <Th>일시</Th>
            <Th>장소</Th>
            <Th>등록자</Th>
            <Th>최종 수정</Th>
            <Th>관리</Th>
          </Tr>
        </Thead>
        <Tbody>
          {schedules.map((schedule) => (
            <Tr key={schedule.id}>
              <Td>
                <HStack spacing={2}>
                  <StatusBadge status={schedule.status as ScheduleStatus} />
                  {schedule.color && (
                    <Box w="3" h="3" borderRadius="full" bg={schedule.color} />
                  )}
                </HStack>
              </Td>
              <Td maxW="300px" isTruncated>
                <Text>{schedule.title}</Text>
              </Td>
              <Td whiteSpace="nowrap">
                {format(new Date(schedule.startTime), "MM.dd HH:mm", {
                  locale: ko,
                })}
                <br />
                {format(new Date(schedule.endTime), "MM.dd HH:mm", {
                  locale: ko,
                })}
              </Td>
              <Td>{schedule.place}</Td>
              <Td>
                <Text fontSize="sm">
                  {schedule.createdBy}
                  <br />
                  <Text as="span" color="gray.500">
                    {format(new Date(schedule.createdAt!), "yy.MM.dd HH:mm")}
                  </Text>
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.500">
                  {format(new Date(schedule.updatedAt!), "yy.MM.dd HH:mm")}
                </Text>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="일정 수정"
                    icon={<FiEdit2 />}
                    size="sm"
                    onClick={() => onEdit(schedule)}
                  />
                  <IconButton
                    aria-label={schedule.displayYn ? "숨김 처리" : "표시 처리"}
                    icon={schedule.displayYn ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    onClick={() => onToggleDisplay(schedule)}
                  />
                  <IconButton
                    aria-label="일정 삭제"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => onDelete(schedule.id!)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="center" mt={4}>
        <HStack spacing={2}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "solid" : "outline"}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};
