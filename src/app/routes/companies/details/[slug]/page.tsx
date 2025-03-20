"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import NextImage from "next/image";

const companyData = {
  "today-story": {
    name: "오늘의 이야기",
    description: "AI 기반 스토리텔링 플랫폼",
    longDescription:
      "오늘의 이야기는 인공지능 기술을 활용하여 개인화된 스토리텔링 경험을 제공하는 플랫폼입니다. 사용자의 취향과 관심사를 분석하여 맞춤형 콘텐츠를 추천하고, 창작자들에게는 효율적인 콘텐츠 제작 도구를 제공합니다.",
    industry: "콘텐츠/미디어",
    foundedYear: "2022",
    teamSize: "15명",
    logo: "/images/companies/today-story.png",
    mainImage: "/images/companies/today-story-main.jpg",
    features: [
      "AI 기반 콘텐츠 추천 시스템",
      "크리에이터 협업 플랫폼",
      "맞춤형 콘텐츠 제작 도구",
      "실시간 독자 반응 분석",
    ],
    website: "https://today-story.com",
  },
  unimas: {
    name: "유니마스",
    description: "친환경 마스크 제조 기업",
    longDescription:
      "유니마스는 지속가능한 미래를 위한 친환경 마스크를 개발하고 제조하는 기업입니다. 생분해성 소재를 활용한 혁신적인 제품으로 환경보호와 건강을 동시에 고려합니다.",
    industry: "제조/바이오",
    foundedYear: "2021",
    teamSize: "25명",
    logo: "/images/companies/unimas.png",
    mainImage: "/images/companies/unimas-main.jpg",
    features: [
      "생분해성 마스크 소재 개발",
      "항균 필터 시스템",
      "편안한 착용감 설계",
      "지속가능한 패키징",
    ],
    website: "https://unimas.co.kr",
  },
  samseontaek: {
    name: "삼선택",
    description: "식자재 유통 플랫폼",
    longDescription:
      "삼선택은 식당과 식자재 공급업체를 연결하는 B2B 플랫폼입니다. AI 기반 수요 예측과 실시간 재고 관리 시스템으로 식자재 유통의 효율성을 높이고 음식점의 운영 비용을 절감합니다.",
    industry: "푸드테크",
    foundedYear: "2021",
    teamSize: "20명",
    logo: "/images/companies/samseontaek.png",
    mainImage: "/images/companies/samseontaek-main.jpg",
    features: [
      "AI 수요 예측 시스템",
      "실시간 재고 관리",
      "자동 발주 시스템",
      "식자재 품질 관리",
    ],
    website: "https://samseontaek.com",
  },
  serora: {
    name: "세로라",
    description: "반려동물 헬스케어 서비스",
    longDescription:
      "세로라는 반려동물의 건강한 삶을 위한 종합 헬스케어 서비스를 제공합니다. IoT 기기와 AI 분석을 통해 반려동물의 건강 상태를 모니터링하고, 맞춤형 건강 관리 솔루션을 제공합니다.",
    industry: "펫테크",
    foundedYear: "2022",
    teamSize: "18명",
    logo: "/images/companies/serora.png",
    mainImage: "/images/companies/serora-main.jpg",
    features: [
      "24/7 건강 모니터링",
      "AI 기반 질병 예측",
      "맞춤형 영양 관리",
      "전문가 상담 서비스",
    ],
    website: "https://serora.kr",
  },
};

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const company = companyData[slug as keyof typeof companyData];

  if (!company) {
    return (
      <Container maxW="container.xl" py={10}>
        <Heading>기업을 찾을 수 없습니다</Heading>
        <Text mt={4}>요청하신 기업 정보를 찾을 수 없습니다.</Text>
        <NextLink href="/companies/participants" passHref>
          <Button mt={4}>참여기업 목록으로 돌아가기</Button>
        </NextLink>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Box
          height="300px"
          position="relative"
          mb={6}
          borderRadius="lg"
          overflow="hidden"
        >
          <NextImage
            src={company.mainImage}
            alt={`${company.name} 대표 이미지`}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Box display="flex" alignItems="center" mb={6}>
          <Box
            width="100px"
            height="100px"
            borderRadius="lg"
            overflow="hidden"
            mr={6}
            position="relative"
          >
            <NextImage
              src={company.logo}
              alt={`${company.name} 로고`}
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box>
            <Heading as="h1" size="2xl" mb={2}>
              {company.name}
            </Heading>
            <Text fontSize="xl" color="gray.600">
              {company.description}
            </Text>
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={12}>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              기업 소개
            </Heading>
            <Text fontSize="lg" whiteSpace="pre-wrap">
              {company.longDescription}
            </Text>
          </Box>
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              기업 정보
            </Heading>
            <Box>
              <Text fontSize="lg" mb={2}>
                <strong>산업분야:</strong> {company.industry}
              </Text>
              <Text fontSize="lg" mb={2}>
                <strong>설립연도:</strong> {company.foundedYear}
              </Text>
              <Text fontSize="lg" mb={2}>
                <strong>팀 규모:</strong> {company.teamSize}
              </Text>
              <Text fontSize="lg" mb={2}>
                <strong>웹사이트:</strong>{" "}
                <NextLink
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </NextLink>
              </Text>
            </Box>
          </Box>
        </SimpleGrid>

        <Box>
          <Heading as="h2" size="lg" mb={6}>
            주요 특징
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {company.features.map((feature, index) => (
              <Box
                key={index}
                p={6}
                bg="blue.50"
                borderRadius="lg"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              >
                <Text fontSize="lg">{feature}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  );
}
