"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import Link from "next/link";
import { Card } from "@chakra-ui/react";

export default function CompaniesPage() {
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
            입주 기업
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            부산창업가꿈 해운대에서 성장하는 혁신적인 기업들을 소개합니다
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
          {[1, 2, 3, 4, 5, 6].map((company) => (
            <Card.Root
              key={company}
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
              <Card.Body gap={4}>
                <Box
                  w="100%"
                  h="200px"
                  bg={isDark ? "gray.700" : "gray.100"}
                  borderRadius="lg"
                  mb={4}
                />
                <Heading size="md" color={isDark ? "white" : "gray.800"}>
                  기업명 {company}
                </Heading>
                <Text color={isDark ? "gray.300" : "gray.600"}>
                  기업 소개 내용이 들어갈 자리입니다. 기업의 주요 서비스나
                  제품에 대한 간단한 설명을 작성할 수 있습니다.
                </Text>
                <Link href={`/companies/${company}`}>자세히 보기</Link>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
