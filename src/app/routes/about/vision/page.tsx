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
} from "@chakra-ui/react";
import {
  FaBuilding,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaChartLine,
} from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";

export default function VisionPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Container maxW="container.xl" py={16}>
      <VStack gap={12} align="stretch">
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
          >
            비전과 목표
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            부산창업가꿈 해운대는 청년 창업의 새로운 지평을 열어갑니다
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body>
              <VStack align="start" gap={4}>
                <Icon as={FaLightbulb} w={8} h={8} color="blue.500" />
                <Heading size="lg">사업 개요</Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  부산 해운대구에 위치한 청년 창업 주거 복합단지로, 창업 공간과
                  주거 공간이 통합된 혁신적인 형태의 창업 생태계를 구축합니다.
                </Text>
                <Box gap={2}>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaChartLine} color="blue.500" />
                    <Text>위치: 부산 해운대구</Text>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaBuilding} color="blue.500" />
                    <Text>규모: 1,000㎡</Text>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaUsers} color="blue.500" />
                    <Text>수용인원: 50명</Text>
                  </Box>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body>
              <VStack align="start" gap={4}>
                <Icon as={FaHandshake} w={8} h={8} color="purple.500" />
                <Heading size="lg">운영 조직</Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  전문적인 운영 조직을 통해 체계적인 창업 지원과 관리 서비스를
                  제공합니다.
                </Text>
                <Box gap={2}>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaUsers} color="purple.500" />
                    <Text>운영기관: 부산창업가꿈</Text>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Icon as={FaChartLine} color="purple.500" />
                    <Text>운영기간: 2024.01 ~ 2024.12</Text>
                  </Box>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Box>
          <Heading size="xl" mb={6} textAlign="center">
            주요 목표
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaUsers} w={6} h={6} color="blue.500" />
                  <Heading size="md">청년 창업 지원</Heading>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업 공간과 주거 공간을 통합 제공하여 청년 창업가들의
                    안정적인 창업 환경 조성
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaBuilding} w={6} h={6} color="purple.500" />
                  <Heading size="md">창업 생태계 구축</Heading>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업가 간 네트워크 형성과 협력 체계 구축을 통한 지속 가능한
                    창업 생태계 조성
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaChartLine} w={6} h={6} color="green.500" />
                  <Heading size="md">지역 경제 활성화</Heading>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    창업 기업의 성장과 일자리 창출을 통한 지역 경제 활성화 기여
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="xl" mb={6} textAlign="center">
            공간 구성
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Heading size="md">창업 공간</Heading>
                  <Box gap={2}>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaBuilding} color="blue.500" />
                      <Text>공동 작업실</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaUsers} color="blue.500" />
                      <Text>미팅룸</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaChartLine} color="blue.500" />
                      <Text>창업 지원 센터</Text>
                    </Box>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Heading size="md">주거 공간</Heading>
                  <Box gap={2}>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaUsers} color="purple.500" />
                      <Text>원룸형 주거시설</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaBuilding} color="purple.500" />
                      <Text>공용 주방</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Icon as={FaHandshake} color="purple.500" />
                      <Text>휴게 공간</Text>
                    </Box>
                  </Box>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="xl" mb={6} textAlign="center">
            기대 효과
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaUsers} w={6} h={6} color="blue.500" />
                  <Heading size="md">창업 성공률 향상</Heading>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    통합 지원 시스템을 통한 창업 성공률 20% 이상 향상
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaChartLine} w={6} h={6} color="purple.500" />
                  <Heading size="md">일자리 창출</Heading>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    연간 100개 이상의 신규 일자리 창출
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body>
                <VStack align="start" gap={3}>
                  <Icon as={FaBuilding} w={6} h={6} color="green.500" />
                  <Heading size="md">지역 경제 활성화</Heading>
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
