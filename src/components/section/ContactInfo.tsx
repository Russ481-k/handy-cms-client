import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { LuClock, LuMapPin, LuPhone, LuMail } from "react-icons/lu";
import { CustomButton } from "../ui/custom-button";
import { useColors, useStyles } from "@/styles/theme";

export const ContactInfo = () => {
  const colors = useColors();
  const styles = useStyles(colors, false);

  return (
    <Box {...styles.card} p={8} mb={16} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="6px"
        bgGradient={colors.gradient.secondary}
      />

      <Heading
        as="h2"
        size="lg"
        mb={8}
        bgGradient={colors.gradient.secondary}
        bgClip="text"
      >
        문의 및 위치
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        <VStack align="start" gap="6">
          <Box
            w="full"
            borderRadius="xl"
            overflow="hidden"
            boxShadow={colors.shadow.md}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-4px)",
              boxShadow: colors.shadow.lg,
            }}
          >
            <Box
              w="full"
              h="300px"
              bg={colors.cardBg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={colors.text.secondary}
              fontSize="lg"
              borderRadius="md"
              border="1px dashed"
              borderColor={colors.border}
            >
              지도 이미지가 들어갈 자리입니다
            </Box>
          </Box>
          <CustomButton
            bgGradient={colors.gradient.secondary}
            color={colors.text.inverse}
            rightIcon={<LuMapPin />}
            onClick={() => window.open("https://map.naver.com")}
            _hover={{
              bgGradient: "linear-gradient(135deg, #0284c7, #4f46e5)",
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.md,
            }}
          >
            네이버 지도로 보기
          </CustomButton>
        </VStack>
        <VStack align="start" gap="6">
          <Box
            w="full"
            p={6}
            bg="rgba(14, 165, 233, 0.05)"
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colors.border}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.sm,
              borderColor: colors.accent.info.default,
            }}
          >
            <HStack gap={4}>
              <Box
                color={colors.accent.info.default}
                bg="rgba(14, 165, 233, 0.1)"
                p={3}
                borderRadius="lg"
              >
                <LuClock size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="lg">
                  운영시간
                </Text>
                <Text>월~금 09:00 ~ 20:00</Text>
                <Text fontSize="sm" color="gray.600">
                  (주말·공휴일 상황에 따라 변동)
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box
            w="full"
            p={6}
            bg="rgba(99, 102, 241, 0.05)"
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colors.border}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.sm,
              borderColor: colors.primary.default,
            }}
          >
            <HStack gap={4}>
              <Box
                color={colors.primary.default}
                bg="rgba(99, 102, 241, 0.1)"
                p={3}
                borderRadius="lg"
              >
                <LuMapPin size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="lg">
                  위치
                </Text>
                <Text>부산광역시 연제구 고분로 170</Text>
                <Text>부산경상대학교 학생회관 1층</Text>
                <Text fontSize="sm" color="gray.600">
                  규모: 529.9m² / 기숙사 B동 (303.12m²)
                </Text>
              </VStack>
            </HStack>
          </Box>

          <Box
            w="full"
            p={6}
            bg="rgba(139, 92, 246, 0.05)"
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colors.border}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.sm,
              borderColor: "#8b5cf6",
            }}
          >
            <HStack gap={4}>
              <Box
                color="#8b5cf6"
                bg="rgba(139, 92, 246, 0.1)"
                p={3}
                borderRadius="lg"
              >
                <LuPhone size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="lg">
                  연락처
                </Text>
                <Text>부산경상대학교 산학협력단: 051-850-1053</Text>
                <Text>부산창업가꿈: 051-850-1196</Text>
              </VStack>
            </HStack>
          </Box>

          <Box
            w="full"
            p={6}
            bg="rgba(236, 72, 153, 0.05)"
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colors.border}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.sm,
              borderColor: "#ec4899",
            }}
          >
            <HStack gap={4}>
              <Box
                color="#ec4899"
                bg="rgba(236, 72, 153, 0.1)"
                p={3}
                borderRadius="lg"
              >
                <LuMail size={24} />
              </Box>
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="lg">
                  이메일
                </Text>
                <Text>jyt56@bsks.ac.kr</Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};
