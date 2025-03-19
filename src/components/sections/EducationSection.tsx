import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
  Separator,
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
        p={8}
        position="relative"
        _hover={{ transform: "translateY(-4px)" }}
        transition="all 0.2s"
        borderTop="1px solid"
        borderBottom="3px solid"
        borderColor="#0D344E"
        overflow="hidden"
        height="420px"
      >
        <Flex gap={8} align="flex-start" position="relative">
          <Box flex={1}>
            <Heading
              as="h3"
              fontSize="36px"
              fontWeight="bold"
              color="gray.800"
              mb={6}
            >
              {title}
            </Heading>
            <VStack align="flex-start" gap={3}>
              {descriptions.map((desc, index) => (
                <Flex key={index} gap={3} align="flex-start">
                  <Text color="gray.600" fontSize="14px" lineHeight="1.7">
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
          width="90px"
          height="90px"
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
    <Box py={24}>
      <Container maxW="1640px">
        <Flex direction="column" align="stretch" mb={16}>
          <Box mb={4}>
            <Text
              color="gray.500"
              fontSize="xl"
              fontWeight="medium"
              mb={2}
              letterSpacing="tight"
            >
              성공적인 창업을 위한
            </Text>
            <Heading
              as="h2"
              fontSize="5xl"
              fontWeight="bold"
              color="blue.400"
              letterSpacing="tight"
              lineHeight="1.2"
            >
              맞춤형 교육 프로그램
            </Heading>
          </Box>
          <Text
            fontSize="lg"
            color="gray.600"
            textAlign="right"
            lineHeight="1.7"
          >
            AI 기반 맞춤형 커리큘럼으로 당신의 창업을 가속화하세요.
            <br />
            기초부터 실전까지, 창업가에게 꼭 필요한 모든 것을 배울 수 있습니다
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
