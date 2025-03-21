"use client";

import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import Image from "next/image";

export default function ParticipantsPage() {
  const companies = [
    {
      name: "오늘의 이야기",
      description: "AI 기반 스토리텔링 플랫폼",
      logo: "/images/companies/todays_story.png",
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
      logo: "/images/companies/samsunteck.png",
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
          2025년 참여기업
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={3}>
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
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={220}
                    height={220}
                    objectFit="contain"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
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
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
