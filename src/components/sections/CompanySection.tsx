import {
  Box,
  Container,
  Grid,
  Text,
  Heading,
  Button,
  Tag,
  Flex,
  Icon,
  Link,
} from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";

interface CompanyCardProps {
  title: string;
  description: string;
  tags: string[];
  bgColor: string;
  imageUrl?: string | null;
  isLarge?: boolean;
  buttonText?: string;
}

const CompanyCard = ({
  title,
  description,
  tags,
  bgColor,
  imageUrl,
  isLarge,
  buttonText,
}: CompanyCardProps) => {
  return (
    <Box
      bg={bgColor}
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      height={isLarge ? "full" : "320px"}
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
    >
      {/* Background Image or Icon */}
      {imageUrl && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          width="100%"
          height="100%"
          backgroundImage={`url(${imageUrl})`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          zIndex={0}
        />
      )}

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={
          !imageUrl
            ? "linear-gradient(180deg, rgba(0, 0, 0, 0.01) 0%, rgba(0, 0, 0, 0.1) 100%)"
            : "transparent"
        }
        zIndex={1}
      />

      {/* Content Wrapper */}
      <Box position="relative" zIndex={2} height="100%" p={8}>
        {/* Tags */}
        <Flex gap={2} mb={6}>
          {tags.map((tag, index) => (
            <Box
              key={index}
              bg="whiteAlpha.900"
              color="gray.700"
              fontSize="sm"
              fontWeight="medium"
              borderRadius="full"
              px={3}
              py={1}
            >
              #{tag}
            </Box>
          ))}
        </Flex>

        {/* Content */}
        <Box>
          <Heading
            as="h2"
            fontSize={isLarge ? "3xl" : "2xl"}
            fontWeight="bold"
            mb={2}
            color={imageUrl ? "white" : isLarge ? "blue.900" : "gray.900"}
            lineHeight="1.2"
          >
            {title}
          </Heading>
          <Text
            fontSize={isLarge ? "lg" : "md"}
            color={
              imageUrl ? "whiteAlpha.900" : isLarge ? "blue.700" : "gray.600"
            }
            mb={isLarge ? 8 : 4}
            lineHeight="1.5"
          >
            {description}
          </Text>
          {isLarge && (
            <Box>
              <Text
                as="span"
                display="inline-flex"
                alignItems="center"
                fontSize="lg"
                fontWeight="medium"
                color={imageUrl ? "white" : "blue.600"}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "translateX(4px)" }}
              >
                자세히 보기
                <Box as={LuArrowRight} ml={2} boxSize={5} />
              </Text>
            </Box>
          )}
          {buttonText && (
            <Link href={"#"}>
              <Text
                as="span"
                display="inline-flex"
                alignItems="center"
                fontSize="lg"
                fontWeight="medium"
                color={imageUrl ? "white" : "blue.600"}
                cursor="pointer"
                transition="all 0.2s"
                border="1px solid blue.500"
                borderRadius="full"
                px={4}
                py={2}
                _hover={{ transform: "translateX(4px)", bg: "blue.600" }}
              >
                {buttonText}
                <Box as={LuArrowRight} ml={2} boxSize={5} />
              </Text>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export function CompanySection() {
  return (
    <Box py={20}>
      <Container maxW="container.xl" px={0}>
        {/* Section Header */}
        <Box mb={16} px={6}>
          <Text
            color="blue.500"
            fontSize="xl"
            fontWeight="semibold"
            mb={3}
            letterSpacing="tight"
          >
            Introduction to Resident Enterprises
          </Text>
          <Heading
            as="h2"
            fontSize="4xl"
            fontWeight="bold"
            mb={6}
            letterSpacing="tight"
          >
            혁신을 만드는 공간
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={8} lineHeight="1.7">
            미래를 선도하는 스타트업이 한자리에!
            <br />
            지금, 창업의 중심에서 성장하는 기업들을 만나보세요
          </Text>
          <Box width="100%" height="1px" bg="gray.200" />
        </Box>

        {/* Cards Grid */}
        <Grid
          templateColumns="1.6fr 1fr 1fr"
          templateRows="repeat(2, 320px)"
          gap={6}
          px={0}
        >
          {/* Large Card */}
          <Box gridRow="span 2">
            <CompanyCard
              title="오늘의 이야기"
              description="외국인 관광객 타겟&#13;온/오프라인 관광 콘텐츠 홍보 플랫폼"
              tags={["추천", "AI추천"]}
              bgColor="blue.50"
              imageUrl="/images/companies/todays_story.png"
              isLarge
            />
          </Box>

          {/* Small Cards */}
          <CompanyCard
            title="입주기업"
            description="성장하는 기업들을 만나보세요"
            tags={["모아보기"]}
            bgColor="white"
            imageUrl={null}
            buttonText="전체보기"
          />
          <CompanyCard
            title="유니마스"
            description="셀링지원 솔루션"
            tags={["해외셀러", "해외직구"]}
            bgColor="blue.500"
            imageUrl="/images/companies/unimas.png"
          />
          <CompanyCard
            title="삼선택"
            description="생성형 AI를 활용한 모바일 커머스"
            tags={["생성AI", "모바일 커머드"]}
            bgColor="purple.100"
            imageUrl="/images/companies/samsunteck.png"
          />
          <CompanyCard
            title="세로라"
            description="실리카 나노 탈취 방향제"
            tags={["벤나스", "친환경 라이프"]}
            bgColor="teal.100"
            imageUrl="/images/companies/serora.png"
          />
        </Grid>
      </Container>
    </Box>
  );
}
