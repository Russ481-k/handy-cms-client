import { Box, Container, Text, Link, Flex, Image } from "@chakra-ui/react";

export function Footer() {
  const topMenuItems = [
    { label: "개인정보처리방침", href: "#" },
    { label: "이메일무단수집거부", href: "#" },
    { label: "찾아가는 소식지", href: "#" },
    { label: "찾아오시는 길", href: "#" },
  ];

  return (
    <Box as="footer" bg="#1B2A35" color="white" py={0} mt="auto">
      <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          borderBottom="1px solid"
          borderColor="whiteAlpha.200"
          py={4}
        >
          <Flex gap={0} mb={{ base: 4, md: 0 }} align="center">
            {topMenuItems.map((item, index) => (
              <Flex key={index} align="center">
                <Link
                  href={item.href}
                  fontSize="14px"
                  fontWeight="medium"
                  color="white"
                  _hover={{ textDecoration: "none", color: "gray.300" }}
                >
                  {item.label}
                </Link>
                {index < topMenuItems.length - 1 && (
                  <Text mx={2} color="whiteAlpha.400">
                    ·
                  </Text>
                )}
              </Flex>
            ))}
          </Flex>
          {/* <Box position="relative">
            <Flex
              as="button"
              align="center"
              gap={1}
              color="white"
              fontSize="14px"
              _hover={{ color: "gray.300" }}
              transition="color 0.2s"
            >
              패밀리사이트
            </Flex>
          </Box> */}
        </Flex>

        <Box py={8}>
          <Image
            src="/images/logo/logo3.png"
            alt="부산창업기꿈 로고"
            height="24px"
            mb={4}
          />
          <Text fontSize="14px" color="gray.300" mb={2} fontWeight="medium">
            부산광역시 해운대구 센텀중앙로51번길 36(반여동 216-10번지)
          </Text>
          <Flex gap={0} color="gray.300" fontSize="14px" mb={6} align="center">
            <Text>TEL : 051-343-0109</Text>
            <Text mx={2} color="whiteAlpha.400">
              ·
            </Text>
            <Text>FAX : 051-343-0109</Text>
            <Text mx={2} color="whiteAlpha.400">
              ·
            </Text>
            <Text>E-MAIL : buvakim@naver.com</Text>
          </Flex>
          <Text fontSize="12px" color="gray.500">
            COPYRIGHT 2025. Busan Changeop Gakkum. All Rights Reserved.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
