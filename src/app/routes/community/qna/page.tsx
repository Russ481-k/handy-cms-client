"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  Stack,
  Badge,
  Separator,
} from "@chakra-ui/react";

const questions = [
  {
    id: 1,
    title: "창업가꿈 프로그램 지원 자격이 어떻게 되나요?",
    content:
      "현재 예비창업자입니다. 창업가꿈 프로그램에 지원하고 싶은데 자격 요건이 어떻게 되는지 궁금합니다.",
    author: "예비창업자",
    date: "2024-03-15",
    status: "답변완료",
    answer: {
      content:
        "창업가꿈 프로그램은 예비창업자 및 3년 이내 초기 스타트업을 대상으로 합니다. 구체적인 지원 자격은 다음과 같습니다:\n\n1. 예비창업자의 경우:\n- 창업 아이디어 또는 사업계획을 보유한 자\n- 프로그램 종료 후 6개월 이내 창업 가능한 자\n\n2. 초기 스타트업의 경우:\n- 창업 3년 이내 기업\n- 혁신적인 사업모델을 보유한 기업\n\n자세한 내용은 모집공고 페이지를 참고해 주시기 바랍니다.",
      author: "운영자",
      date: "2024-03-15",
    },
  },
  {
    id: 2,
    title: "프로그램 진행 기간 동안 다른 일을 병행할 수 있나요?",
    content: "현재 직장인인데, 퇴사하지 않고 프로그램에 참여할 수 있을까요?",
    author: "직장인",
    date: "2024-03-14",
    status: "답변대기",
    answer: null,
  },
  {
    id: 3,
    title: "교육 프로그램은 어떤 방식으로 진행되나요?",
    content: "교육이 오프라인으로만 진행되나요? 온라인 참여도 가능한가요?",
    author: "관심있음",
    date: "2024-03-13",
    status: "답변완료",
    answer: {
      content:
        "교육 프로그램은 온/오프라인 하이브리드 방식으로 진행됩니다.\n\n1. 오프라인 교육 (주 1회)\n- 실습 위주의 워크샵\n- 멘토링 세션\n- 네트워킹 활동\n\n2. 온라인 교육 (상시)\n- 온라인 강의 컨텐츠\n- 화상 멘토링\n- 온라인 커뮤니티 활동\n\n핵심 프로그램의 경우 오프라인 참석을 권장드리며, 불가피한 경우 온라인 참여가 가능합니다.",
      author: "운영자",
      date: "2024-03-13",
    },
  },
];

export default function QnaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          답변게시판
        </Heading>
        <Text color="gray.600" fontSize="lg">
          창업가꿈 프로그램에 대해 궁금한 점을 질문해주세요.
        </Text>
      </Box>

      <Box mb={8}>
        <Stack direction={{ base: "column", md: "row" }} gap={4}>
          <Input
            placeholder="질문 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            flex={1}
          />
          <Button colorScheme="blue">질문하기</Button>
        </Stack>
      </Box>

      <Stack gap={6}>
        {filteredQuestions.map((question) => (
          <Box
            key={question.id}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            transition="all 0.3s"
            _hover={{ shadow: "md" }}
          >
            <Box mb={4}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Heading as="h3" size="md">
                  {question.title}
                </Heading>
                <Badge
                  colorScheme={
                    question.status === "답변완료" ? "green" : "orange"
                  }
                >
                  {question.status}
                </Badge>
              </Box>
              <Text color="gray.600" mb={2}>
                {question.content}
              </Text>
              <Text fontSize="sm" color="gray.500">
                작성자: {question.author} | 작성일: {question.date}
              </Text>
            </Box>

            {question.answer && (
              <>
                <Separator my={4} />
                <Box pl={4} borderLeftWidth={2} borderColor="blue.200">
                  <Text mb={2} whiteSpace="pre-wrap">
                    {question.answer.content}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    답변자: {question.answer.author} | 답변일:{" "}
                    {question.answer.date}
                  </Text>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Stack>

      {filteredQuestions.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.600">
            검색 결과가 없습니다.
          </Text>
        </Box>
      )}
    </Container>
  );
}
