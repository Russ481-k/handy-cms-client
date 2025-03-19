"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Card,
  Button,
} from "@chakra-ui/react";
import {
  FaLeaf,
  FaSprayCan,
  FaStore,
  FaBuilding,
  FaAtom,
  FaSpa,
  FaShieldAlt,
  FaClock,
  FaChartLine,
  FaGlobeAsia,
  FaHeart,
  FaHandHoldingHeart,
  FaCheck,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";
import Link from "next/link";
import { ArrowLeftIcon } from "@chakra-ui/icons";

const companyData = {
  id: 4,
  name: "세로라 (SEROLA)",
  slogan: "친환경·저자극 탈취 방향제로 건강하고 쾌적한 생활을 선물합니다",
  introduction: `세로라는 실리카 나노 기술을 활용하여 친환경·저자극 탈취 방향제를 개발·제조하는 기업입니다. 건강과 환경을 동시에 고려하는 ESG 경영을 추구하며, 가족·반려동물 등 다양한 라이프스타일에 안전하고 쾌적한 환경을 제공하고자 합니다. '악취를 단순히 감추는 것'이 아니라 냄새의 근본 원인을 분해·제거하는 혁신적인 솔루션으로 시장에 도전하고 있습니다.`,
  services: [
    {
      title: "실리카 나노 탈취 방향제",
      description:
        "나노 구조를 활용해 장기간 탈취 효과와 웰니스 향기를 동시에 제공. 무독성·저자극 포뮬러로 아이나 반려동물도 안전하게 사용 가능. 친환경 인증을 추진하며 지속 가능한 제품 라인업 확대 계획",
      icon: FaSprayCan,
    },
    {
      title: "B2C 판매 채널",
      description:
        "온라인 플랫폼(자사몰, 오픈마켓) 및 라이프스타일 편집샵(올리브영, 시코르 등) 입점. 체험단 및 SNS 마케팅으로 실제 사용자 중심의 바이럴 효과 극대화",
      icon: FaStore,
    },
    {
      title: "B2B 공급 채널",
      description:
        "호텔·리조트 납품, 공유 오피스, 반려동물 호텔 등에 제품 제공. 업무·여가·숙박 공간에서 쾌적한 공기 질 및 향기 환경을 조성",
      icon: FaBuilding,
    },
  ],
  features: [
    {
      title: "실리카 나노 구조",
      description:
        "냄새 분자의 흡착·분해 기술로 근본적 탈취 실현. 친환경적 소재 활용으로 안전성 및 지속 가능성 확보",
      icon: FaAtom,
    },
    {
      title: "웰니스 향기",
      description: "숙면 촉진, 집중력 향상, 스트레스 완화 등 감각적 효능 제공",
      icon: FaSpa,
    },
    {
      title: "저자극 포뮬러",
      description:
        "인체 무해·반려동물 안전을 고려한 성분 설계. 알레르기 반응 최소화, 민감 피부·호흡기에도 부담이 적음",
      icon: FaShieldAlt,
    },
    {
      title: "지속적 효과",
      description: "장기간 탈취 기능 유지. 교체 주기가 길어 경제성 우수",
      icon: FaClock,
    },
  ],
  vision: [
    {
      title: "ESG 브랜드로 성장",
      description: "지속 가능한 라이프스타일을 선도하는 ESG 브랜드로 성장",
      icon: FaLeaf,
    },
    {
      title: "매출 목표 달성",
      description:
        "2025년 2억 원, 2026년 5억 원 매출 목표 달성을 통한 국내 시장 안정화",
      icon: FaChartLine,
    },
    {
      title: "글로벌 시장 진출",
      description: "해외 시장 진출로 글로벌 친환경 제품 시장 공략",
      icon: FaGlobeAsia,
    },
    {
      title: "브랜드 가치 제고",
      description:
        "다각적 마케팅(SNS, 체험단, 바이럴)으로 브랜드 인지도·신뢰도 제고",
      icon: FaHeart,
    },
    {
      title: "토털 웰니스 솔루션",
      description:
        "소비자에게 안전, 건강, 환경을 모두 만족시키는 토털 웰니스 솔루션을 제공",
      icon: FaHandHoldingHeart,
    },
  ],
};

export default function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Container maxW="container.xl" py={16}>
      <VStack gap={8} align="stretch">
        <HStack>
          <Link href="/companies">
            <Icon as={ArrowLeftIcon} />
            목록으로
          </Link>
        </HStack>

        <Card.Root
          bg={isDark ? "gray.800" : "white"}
          borderWidth="1px"
          borderColor={isDark ? "gray.700" : "gray.200"}
          boxShadow="lg"
        >
          <Card.Body gap={6}>
            <Box
              w="100%"
              h="400px"
              bg={isDark ? "gray.700" : "gray.100"}
              borderRadius="lg"
            />
            <VStack align="start" gap={4}>
              <Heading size="xl" color={isDark ? "white" : "gray.800"}>
                기업명 {params.id}
              </Heading>
              <Text fontSize="lg" color={isDark ? "gray.300" : "gray.600"}>
                기업 소개 내용이 들어갈 자리입니다. 기업의 주요 서비스나 제품에
                대한 자세한 설명을 작성할 수 있습니다.
              </Text>
              <Text fontSize="lg" color={isDark ? "gray.300" : "gray.600"}>
                기업의 비전과 미션, 주요 기술력, 팀 구성 등 다양한 정보를 포함할
                수 있습니다.
              </Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
