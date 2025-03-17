import { Box, Text, Grid, GridItem, Flex, Button } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";

interface News {
  date: string;
  title: string;
  tag: string;
}

interface NewsSectionProps {
  isDark: boolean;
}

export function NewsSection({ isDark }: NewsSectionProps) {
  const news: News[] = [
    {
      date: "2025-01-16",
      title: "2025년 제1차 부산창업기관 세미나 공지",
      tag: "세미나",
    },
    {
      date: "2025-01-15",
      title: "스타트업 투자 설명회 개최 안내",
      tag: "투자",
    },
    {
      date: "2025-01-14",
      title: "AI 창업 아이디어 공모전 모집",
      tag: "공모전",
    },
    {
      date: "2025-01-13",
      title: "2025년 창업지원 프로그램 안내",
      tag: "프로그램",
    },
    {
      date: "2025-01-12",
      title: "글로벌 스타트업 컨퍼런스 참가자 모집",
      tag: "컨퍼런스",
    },
  ];

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color={isDark ? "white" : "gray.900"}
            mb={2}
          >
            창업기관 소식
          </Text>
          <Text fontSize="lg" color={isDark ? "gray.400" : "gray.600"}>
            최신 소식과 이벤트를 확인하세요
          </Text>
        </Box>
        <Button
          variant="ghost"
          colorScheme="blue"
          _hover={{
            transform: "translateX(4px)",
          }}
          transition="all 0.2s"
        >
          More View
          <Box as={LuArrowRight} boxSize={4} ml={2} />
        </Button>
      </Flex>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
        }}
        gap={8}
      >
        <GridItem>
          {news.map((item) => (
            <Box
              key={item.title}
              py={5}
              borderBottom="1px solid"
              borderColor={isDark ? "gray.700" : "gray.200"}
              transition="all 0.2s"
              _hover={{
                bg: isDark ? "gray.800" : "gray.50",
              }}
              cursor="pointer"
              px={4}
              borderRadius="md"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" color={isDark ? "gray.400" : "gray.500"}>
                  {item.date}
                </Text>
                <Text
                  fontSize="xs"
                  color="blue.500"
                  px={2}
                  py={1}
                  bg={isDark ? "blue.900" : "blue.50"}
                  borderRadius="full"
                >
                  {item.tag}
                </Text>
              </Flex>
              <Text
                color={isDark ? "white" : "gray.900"}
                _hover={{ color: "blue.500" }}
                fontSize="lg"
                fontWeight="medium"
              >
                {item.title}
              </Text>
            </Box>
          ))}
        </GridItem>
        <GridItem
          bg={isDark ? "gray.800" : "gray.100"}
          borderRadius="2xl"
          overflow="hidden"
          position="relative"
          height="400px"
          boxShadow="xl"
        >
          <Box
            position="relative"
            width="100%"
            height="100%"
            overflow="hidden"
            bg={isDark ? "gray.900" : "transparent"}
            backgroundImage="url('/images/banners/banner_2.jpg')"
            backgroundSize="cover"
            backgroundPosition="center"
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: isDark
                ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)"
                : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
              opacity: isDark ? 0.9 : 0.7,
            }}
          >
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={2}
            >
              <Box
                width="70px"
                height="70px"
                borderRadius="full"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                boxShadow="lg"
                _hover={{
                  transform: "scale(1.1)",
                  boxShadow: "xl",
                }}
                transition="all 0.2s"
              >
                <Box
                  borderLeft="24px solid"
                  borderLeftColor="blue.500"
                  borderTop="14px solid transparent"
                  borderBottom="14px solid transparent"
                  ml={2}
                />
              </Box>
            </Box>
          </Box>
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={8}
            background={
              isDark
                ? "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0) 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0) 100%)"
            }
            color="white"
            transform="translateY(0)"
            transition="transform 0.3s"
            _groupHover={{
              transform: "translateY(-8px)",
            }}
          >
            <Text fontSize="2xl" fontWeight="bold" mb={3}>
              홍보영상
            </Text>
            <Text fontSize="md" color="gray.100" lineHeight="1.6">
              창업, 성장, 성공과 도약까지의 함께 만들어가는 이야기
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
