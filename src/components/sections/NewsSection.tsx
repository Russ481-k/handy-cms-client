import {
  Box,
  Text,
  Flex,
  Button,
  VStack,
  Image,
  AspectRatio,
  Container,
  Link,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useColors } from "@/styles/theme";
import { useColorMode } from "@/components/ui/color-mode";

interface News {
  date: string;
  title: string;
  isNew?: boolean;
}

export function NewsSection() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const colors = useColors();

  const news: News[] = [
    {
      date: "2025-03-16",
      title: "2025년 부산창업기꿈 서류심사 결과 및 면접결과 안내",
      isNew: true,
    },
    {
      date: "2025-03-16",
      title:
        "2025년 해운대 도심형 청년 창업 주거 복합공간 입주자 모집 추가공고",
    },
    {
      date: "2025-03-16",
      title: "2025년 해운대 도심형 청년 창업 주거 복합공간 입주자 3차 모집공고",
    },
    {
      date: "2025-03-16",
      title: "2025년 해운대 도심형 청년 창업 주거 복합공간 입주자 2차 모집공고",
    },
    {
      date: "2025-03-16",
      title: "2025년 해운대 도심형 청년 창업 주거 복합공간 입주자 1차 모집공고",
    },
  ];

  return (
    <Box py={{ base: 12, md: 24 }}>
      <Container maxW="container.xl">
        <Flex>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="bold"
            color={colors.text.primary}
          >
            창업가꿈
          </Text>
          <Text
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="bold"
            color={colors.primary.default}
            ml={2}
          >
            소식
          </Text>
        </Flex>
        <Flex
          direction={{ base: "column", "2xl": "row" }}
          gap={{ base: 6, md: 8 }}
          width="100%"
        >
          <Box flex="1" width="100%">
            <Flex justify="flex-end" mb={2}>
              <Link href="/routes/recruit/notice">
                <Button
                  variant="ghost"
                  color={colors.text.primary}
                  fontWeight="medium"
                  fontSize={{ base: "sm", md: "md" }}
                  p={2}
                  _hover={{
                    bg: isDark ? "whiteAlpha.100" : "blackAlpha.50",
                  }}
                >
                  More View
                  <Box as={LuPlus} />
                </Button>
              </Link>
            </Flex>

            <VStack gap={0} align="stretch" width="100%">
              {news.map((item, index) => (
                <Box
                  key={item.title}
                  p={{ base: 4, md: 6 }}
                  borderTop={index === 0 ? "1px solid" : "none"}
                  borderBottom="1px solid"
                  borderColor={colors.border}
                  width="100%"
                  transition="all 0.2s"
                  _hover={{
                    bg: isDark ? "whiteAlpha.100" : "blackAlpha.50",
                  }}
                  cursor="pointer"
                >
                  <Flex gap={{ base: 2, md: 4 }}>
                    {item.isNew && (
                      <Box
                        bg={colors.primary.default}
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="bold"
                      >
                        N
                      </Box>
                    )}
                    <Flex
                      flex={1}
                      justify="space-between"
                      gap={{ base: 2, md: 3 }}
                    >
                      <Text
                        color={colors.text.primary}
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="medium"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        flex="1"
                        alignItems="center"
                      >
                        {item.title}
                      </Text>
                      <Text
                        color={colors.text.secondary}
                        fontSize={{ base: "xs", md: "sm" }}
                        flexShrink={0}
                        alignItems="center"
                      >
                        {item.date}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box
            width={{ base: "100%", md: "540px" }}
            maxWidth="100%"
            alignSelf="center"
          >
            {/* Video container with aspect ratio */}
            <Box position="relative" width="100%">
              <AspectRatio ratio={16 / 9} width="100%">
                <Box position="relative">
                  {/* Blue border background */}
                  <Box
                    border={`2px solid ${colors.primary.default}`}
                    borderRadius={{ base: "18px", md: "20px" }}
                    position="absolute"
                    width="85%"
                    height="85%"
                    left={{ base: "50px", md: "60px" }}
                    top={{ base: "0px", md: "20px" }}
                    zIndex={1}
                  />

                  {/* Video */}
                  <Box
                    position="absolute"
                    width="85%"
                    height="85%"
                    left={{ base: "20px", md: "40px" }}
                    top={{ base: "20px", md: "40px" }}
                    zIndex={2}
                  >
                    <video
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                    >
                      <source src="/videos/video.mp4" type="video/mp4" />
                    </video>
                  </Box>
                </Box>
              </AspectRatio>

              {/* Bottom content */}
              <Box
                bg={isDark ? colors.cardBg : "#0C2139"}
                borderTopRadius={{ base: "16px", md: "20px" }}
                mt={{ base: -24, md: -32 }}
                p={{ base: 6, md: 8 }}
                boxShadow={colors.shadow.md}
              >
                <Flex
                  justify="space-between"
                  align="flex-end"
                  height={{ base: "15vh", md: "20vh" }}
                >
                  <Box lineHeight="1.2">
                    <Text
                      fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      mb={1}
                      color="white"
                      letterSpacing="tight"
                    >
                      홍보영상
                    </Text>
                    <Text
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      color="whiteAlpha.900"
                      letterSpacing="tight"
                    >
                      창업, 성장, 글로벌 도약까지 함께 만들어가는 미래!
                    </Text>
                  </Box>
                  <Image
                    src="/images/logo/logo2.png"
                    alt="부산창업기꿈"
                    width={{ base: "60px", sm: "80px", md: "100px" }}
                    height="auto"
                  />
                </Flex>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
