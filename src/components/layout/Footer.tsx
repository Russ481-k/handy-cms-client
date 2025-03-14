import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  Text,
  Link,
  HStack,
  IconButton,
  Separator,
} from "@chakra-ui/react";
import { LuFacebook, LuInstagram, LuYoutube } from "react-icons/lu";
import { useColors } from "@/styles/theme";

export const Footer = () => {
  const colors = useColors();

  return (
    <Box
      bg={colors.cardBg}
      py={12}
      borderTop="1px"
      borderColor={colors.border}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="6px"
        bgGradient={colors.gradient.primary}
      />

      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={8}>
          <VStack align="start">
            <Text
              fontWeight="bold"
              mb={4}
              fontSize="lg"
              bgGradient={colors.gradient.primary}
              bgClip="text"
            >
              관련 사이트
            </Text>
            <Link
              href="https://www.busan.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              color={colors.text.secondary}
              _hover={{
                color: colors.primary.default,
                transform: "translateX(4px)",
              }}
              transition="all 0.3s"
              display="flex"
              alignItems="center"
            >
              <Text>부산광역시청</Text>
            </Link>
            <Link
              href="https://www.btp.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              color={colors.text.secondary}
              _hover={{
                color: colors.primary.default,
                transform: "translateX(4px)",
              }}
              transition="all 0.3s"
              display="flex"
              alignItems="center"
            >
              <Text>부산테크노파크</Text>
            </Link>
          </VStack>
          <VStack align="start">
            <Text
              fontWeight="bold"
              mb={4}
              fontSize="lg"
              bgGradient={colors.gradient.secondary}
              bgClip="text"
            >
              문의 안내
            </Text>
            <Text color={colors.text.secondary}>평일 09:00 - 18:00</Text>
            <Text color={colors.text.secondary}>점심시간 12:00 - 13:00</Text>
          </VStack>
          <VStack align="start">
            <Text
              fontWeight="bold"
              mb={4}
              fontSize="lg"
              bgGradient={colors.gradient.accent}
              bgClip="text"
            >
              개인정보처리방침
            </Text>
            <Link
              href="#"
              color={colors.text.secondary}
              _hover={{
                color: colors.primary.default,
                transform: "translateX(4px)",
              }}
              transition="all 0.3s"
              display="flex"
              alignItems="center"
            >
              <Text>개인정보처리방침</Text>
            </Link>
            <Link
              href="#"
              color={colors.text.secondary}
              _hover={{
                color: colors.primary.default,
                transform: "translateX(4px)",
              }}
              transition="all 0.3s"
              display="flex"
              alignItems="center"
            >
              <Text>이용약관</Text>
            </Link>
          </VStack>
          <VStack align="start">
            <Text
              fontWeight="bold"
              mb={4}
              fontSize="lg"
              bgGradient="linear-gradient(135deg, #6366f1, #ec4899)"
              bgClip="text"
            >
              SNS
            </Text>
            <HStack gap="4">
              <IconButton
                aria-label="Facebook"
                variant="ghost"
                color="#4267B2"
                bg="rgba(66, 103, 178, 0.1)"
                borderRadius="full"
                _hover={{
                  bg: "rgba(66, 103, 178, 0.2)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                <LuFacebook />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                variant="ghost"
                color="#E1306C"
                bg="rgba(225, 48, 108, 0.1)"
                borderRadius="full"
                _hover={{
                  bg: "rgba(225, 48, 108, 0.2)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                <LuInstagram />
              </IconButton>
              <IconButton
                aria-label="Youtube"
                variant="ghost"
                color="#FF0000"
                bg="rgba(255, 0, 0, 0.1)"
                borderRadius="full"
                _hover={{
                  bg: "rgba(255, 0, 0, 0.2)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                <LuYoutube />
              </IconButton>
            </HStack>
          </VStack>
        </SimpleGrid>
        <Separator my={8} />
        <Text color={colors.text.muted} fontSize="sm" textAlign="center">
          © 2024 부산창업가꿈. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};
