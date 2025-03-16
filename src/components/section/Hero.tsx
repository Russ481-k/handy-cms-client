import {
  Box,
  Stack,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Badge,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  LuExternalLink,
  LuCalendar,
  LuInfo,
  LuDownload,
  LuCheck,
} from "react-icons/lu";
import { CustomButton } from "../ui/custom-button";
import { useColors, useStyles } from "@/styles/theme";

interface HeroProps {
  scheduleData: {
    phase: string;
    period: string;
    status: string;
  }[];
}

export const Hero: React.FC<HeroProps> = ({ scheduleData }) => {
  const colors = useColors();
  const styles = useStyles(colors, false);
  const scheduleDisclosure = useDisclosure();
  const guideDisclosure = useDisclosure();

  return (
    <Box
      {...styles.card}
      bg="transparent"
      borderWidth="0"
      p={{ base: 8, md: 12, lg: 16 }}
      position="relative"
      overflow="visible"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top={0}
        left="50%"
        w="200%"
        h="100%"
        bgGradient={`linear(to-r, ${colors.primary.light}, transparent, ${colors.primary.light})`}
        transform="translateX(-50%)"
        opacity={0.8}
        zIndex={-1}
      />
      <Stack gap={{ base: 6, md: 8 }} w="full">
        <Stack gap={4} direction="row">
          <Badge {...styles.badge.info} fontSize="md" py={2} px={4}>
            2025년 신규사업
          </Badge>
          <Badge {...styles.badge.success} fontSize="md" py={2} px={4}>
            모집중
          </Badge>
        </Stack>
        <VStack align="start" gap={{ base: 4, md: 6 }} w="full">
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="black"
            letterSpacing="-0.02em"
            bgGradient={colors.gradient.accent}
            bgClip="text"
            transform="translateZ(0)"
            lineHeight="1.2"
            w="full"
          >
            부산창업가꿈
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="tall"
            color={colors.text.secondary}
            maxW="3xl"
          >
            청년 창업가를 위한 종합 지원 사업으로, 창업 초기 청년들에게 필요한
            공간, 네트워크, 교육 등을 종합적으로 제공하여 안정적인 창업 환경을
            구축하고, 지속 가능한 비즈니스 모델 구축을 지원합니다.
          </Text>
        </VStack>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={{ base: 4, md: 6 }}
          w="full"
          mt={{ base: 6, md: 8 }}
        >
          <Button
            size="lg"
            height="auto"
            py={{ base: 4, md: 6 }}
            px={{ base: 6, md: 8 }}
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            bgGradient={colors.gradient.primary}
            color="white"
            _hover={{
              bgGradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.md,
            }}
            onClick={() => (window.location.href = "/apply")}
          >
            사업 신청하기
            <Box as={LuExternalLink} ml={2} />
          </Button>
          <Dialog.Root
            open={scheduleDisclosure.open}
            onOpenChange={scheduleDisclosure.onToggle}
          >
            <Dialog.Trigger asChild>
              <Button
                size="lg"
                height="auto"
                py={{ base: 4, md: 6 }}
                px={{ base: 6, md: 8 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                bg="rgba(99, 102, 241, 0.1)"
                color={colors.primary.default}
                backdropFilter="blur(12px)"
                _hover={{
                  bg: "rgba(99, 102, 241, 0.15)",
                  transform: "translateY(-2px)",
                  boxShadow: colors.shadow.sm,
                }}
              >
                모집 일정 확인
                <Box as={LuCalendar} ml={2} />
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop {...styles.dialog.overlay} />
              <Dialog.Positioner>
                <Dialog.Content {...styles.dialog.content}>
                  <Dialog.Header borderBottomColor={colors.border}>
                    <Dialog.Title {...styles.text.heading}>
                      2025년 모집 일정
                    </Dialog.Title>
                    <Dialog.CloseTrigger
                      position="absolute"
                      top={2}
                      right={2}
                      color={colors.text.secondary}
                      _hover={{ color: colors.text.primary }}
                    >
                      ✕
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack gap="4" align="stretch">
                      {scheduleData.map((item, index) => (
                        <Box
                          key={index}
                          p={4}
                          bg={colors.secondary.light}
                          borderRadius="md"
                        >
                          <Stack
                            justify="space-between"
                            direction={{ base: "column", md: "row" }}
                          >
                            <VStack align="start" gap="1">
                              <Text fontWeight="bold">{item.phase}</Text>
                              <Text color={colors.text.secondary}>
                                {item.period}
                              </Text>
                            </VStack>
                            <Badge
                              colorScheme={
                                item.status === "진행중"
                                  ? "green"
                                  : item.status === "진행 예정"
                                  ? "blue"
                                  : "gray"
                              }
                            >
                              {item.status}
                            </Badge>
                          </Stack>
                        </Box>
                      ))}
                    </VStack>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
          <Dialog.Root
            open={guideDisclosure.open}
            onOpenChange={guideDisclosure.onToggle}
          >
            <Dialog.Trigger asChild>
              <Button
                size="lg"
                height="auto"
                py={{ base: 4, md: 6 }}
                px={{ base: 6, md: 8 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                bg="rgba(99, 102, 241, 0.1)"
                color={colors.primary.default}
                backdropFilter="blur(12px)"
                _hover={{
                  bg: "rgba(99, 102, 241, 0.15)",
                  transform: "translateY(-2px)",
                  boxShadow: colors.shadow.sm,
                }}
              >
                신청 가이드
                <Box as={LuInfo} ml={2} />
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop {...styles.dialog.overlay} />
              <Dialog.Positioner>
                <Dialog.Content {...styles.dialog.content}>
                  <Dialog.Header>
                    <Dialog.Title {...styles.text.heading}>
                      신청 가이드
                    </Dialog.Title>
                    <Dialog.CloseTrigger
                      position="absolute"
                      top={2}
                      right={2}
                      color={colors.text.secondary}
                      _hover={{ color: colors.text.primary }}
                    >
                      ✕
                    </Dialog.CloseTrigger>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack gap="6" align="stretch">
                      <Box>
                        <Heading size="sm" mb={3}>
                          준비 서류
                        </Heading>
                        <Stack gap="2">
                          <Stack direction="row">
                            <LuCheck color={colors.primary.default} />
                            <Text>사업계획서 (지정양식)</Text>
                          </Stack>
                          <Stack direction="row">
                            <LuCheck color={colors.primary.default} />
                            <Text>사업자등록증 사본</Text>
                          </Stack>
                          <Stack direction="row">
                            <LuCheck color={colors.primary.default} />
                            <Text>대표자 주민등록등본</Text>
                          </Stack>
                        </Stack>
                      </Box>
                      <Box>
                        <Heading size="sm" mb={3}>
                          신청 절차
                        </Heading>
                        <Stack gap="2">
                          <Stack direction="row">
                            <Text>1.</Text>
                            <Text>회원가입 및 로그인</Text>
                          </Stack>
                          <Stack direction="row">
                            <Text>2.</Text>
                            <Text>신청서 작성 및 제출</Text>
                          </Stack>
                          <Stack direction="row">
                            <Text>3.</Text>
                            <Text>서류 심사</Text>
                          </Stack>
                          <Stack direction="row">
                            <Text>4.</Text>
                            <Text>대면 평가</Text>
                          </Stack>
                          <Stack direction="row">
                            <Text>5.</Text>
                            <Text>최종 선정</Text>
                          </Stack>
                        </Stack>
                      </Box>
                      <CustomButton
                        {...styles.button.primary}
                        onClick={() =>
                          (window.location.href = "/download/guide.pdf")
                        }
                        rightIcon={<LuDownload />}
                      >
                        상세 가이드 다운로드
                      </CustomButton>
                    </VStack>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </SimpleGrid>
        <Button
          size="lg"
          height="auto"
          py={{ base: 4, md: 6 }}
          px={{ base: 6, md: 8 }}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          bg="transparent"
          color={colors.primary.default}
          borderWidth="1px"
          borderColor={colors.primary.default}
          mt={{ base: 2, md: 4 }}
          backdropFilter="blur(12px)"
          _hover={{
            bg: "rgba(99, 102, 241, 0.1)",
            transform: "translateY(-2px)",
            boxShadow: colors.shadow.sm,
          }}
          onClick={() => (window.location.href = "/download/brochure.pdf")}
        >
          사업안내 브로셔 다운로드
          <Box as={LuDownload} ml={2} />
        </Button>
      </Stack>
    </Box>
  );
};
