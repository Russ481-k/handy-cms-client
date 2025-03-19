"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { FaBuilding, FaLightbulb, FaStar, FaChartLine } from "react-icons/fa";
import { IconType } from "react-icons/lib";
interface CompanyInfo {
  id: number;
  name: string;
  keywords: string[];
  business: string;
  features: string;
  vision: string;
  icon: IconType;
  color: string;
}

const companies: CompanyInfo[] = [
  {
    id: 1,
    name: "오늘의 이야기 (주)",
    keywords: ["외국인 관광객", "디지털 사이니지", "AI 맞춤 추천"],
    business: "호텔·랜드마크 디지털 광고, 관광상품 자사몰(TRIT)",
    features: "크리에이터 협업, 온·오프라인 연계, 데이터 기반 마케팅",
    vision: "국내 주요 관광도시 확장, 글로벌 진출",
    icon: FaBuilding,
    color: "blue",
  },
  {
    id: 2,
    name: "주식회사 유니마스(UniMAS)",
    keywords: ["크로스보더 셀링", "AI 번역·통관", "해외 이커머스"],
    business: "통합 마켓 관리, 자동 번역 & CS, 해외 물류·통관 자동화",
    features: "도쿄 물류창고 운영, 25년 이커머스 노하우, 맞춤 요금제",
    vision: "글로벌 플랫폼 확장(중국·동남아), AI 고도화",
    icon: FaChartLine,
    color: "green",
  },
  {
    id: 3,
    name: "삼선텍(SANSUNTECH)",
    keywords: ["AI·특허 기반", "모바일 키보드 앱(SSKboard)", "생산성"],
    business: "GPT 연동 AI 문장 생성, 스와이프 입력 & 단축어",
    features: "특허 3건 보유, 광고·구독 모델 병행, 시간 절약·효율 극대화",
    vision: "다양한 AI·특허 활용 앱 확장, 선한 가치 실현",
    icon: FaLightbulb,
    color: "purple",
  },
  {
    id: 4,
    name: "세로라 (SEROLA)",
    keywords: ["실리카 나노 기술", "친환경·저자극 탈취", "ESG 경영"],
    business: "실리카 나노 탈취 방향제, B2C(온라인·오프라인) & B2B 채널",
    features: "무독성·저자극 포뮬러, 장기간 탈취 효과, 웰니스 향기",
    vision: "ESG 브랜드 성장, 해외 진출, 토털 웰니스 솔루션 제공",
    icon: FaStar,
    color: "orange",
  },
];

export default function CompanyListPage() {
  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={6}>
          입주기업 리스트
        </Heading>
        <Text fontSize="xl" color="gray.600">
          창업가꿈 4호점의 혁신적인 입주기업들을 소개합니다
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        {companies.map((company) => (
          <Box
            key={company.id}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "lg",
            }}
            transition="all 0.3s"
          >
            <VStack align="stretch" gap={4}>
              <HStack>
                <Icon
                  as={company.icon}
                  w={8}
                  h={8}
                  color={`${company.color}.500`}
                />
                <Heading as="h2" size="lg">
                  {company.name}
                </Heading>
              </HStack>

              <Box>
                {company.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="subtle"
                    colorScheme={company.color}
                    mr={2}
                    mb={2}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {keyword}
                  </Badge>
                ))}
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.700" mb={1}>
                  주요 사업
                </Text>
                <Text color="gray.600">{company.business}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.700" mb={1}>
                  특징
                </Text>
                <Text color="gray.600">{company.features}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" color="gray.700" mb={1}>
                  비전
                </Text>
                <Text color="gray.600">{company.vision}</Text>
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
}
