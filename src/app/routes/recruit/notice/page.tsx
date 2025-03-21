"use client";

import { useColors } from "@/styles/theme";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function NoticePage() {
  const colors = useColors();
  // const notices = [
  //   {
  //     id: 1,
  //     title: "준비중입니다.",
  //     status: "준비중",
  //     period: "2024.03.01 - 2024.03.31",
  //     target: "예비창업자 및 3년 이내 창업기업",
  //     support: "사업화 자금 최대 5천만원, 멘토링, 사무공간 등",
  //     description:
  //       "혁신적인 아이디어와 기술을 보유한 (예비)창업자를 모집합니다.",
  //   },
  //   {
  //     id: 2,
  //     title: "소셜벤처 특별 모집 공고",
  //     status: "모집예정",
  //     period: "2024.04.01 - 2024.04.30",
  //     target: "사회문제 해결을 위한 비즈니스 모델 보유 기업",
  //     support: "사업화 자금 최대 3천만원, 소셜임팩트 측정 지원 등",
  //     description:
  //       "사회적 가치와 경제적 가치를 동시에 추구하는 소셜벤처를 모집합니다.",
  //   },
  // ];

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4} color={colors.text.primary}>
          모집공고
        </Heading>
        <Text color={colors.text.primary} fontSize="lg">
          창업가꿈에서 진행하는 다양한 모집 프로그램을 확인하세요.
        </Text>
      </Box>
      <Box>
        {/* {notices.map((notice) => (
          <Box
            key={notice.id}
            mb={8}
            p={6}
            bg={colors.cardBg}
            borderRadius="lg"
            shadow="md"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
          >
            <Box display="flex" alignItems="center" mb={4}>
              <Heading as="h2" size="lg" flex="1">
                {notice.title}
              </Heading>
              <Badge
                colorScheme={notice.status === "모집중" ? "green" : "yellow"}
                fontSize="md"
                px={3}
                py={1}
                borderRadius="full"
              >
                {notice.status}
              </Badge>
            </Box>

            <Box mb={6}>
              <Text fontSize="lg" mb={2}>
                <strong>모집기간:</strong> {notice.period}
              </Text>
              <Text fontSize="lg" mb={2}>
                <strong>모집대상:</strong> {notice.target}
              </Text>
              <Text fontSize="lg" mb={4}>
                <strong>지원내용:</strong> {notice.support}
              </Text>
              <Text fontSize="lg" color={colors.text.primary}>
                {notice.description}
              </Text>
            </Box>

            <Box display="flex" gap={4}>
              <Button
                variant="outline"
                bg={colors.primary.default}
                color={colors.text.primary}
                size="lg"
                disabled={notice.status !== "모집중"}
              >
                신청하기
              </Button>
              <Button
                bg={colors.primary.default}
                color={colors.text.primary}
                size="lg"
              >
                상세보기
              </Button>
            </Box>
          </Box>
        ))} */}

        <Heading as="h2" size="lg" mb={4} color={colors.text.primary}>
          준비중입니다...
        </Heading>
      </Box>
      {/* 
      <Box mt={12} p={6} bg={colors.cardBg} borderRadius="lg">
        <Heading as="h3" size="lg" mb={4} color={colors.text.primary}>
          지원 절차
        </Heading>
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          gap={4}
        >
          {["서류접수", "서류심사", "발표심사", "최종선정"].map(
            (step, index) => (
              <Box
                key={index}
                flex="1"
                p={4}
                bg={colors.cardBg}
                borderRadius="md"
                textAlign="center"
                position="relative"
                _after={{
                  content: '""',
                  position: "absolute",
                  right: "-16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "0",
                  height: "0",
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "8px solid",
                  borderLeftColor: colors.primary.default,
                  display: { base: "none", md: index === 3 ? "none" : "block" },
                }}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={colors.primary.default}
                  mb={2}
                >
                  STEP {index + 1}
                </Text>
                <Text fontSize="lg">{step}</Text>
              </Box>
            )
          )}
        </Box>
      </Box> */}
    </Container>
  );
}
