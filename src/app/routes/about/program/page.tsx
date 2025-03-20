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
  FaLightbulb,
  FaGraduationCap,
  FaChartLine,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";
import { Card } from "@chakra-ui/react";

export default function ProgramPage() {
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
            성공적인 창업을 위한 맞춤형 교육 프로그램
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            창업 준비부터 실행까지, 전문가와 함께하는 체계적인 교육
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body gap={4}>
              <Icon as={FaGraduationCap} w={8} h={8} color="blue.500" />
              <Heading size="lg">기초 교육</Heading>
              <Text color={isDark ? "gray.300" : "gray.600"}>
                창업의 기초를 다지는 필수 교육 과정
              </Text>
              <Box gap={2}>
                <Box display="flex" alignItems="center">
                  <Icon as={FaChartLine} color="blue.500" />
                  <Text>창업 기초 이론</Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon as={FaUsers} color="blue.500" />
                  <Text>시장 분석 및 리서치</Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon as={FaHandshake} color="blue.500" />
                  <Text>비즈니스 모델 설계</Text>
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body gap={4}>
              <Icon as={FaLightbulb} w={8} h={8} color="purple.500" />
              <Heading size="lg">실전 교육</Heading>
              <Text color={isDark ? "gray.300" : "gray.600"}>
                실제 창업 과정에서 필요한 실무 교육
              </Text>
              <Box gap={2}>
                <Box display="flex" alignItems="center">
                  <Icon as={FaChartLine} color="purple.500" />
                  <Text>재무 관리 및 자금 운용</Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon as={FaUsers} color="purple.500" />
                  <Text>마케팅 전략 수립</Text>
                </Box>
                <Box display="flex" alignItems="center">
                  <Icon as={FaHandshake} color="purple.500" />
                  <Text>고객 관리 및 서비스</Text>
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        <Box>
          <Heading size="xl" mb={6} textAlign="center">
            교육 프로그램 특징
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body gap={3}>
                <Icon as={FaUsers} w={6} h={6} color="blue.500" />
                <Heading size="md">맞춤형 교육</Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  창업가의 분야와 단계에 맞는 개별 맞춤형 교육 제공
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body gap={3}>
                <Icon as={FaHandshake} w={6} h={6} color="purple.500" />
                <Heading size="md">멘토링</Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  성공한 창업가와 전문가의 1:1 멘토링 지원
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
            >
              <Card.Body gap={3}>
                <Icon as={FaChartLine} w={6} h={6} color="green.500" />
                <Heading size="md">네트워킹</Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  창업가 간 네트워크 형성 및 협력 기회 제공
                </Text>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
