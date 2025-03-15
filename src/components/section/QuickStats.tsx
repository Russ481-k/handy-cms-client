import { Box, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { LuTarget, LuUsers, LuGraduationCap, LuBuilding } from "react-icons/lu";
import { useColors } from "@/styles/theme";

export const QuickStats = () => {
  const colors = useColors();

  const stats = [
    {
      icon: LuTarget,
      title: "지원 규모",
      value: "최대 2억원",
      desc: "기업당 지원금",
    },
    {
      icon: LuUsers,
      title: "모집 인원",
      value: "20개사",
      desc: "연간 선발 기업",
    },
    {
      icon: LuGraduationCap,
      title: "멘토링",
      value: "전담 멘토 배정",
      desc: "1:1 밀착 지원",
    },
    {
      icon: LuBuilding,
      title: "입주 공간",
      value: "무상 제공",
      desc: "최대 2년",
    },
  ];

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 4 }}
      gap={{ base: 6, md: 8 }}
      my={{ base: 16, md: 24 }}
    >
      {stats.map((stat, idx) => (
        <Box
          key={idx}
          bg={colors.cardBg}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={colors.border}
          p={{ base: 8, md: 10 }}
          textAlign="center"
          transition="all 0.3s"
          position="relative"
          overflow="hidden"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: colors.shadow.lg,
            borderColor: colors.primary.default,
          }}
          role="group"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="6px"
            bgGradient={
              idx % 4 === 0
                ? colors.gradient.primary
                : idx % 4 === 1
                ? colors.gradient.secondary
                : idx % 4 === 2
                ? "linear-gradient(135deg, #10b981, #0ea5e9)"
                : colors.gradient.accent
            }
          />
          <VStack gap={{ base: 6, md: 8 }}>
            <Box
              color={colors.primary.default}
              transition="all 0.3s"
              _groupHover={{
                transform: "scale(1.1) rotate(5deg)",
                color: colors.primary.hover,
              }}
            >
              <stat.icon size={48} />
            </Box>
            <VStack gap={4}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={colors.text.primary}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {stat.title}
              </Text>
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                bgGradient={
                  idx % 4 === 0
                    ? colors.gradient.primary
                    : idx % 4 === 1
                    ? colors.gradient.secondary
                    : idx % 4 === 2
                    ? "linear-gradient(135deg, #10b981, #0ea5e9)"
                    : colors.gradient.accent
                }
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
                lineHeight="1"
              >
                {stat.value}
              </Text>
              <Text color={colors.text.secondary} fontSize="lg">
                {stat.desc}
              </Text>
            </VStack>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};
