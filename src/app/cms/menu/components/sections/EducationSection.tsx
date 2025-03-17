import { Box, Text, Grid, GridItem, Flex } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";

interface Program {
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface EducationSectionProps {
  isDark: boolean;
}

export function EducationSection({ isDark }: EducationSectionProps) {
  const programs: Program[] = [
    {
      name: "갓생 클래스",
      description: "창업 필수스킬, 사무실 공간활용 지원",
      icon: "🚀",
      features: ["기초 창업 이론", "공간 활용 전략", "네트워킹"],
    },
    {
      name: "그로우업",
      description: "기술, 마케팅, 특허 등을 제품화, 창업교육 지원",
      icon: "💡",
      features: ["기술 상품화", "마케팅 전략", "특허 관리"],
    },
    {
      name: "스케일업",
      description: "창업자 네트워킹 및사, 신사업 공간활용 지원(창업지원)",
      icon: "🌱",
      features: ["사업 확장", "투자 유치", "글로벌 진출"],
    },
  ];

  return (
    <Box mb={20}>
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        mb={2}
        color={isDark ? "white" : "gray.900"}
        lineHeight="1.3"
      >
        성공적인 창업을 위한
      </Text>
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        mb={4}
        color={isDark ? "white" : "gray.900"}
        lineHeight="1.3"
      >
        맞춤형 교육 프로그램
      </Text>
      <Text
        fontSize="lg"
        color={isDark ? "gray.400" : "gray.600"}
        mb={12}
        maxW="2xl"
      >
        AI 기반 맞춤형 커리큘럼으로 당신의 창업을 가속화하세요. 기초부터
        실전까지, 모든 것을 제공합니다.
      </Text>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={8}
      >
        {programs.map((program) => (
          <GridItem
            key={program.name}
            bg={isDark ? "gray.800" : "white"}
            p={8}
            borderRadius="2xl"
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: "xl",
            }}
            cursor="pointer"
            role="group"
          >
            <Text fontSize="3xl" mb={4}>
              {program.icon}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={3}
              color={isDark ? "white" : "gray.900"}
            >
              {program.name}
            </Text>
            <Text
              fontSize="md"
              color={isDark ? "gray.300" : "gray.600"}
              lineHeight="1.7"
              mb={6}
            >
              {program.description}
            </Text>
            <Box
              borderTop="1px solid"
              borderColor={isDark ? "gray.700" : "gray.200"}
              pt={4}
            >
              {program.features.map((feature, index) => (
                <Flex
                  key={feature}
                  align="center"
                  mb={index === program.features.length - 1 ? 0 : 2}
                >
                  <Box
                    w={1}
                    h={1}
                    bg={isDark ? "blue.400" : "blue.500"}
                    borderRadius="full"
                    mr={3}
                  />
                  <Text fontSize="sm" color={isDark ? "gray.400" : "gray.600"}>
                    {feature}
                  </Text>
                </Flex>
              ))}
            </Box>
            <Flex
              align="center"
              color={isDark ? "blue.400" : "blue.500"}
              mt={6}
              transition="all 0.3s"
              _groupHover={{
                transform: "translateX(8px)",
              }}
            >
              <Text fontSize="sm" fontWeight="semibold" mr={2}>
                프로그램 신청
              </Text>
              <Box as={LuArrowRight} boxSize={4} />
            </Flex>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
