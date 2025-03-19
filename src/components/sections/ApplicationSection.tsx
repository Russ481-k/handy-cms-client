import {
  Box,
  Text,
  Flex,
  Button,
  Image,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import { useColors } from "@/styles/theme";
import { LuArrowRight } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";

interface SupportItemProps {
  title: string;
  description: string;
  color: string;
  isDark: boolean;
}

function SupportItem({ title, description, color, isDark }: SupportItemProps) {
  return (
    <Box
      bg={isDark ? "whiteAlpha.50" : color}
      borderRightRadius="full"
      p={6}
      color="white"
      _hover={{
        transform: "translateY(-2px)",
        transition: "transform 0.2s",
      }}
      mr={-4}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text fontSize="sm" opacity={0.9}>
        {description}
      </Text>
    </Box>
  );
}

function ActionButton({
  variant,
  children,
}: {
  variant: "outline" | "solid";
  children: React.ReactNode;
}) {
  const colors = useColors();

  return (
    <Button
      variant={variant}
      size={{ base: "md", md: "lg" }}
      borderColor={variant === "outline" ? colors.primary.default : undefined}
      color={variant === "outline" ? colors.primary.default : "white"}
      bg={variant === "solid" ? colors.primary.default : undefined}
      _hover={{
        bg: variant === "solid" ? colors.primary.hover : colors.primary.alpha,
        transform: "translateY(-2px)",
      }}
      width={{ base: "100%", md: "auto" }}
    >
      <Flex align="center" gap={2}>
        {children}
        <Box as={LuArrowRight} />
      </Flex>
    </Button>
  );
}

export function ApplicationSection() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();

  const supportItems = [
    {
      title: "최적의 창업 공간 제공",
      description: "사무실, 회의실, 코워킹 스페이스 완비",
      color: "#1AA0B8",
    },
    {
      title: "AI 기반 창업 지원",
      description: "맞춤형 교육 & 멘토링 시스템 제공",
      color: "#0E7EC9",
    },
    {
      title: "창업 네트워크 연결",
      description: "투자자, 스타트업 커뮤니티와의 협력 기회",
      color: "#1AA0B8",
    },
    {
      title: "주거 & 생활 공간 지원",
      description: "창업과 생활을 함께!",
      color: "#0E7EC9",
    },
  ];

  return (
    <Box
      width="100%"
      bg={isDark ? "gray.800" : "white"}
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor={colors.border}
    >
      <Container maxW="container.xl" py={8} px={{ base: 6, md: 12 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "flex-start" }}
          gap={{ base: 8, md: 12 }}
        >
          <Image
            src="/images/apply/apply_illust.png"
            alt="창업 일러스트레이션"
            width={{ base: "120px", md: "160px" }}
            height="auto"
            flexShrink={0}
          />

          <Box flex={1}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={6}
              mb={8}
            >
              <Box>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color={colors.text.primary}
                  mb={2}
                >
                  창업의 첫걸음,{" "}
                  <Text as="span" color={colors.primary.default}>
                    지금 시작하세요!
                  </Text>
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={colors.text.secondary}
                >
                  부산창업기꿈, 이렇게 지원합니다!
                </Text>
              </Box>

              <Flex
                gap={4}
                direction={{ base: "column", sm: "row" }}
                width={{ base: "100%", md: "auto" }}
              >
                <ActionButton variant="outline">모집공고 보러가기</ActionButton>
                <ActionButton variant="solid">입주 신청하기</ActionButton>
              </Flex>
            </Flex>

            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 4 }}
              width="100%"
              gap={{ base: 4, md: 0 }}
            >
              {supportItems.map((item, index) => (
                <SupportItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  color={item.color}
                  isDark={isDark}
                />
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
