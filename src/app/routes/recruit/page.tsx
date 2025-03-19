"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { FaBriefcase, FaRegClock, FaRegBuilding } from "react-icons/fa";
import Link from "next/link";

export default function RecruitPage() {
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
            채용 정보
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            부산창업가꿈 해운대의 입주 기업들의 채용 정보를 확인하세요
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {[1, 2, 3, 4, 5, 6].map((job) => (
            <Card.Root
              key={job}
              bg={isDark ? "gray.800" : "white"}
              borderWidth="1px"
              borderColor={isDark ? "gray.700" : "gray.200"}
              boxShadow="lg"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
                transition: "all 0.2s",
              }}
            >
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Box w="100%">
                    <Badge colorScheme="green" mb={2}>
                      정규직
                    </Badge>
                    <Heading
                      size="md"
                      mb={2}
                      color={isDark ? "white" : "gray.800"}
                    >
                      채용 포지션 {job}
                    </Heading>
                    <Text color={isDark ? "gray.300" : "gray.600"}>
                      채용 상세 내용이 들어갈 자리입니다. 채용 포지션에 대한
                      간단한 설명을 작성할 수 있습니다.
                    </Text>
                  </Box>

                  <HStack gap={4} color={isDark ? "gray.400" : "gray.500"}>
                    <HStack>
                      <FaRegBuilding />
                      <Text>기업명 {job}</Text>
                    </HStack>
                    <HStack>
                      <FaBriefcase />
                      <Text>경력 {job}년</Text>
                    </HStack>
                    <HStack>
                      <FaRegClock />
                      <Text>2024-03-{job}</Text>
                    </HStack>
                  </HStack>

                  <Link href={`/recruit/${job}`}>자세히 보기</Link>
                </VStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
