"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import {
  FaBuilding,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";
import { useColors } from "@/styles/theme";

export default function VisionPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();

  const cardStyles = {
    bg: isDark ? "gray.800" : "white",
    borderWidth: "1px",
    borderColor: isDark ? "gray.700" : "gray.200",
    boxShadow: "lg",
    transition: "all 0.3s",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: "xl",
    },
    overflow: "hidden",
  };

  const iconStyles = {
    w: 10,
    h: 10,
    mb: 3,
    p: 3,
    borderRadius: "xl",
    bg: isDark ? "gray.700" : "gray.50",
    boxShadow: "md",
    transition: "all 0.3s",
    _groupHover: {
      transform: "scale(1.1)",
    },
  };

  const infoItemStyles = {
    display: "flex",
    alignItems: "center",
    gap: 3,
    p: 3,
    borderRadius: "lg",
    bg: isDark ? "gray.700" : "gray.50",
    mb: 2,
    transition: "all 0.2s",
    _hover: {
      transform: "translateX(4px)",
      bg: isDark ? "gray.600" : "gray.100",
    },
  };

  const sectionTitleStyles = {
    fontSize: "xl",
    fontWeight: "bold",
    mb: 4,
    color: isDark ? "white" : "gray.800",
    position: "relative",
    _after: {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      left: 0,
      width: "40px",
      height: "3px",
      bg: colors.primary.light,
      borderRadius: "full",
    },
  };

  return (
    <Container maxW="container.xl" pb={16}>
      <VStack gap={12} align="stretch">
        <Box textAlign="center">
          <Badge
            colorScheme="blue"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
            mb={4}
          >
            부산창업가꿈 해운대
          </Badge>
          <Heading
            as="h1"
            size="4xl"
            mb={4}
            bgGradient={colors.gradient.primary}
            bgClip="text"
          >
            비전과 목표
          </Heading>
          <Text fontSize="lg" color={isDark ? "gray.300" : "gray.600"}>
            청년 창업의 새로운 지평을 열어갑니다
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Card.Root {...cardStyles}>
            <Card.Body>
              <VStack align="start" gap={4}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  mb={2}
                  role="group"
                >
                  <Icon as={FaLightbulb} color="blue.500" {...iconStyles} />
                  <Heading size="lg">사업 개요</Heading>
                </Box>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  부산 해운대구에 위치한 청년 창업 주거 복합단지로, 창업 공간과
                  주거 공간이 통합된 혁신적인 형태의 창업 생태계를 구축합니다.
                </Text>
                <Box w="full">
                  <Box {...infoItemStyles}>
                    <Icon as={FaChartLine} color="blue.500" />
                    <Text fontWeight="medium">위치: 부산 해운대구</Text>
                  </Box>
                  <Box {...infoItemStyles}>
                    <Icon as={FaBuilding} color="blue.500" />
                    <Text fontWeight="medium">규모: 1,000㎡</Text>
                  </Box>
                  <Box {...infoItemStyles}>
                    <Icon as={FaUsers} color="blue.500" />
                    <Text fontWeight="medium">수용인원: 50명</Text>
                  </Box>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root {...cardStyles}>
            <Card.Body>
              <VStack align="start" gap={4}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  mb={2}
                  role="group"
                >
                  <Icon as={FaHandshake} color="purple.500" {...iconStyles} />
                  <Heading size="lg">운영 조직</Heading>
                </Box>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  전문적인 운영 조직을 통해 체계적인 창업 지원과 관리 서비스를
                  제공합니다.
                </Text>
                <Box w="full">
                  <Box {...infoItemStyles}>
                    <Icon as={FaUsers} color="purple.500" />
                    <Text fontWeight="medium">운영기관: 부산창업가꿈</Text>
                  </Box>
                  <Box {...infoItemStyles}>
                    <Icon as={FaChartLine} color="purple.500" />
                    <Text fontWeight="medium">운영기간: 2024.01 ~ 2024.12</Text>
                  </Box>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Box>
          <Heading {...sectionTitleStyles} textAlign="center">
            주요 목표
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaUsers} color="blue.500" {...iconStyles} />
                    <Heading size="md">청년 창업 지원</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업 공간과 주거 공간을 통합 제공하여 청년 창업가들의
                    안정적인 창업 환경 조성
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaBuilding} color="purple.500" {...iconStyles} />
                    <Heading size="md">창업 생태계 구축</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업가 간 네트워크 형성과 협력 체계 구축을 통한 지속 가능한
                    창업 생태계 조성
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaChartLine} color="green.500" {...iconStyles} />
                    <Heading size="md">지역 경제 활성화</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업 기업의 성장과 일자리 창출을 통한 지역 경제 활성화 기여
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading {...sectionTitleStyles} textAlign="center">
            공간 구성
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaBuilding} color="blue.500" {...iconStyles} />
                    <Heading size="md">창업 공간</Heading>
                  </Box>
                  <Box w="full">
                    <Box {...infoItemStyles}>
                      <Icon as={FaBuilding} color="blue.500" />
                      <Text fontWeight="medium">공동 작업실</Text>
                    </Box>
                    <Box {...infoItemStyles}>
                      <Icon as={FaUsers} color="blue.500" />
                      <Text fontWeight="medium">미팅룸</Text>
                    </Box>
                    <Box {...infoItemStyles}>
                      <Icon as={FaChartLine} color="blue.500" />
                      <Text fontWeight="medium">창업 지원 센터</Text>
                    </Box>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaUsers} color="purple.500" {...iconStyles} />
                    <Heading size="md">주거 공간</Heading>
                  </Box>
                  <Box w="full">
                    <Box {...infoItemStyles}>
                      <Icon as={FaUsers} color="purple.500" />
                      <Text fontWeight="medium">원룸형 주거시설</Text>
                    </Box>
                    <Box {...infoItemStyles}>
                      <Icon as={FaBuilding} color="purple.500" />
                      <Text fontWeight="medium">공용 주방</Text>
                    </Box>
                    <Box {...infoItemStyles}>
                      <Icon as={FaHandshake} color="purple.500" />
                      <Text fontWeight="medium">휴게 공간</Text>
                    </Box>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading {...sectionTitleStyles} textAlign="center">
            기대 효과
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaUsers} color="blue.500" {...iconStyles} />
                    <Heading size="md">창업 성공률 향상</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    통합 지원 시스템을 통한 창업 성공률 20% 이상 향상
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaChartLine} color="purple.500" {...iconStyles} />
                    <Heading size="md">일자리 창출</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    연간 100개 이상의 신규 일자리 창출
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root {...cardStyles}>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={2}
                    role="group"
                  >
                    <Icon as={FaBuilding} color="green.500" {...iconStyles} />
                    <Heading size="md">지역 경제 활성화</Heading>
                  </Box>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    연간 10억원 이상의 지역 경제 파급 효과
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
