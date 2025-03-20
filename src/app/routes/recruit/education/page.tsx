"use client";

import { Box, Container, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { FaLightbulb, FaChartLine, FaHandshake, FaGlobe } from "react-icons/fa";

export default function EducationPage() {
  const courses = [
    {
      title: "창업 기초",
      description:
        "창업의 기본 개념부터 사업계획서 작성, 법인 설립 절차까지 기초적인 내용을 학습합니다.",
      duration: "2주",
      topics: [
        "창업의 이해",
        "사업계획서 작성법",
        "법인 설립 실무",
        "세무/회계 기초",
      ],
      icon: FaLightbulb,
      color: "blue",
    },
    {
      title: "사업화 전략",
      description:
        "시장 분석, 마케팅 전략, 재무 계획 등 사업 운영에 필요한 실전 지식을 습득합니다.",
      duration: "3주",
      topics: [
        "시장 분석 방법론",
        "마케팅 전략 수립",
        "재무 계획과 관리",
        "영업/판로 개척",
      ],
      icon: FaChartLine,
      color: "green",
    },
    {
      title: "투자 유치",
      description:
        "IR 피칭, 투자 계약, 기업 가치평가 등 투자 유치에 필요한 실무 지식을 배웁니다.",
      duration: "2주",
      topics: [
        "IR 피칭 기법",
        "투자 계약서 이해",
        "기업 가치평가",
        "투자자 네트워킹",
      ],
      icon: FaHandshake,
      color: "purple",
    },
    {
      title: "글로벌 진출",
      description:
        "해외 시장 진출 전략, 글로벌 마케팅, 수출입 실무 등 글로벌 비즈니스 역량을 강화합니다.",
      duration: "3주",
      topics: ["해외 시장 조사", "글로벌 마케팅", "수출입 실무", "현지화 전략"],
      icon: FaGlobe,
      color: "orange",
    },
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          교육내용
        </Heading>
        <Text color="gray.600" fontSize="lg">
          창업가꿈에서 제공하는 체계적인 교육 프로그램을 소개합니다.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        {courses.map((course, index) => (
          <Box
            key={index}
            p={8}
            bg="white"
            borderRadius="lg"
            shadow="md"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "lg",
            }}
          >
            <Box display="flex" alignItems="center" mb={6}>
              <Box
                as={course.icon}
                color={`${course.color}.500`}
                fontSize="2xl"
                mr={4}
              />
              <Box>
                <Heading as="h3" size="lg" mb={2}>
                  {course.title}
                </Heading>
                <Text color="gray.500">교육기간: {course.duration}</Text>
              </Box>
            </Box>

            <Text fontSize="lg" mb={6}>
              {course.description}
            </Text>

            <Box>
              <Text fontWeight="bold" mb={3}>
                주요 교육내용
              </Text>
              <Box as="ul" listStyleType="none" p={0}>
                {course.topics.map((topic, topicIndex) => (
                  <Box
                    as="li"
                    key={topicIndex}
                    display="flex"
                    alignItems="center"
                    fontSize="md"
                    mb={2}
                  >
                    <Box
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg={`${course.color}.500`}
                      mr={3}
                    />
                    {topic}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Box mt={16} p={6} bg="blue.50" borderRadius="lg">
        <Heading as="h2" size="lg" mb={4}>
          교육 운영 안내
        </Heading>
        <Box as="ul" listStyleType="none" p={0}>
          <Box as="li" fontSize="lg" mb={3}>
            - 모든 교육은 현장 실습과 온라인 학습을 병행하여 진행됩니다.
          </Box>
          <Box as="li" fontSize="lg" mb={3}>
            - 각 과정별 전문 멘토가 배정되어 1:1 맞춤형 지도를 제공합니다.
          </Box>
          <Box as="li" fontSize="lg" mb={3}>
            - 교육 수료 후에도 지속적인 성장을 위한 후속 지원이 제공됩니다.
          </Box>
          <Box as="li" fontSize="lg">
            - 우수 수료생에게는 투자 유치 기회가 제공될 수 있습니다.
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
