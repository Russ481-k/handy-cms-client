"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  FaGraduationCap,
  FaUsers,
  FaChartLine,
  FaLaptop,
  FaPalette,
  FaHandshake,
  FaRegLightbulb,
  FaHeartbeat,
  FaBullseye,
  FaRegBuilding,
  FaNetworkWired,
  FaRegComments,
} from "react-icons/fa";
import { Card } from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card.Root);

export default function ProgramPage() {
  const colors = useColors();

  const cardBg = colors.cardBg;
  const borderColor = colors.border;
  const textColor = colors.text.primary;
  const headingColor = colors.primary.default;
  const iconColors = {
    green: colors.accent.success.default,
    purple: colors.secondary.default,
    blue: colors.primary.default,
  };

  const cardStyle = {
    bg: cardBg,
    borderWidth: "1px",
    borderColor: borderColor,
    boxShadow: "lg",
    p: 8,
    transition: "all 0.3s ease-in-out",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: "xl",
      borderColor: colors.primary.default,
    },
  };

  const headingStyle = {
    display: "flex",
    alignItems: "center",
    gap: 3,
    mb: 6,
    color: headingColor,
  };

  const subHeadingStyle = {
    display: "flex",
    alignItems: "center",
    gap: 2,
    mb: 4,
    color: headingColor,
  };

  return (
    <Container maxW="container.xl" py={16}>
      <VStack gap={16} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient={colors.gradient.primary}
            bgClip="text"
          >
            창업가꿈 주요프로그램
          </Heading>
          <Text fontSize="xl" color={textColor}>
            성공적인 창업을 위한 체계적인 지원 프로그램
          </Text>
        </MotionBox>

        {/* 1. 갓생 클래쓰 */}
        <MotionCard
          {...cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VStack align="stretch" gap={6}>
            <Heading as="h2" size="xl" {...headingStyle}>
              <Icon as={FaHeartbeat} color={iconColors.blue} boxSize={8} />
              1. 갓생 클래쓰
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaRegLightbulb} color={iconColors.green} />
                  생활 복지 프로그램
                </Heading>
                <Text color={textColor}>
                  창업·주거 외에도 청년들에게 필요한 생활·문화·복지 프로그램
                  제공
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaBullseye} color={iconColors.green} />
                  헬스케어 & 자기계발 지원
                </Heading>
                <Text color={textColor}>
                  건강 관리, 역량 개발 등 연계 프로그램 지원
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </MotionCard>

        {/* 2. 그로우업 Program */}
        <MotionCard
          {...cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <VStack align="stretch" gap={6}>
            <Heading as="h2" size="xl" {...headingStyle}>
              <Icon as={FaChartLine} color={iconColors.blue} boxSize={8} />
              2. 그로우업 (GROW-UP) Program
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaGraduationCap} color={iconColors.purple} />
                  전문 멘토링 & 창업교육
                </Heading>
                <Box gap={2} color={textColor}>
                  <li>• 기술, 마케팅, 회계·법률 등 분야별 전문가 멘토링</li>
                  <li>• 아이디어 검증부터 사업화까지 단계적 창업교육</li>
                </Box>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaPalette} color={iconColors.purple} />
                  BI/CI 및 웹 지원
                </Heading>
                <Text color={textColor}>홈페이지, BI/CI(브랜딩) 제작 지원</Text>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaLaptop} color={iconColors.purple} />
                  맞춤형 진단 & 시제품 제작
                </Heading>
                <Text color={textColor}>
                  청년 창업가의 요구에 맞춘 프로그램 설계 및 시제품 제작
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaUsers} color={iconColors.purple} />
                  소비자 반응조사 & 사업화 패키지 연계
                </Heading>
                <Text color={textColor}>
                  시장 검증 및 후속 지원 프로그램 연계 운영
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </MotionCard>

        {/* 3. 스케일업 Program */}
        <MotionCard
          {...cardStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <VStack align="stretch" gap={6}>
            <Heading as="h2" size="xl" {...headingStyle}>
              <Icon as={FaRegBuilding} color={iconColors.blue} boxSize={8} />
              3. 스케일업 (SCALE-UP) Program
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaNetworkWired} color={iconColors.blue} />
                  정기 네트워킹 & 신기술 Lab 운영
                </Heading>
                <Text color={textColor}>
                  교류·협업을 위한 네트워킹 행사와 신기술 체험 Lab 운영
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaRegComments} color={iconColors.blue} />
                  신기술 체험 공간조성
                </Heading>
                <Box gap={2} color={textColor}>
                  <li>
                    • 청년의 감각으로 재해석한 플래그십 스토어 형태의 복합 문화
                    공간
                  </li>
                  <li>
                    • 특화존 구성: 3D/홀로그램, XR, 라이프스타일, AI 인공지능 등
                  </li>
                </Box>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaHandshake} color={iconColors.blue} />
                  지역 문화 연계 프로그램
                </Heading>
                <Text color={textColor}>
                  지역 행사와의 협업을 통한 참여 독려 및 시너지 창출
                </Text>
              </Box>
              <Box>
                <Heading as="h3" size="md" {...subHeadingStyle}>
                  <Icon as={FaChartLine} color={iconColors.blue} />
                  투자(엑셀러레이팅) 아카데미
                </Heading>
                <Text color={textColor}>
                  투자유치 기회 제공 및 전문가 네트워크 연계
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </MotionCard>
      </VStack>
    </Container>
  );
}
