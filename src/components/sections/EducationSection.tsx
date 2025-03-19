import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
  HStack,
} from "@chakra-ui/react";

interface EducationCardProps {
  title: string;
  descriptions: string[];
  iconUrl: string;
  bgColor?: string;
}

const EducationCard = ({
  title,
  descriptions,
  iconUrl,
  bgColor = "white",
}: EducationCardProps) => {
  return (
    <Box width="100%">
      <Box
        bg={bgColor}
        p={{ base: 4, md: 8 }}
        position="relative"
        _hover={{ transform: "translateY(-4px)" }}
        transition="all 0.2s"
        borderTop="1px solid"
        borderBottom="3px solid"
        borderColor="#0D344E"
        overflow="hidden"
        height={{ base: "auto", md: "420px" }}
        minHeight={{ base: "320px", md: "420px" }}
      >
        <Flex gap={{ base: 4, md: 8 }} align="flex-start" position="relative">
          <Box flex={1}>
            <Heading
              as="h3"
              fontSize={{ base: "24px", sm: "28px", md: "36px" }}
              fontWeight="bold"
              color="gray.800"
              mb={{ base: 4, md: 6 }}
            >
              {title}
            </Heading>
            <VStack align="flex-start" gap={{ base: 2, md: 3 }}>
              {descriptions.map((desc, index) => (
                <Flex key={index} gap={{ base: 2, md: 3 }} align="flex-start">
                  <Text
                    color="gray.600"
                    fontSize={{ base: "12px", sm: "13px", md: "14px" }}
                    lineHeight="1.7"
                  >
                    {desc}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </Flex>
        <Box
          position="absolute"
          right={4}
          bottom={4}
          width={{ base: "60px", sm: "70px", md: "90px" }}
          height={{ base: "60px", sm: "70px", md: "90px" }}
        >
          <Image
            src={iconUrl}
            alt={title}
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
      </Box>
    </Box>
  );
};

export function EducationSection() {
  return (
    <Box py={{ base: 12, md: 24 }}>
      <Container maxW="container.xl">
        <Flex
          align="flex-end"
          mb={{ base: 6, md: 8 }}
          justifyContent="space-between"
          flexDirection={{ base: "column", lg: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <Box>
            <Text
              color="#0D344E"
              fontSize={{ base: "2xl", sm: "3xl" }}
              fontWeight="bold"
              letterSpacing="tight"
              textAlign={{ base: "right", lg: "left" }}
            >
              성공적인 창업을 위한
            </Text>
            <Flex gap={{ base: 2, sm: 0 }}>
              <Heading
                as="h2"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                fontWeight="bold"
                color="blue.500"
                letterSpacing="tight"
                lineHeight="1.2"
                mr={{ base: 0, sm: 3 }}
                mb={{ base: 2, sm: 0 }}
              >
                맞춤형
              </Heading>
              <Heading
                as="h2"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                fontWeight="bold"
                color="#0D344E"
                letterSpacing="tight"
                lineHeight="1.2"
              >
                교육 프로그램
              </Heading>
            </Flex>
          </Box>
          <Text
            fontSize={{ base: "sm", lg: "md" }}
            fontWeight="bold"
            color="#0D344E"
            textAlign="right"
            maxW={{ base: "100%", lg: "600px" }}
          >
            기초부터 실전까지, <br />
            창업가에게 꼭 필요한 모든 것을 배울 수 있습니다.
            <br />
            AI 기반 맞춤형 커리큘럼으로 당신의 창업을 가속화하세요.
          </Text>
        </Flex>

        <HStack gap={2} align="stretch">
          <EducationCard
            title="갓생 클래스"
            descriptions={[
              "연계 웹스케어, 자기계발 프로그램 지원",
              "창업 - 주거 외 정부의 생활 복지 프로그램 추가 운영",
            ]}
            iconUrl="/images/education/class.png"
            bgColor="blue.50"
          />
          <EducationCard
            title="그로우업"
            descriptions={[
              "기술, 마케팅, 회계 법률 멘토링, 창업교육 지원",
              "맞춤형 진단 프로그램 및 시제품 제작 지원",
              "소비자 반응조사 및 사업화 지원 패키지 연계 운영",
            ]}
            iconUrl="/images/education/growth.png"
          />
          <EducationCard
            title="스케일업"
            descriptions={[
              "정기적 네트워킹 행사, 신기술 콘텐츠 lab 운영",
              "정부의 감각으로 재해석하는 신기술 체험 공간조성(협업)",
              "지역 문화 행사와 연계한 프로그램 추진(참여독려)",
            ]}
            iconUrl="/images/education/scale.png"
          />
        </HStack>
      </Container>
    </Box>
  );
}
