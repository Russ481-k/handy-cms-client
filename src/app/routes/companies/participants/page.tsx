"use client";

import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";

export default function ParticipantsPage() {
  const companies = [
    {
      name: "오늘의 이야기",
      description: "AI 기반 스토리텔링 플랫폼",
      logo: "/images/companies/today-story.png",
      industry: "콘텐츠/미디어",
      year: "2023",
    },
    {
      name: "유니마스",
      description: "친환경 마스크 제조 기업",
      logo: "/images/companies/unimas.png",
      industry: "제조/바이오",
      year: "2023",
    },
    {
      name: "삼선택",
      description: "식자재 유통 플랫폼",
      logo: "/images/companies/samseontaek.png",
      industry: "푸드테크",
      year: "2023",
    },
    {
      name: "세로라",
      description: "반려동물 헬스케어 서비스",
      logo: "/images/companies/serora.png",
      industry: "펫테크",
      year: "2023",
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          참여기업
        </Heading>
        <Text color="gray.600" fontSize="lg">
          창업가꿈과 함께 성장하는 혁신 기업들을 소개합니다.
        </Text>
      </Box>

      <Box mb={12}>
        <Heading as="h2" size="xl" mb={6}>
          2023년 참여기업
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
          {companies.map((company, index) => (
            <Box
              key={index}
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="md"
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "lg",
              }}
            >
              <Box
                height="200px"
                mb={4}
                bg="gray.100"
                borderRadius="md"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box as="span" fontSize="lg" color="gray.500">
                  로고 이미지
                </Box>
              </Box>
              <Heading as="h3" size="lg" mb={2}>
                {company.name}
              </Heading>
              <Text color="gray.600" mb={4}>
                {company.description}
              </Text>
              <Box>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  <strong>산업분야:</strong> {company.industry}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  <strong>선정연도:</strong> {company.year}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box p={8} bg="blue.50" borderRadius="lg">
        <Heading as="h2" size="lg" mb={6}>
          참여기업 성과
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          <Box p={6} bg="white" borderRadius="lg" textAlign="center">
            <Heading as="h3" size="xl" color="blue.500" mb={2}>
              15+
            </Heading>
            <Text fontSize="lg">누적 참여기업</Text>
          </Box>
          <Box p={6} bg="white" borderRadius="lg" textAlign="center">
            <Heading as="h3" size="xl" color="green.500" mb={2}>
              90%
            </Heading>
            <Text fontSize="lg">기업 생존율</Text>
          </Box>
          <Box p={6} bg="white" borderRadius="lg" textAlign="center">
            <Heading as="h3" size="xl" color="purple.500" mb={2}>
              50억+
            </Heading>
            <Text fontSize="lg">총 투자유치 금액</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  );
}
