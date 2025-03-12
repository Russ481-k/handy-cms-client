"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stack,
  HStack,
  VStack,
  Button,
  ButtonProps,
  Link,
  Flex,
  Badge,
  useDisclosure,
  List,
  ListItem,
  Image,
  Accordion,
  AccordionItem,
  IconButton,
  TooltipArrow,
  Separator,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { 
  LuMapPin, 
  LuPhone, 
  LuMail, 
  LuClock, 
  LuChevronRight, 
  LuExternalLink,
  LuCalendar,
  LuInfo,
  LuDownload,
  LuCheck,
  LuTarget,
  LuUsers,
  LuGraduationCap,
  LuBuilding,
  LuFacebook,
  LuInstagram,
  LuYoutube,
  LuX,
  LuUser,
  LuUserPlus,
  LuMenu,
  LuMoon,
  LuSun,
  LuArrowUp,
} from "react-icons/lu";
import { HiHome } from "react-icons/hi";
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Tooltip } from "@/components/ui/tooltip";

interface CustomButtonProps extends ButtonProps {
  rightIcon?: React.ReactElement;
}

const CustomButton: React.FC<CustomButtonProps> = ({ rightIcon, children, ...props }) => {
  return (
    <Button {...props}>
      {children}
      {rightIcon && <Box ml={2}>{rightIcon}</Box>}
    </Button>
  );
};

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {  
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Color mode values
  const colors = {
    bg: useColorModeValue("gray.50", "gray.900"),
    cardBg: useColorModeValue("white", "gray.800"),
    border: useColorModeValue("gray.200", "gray.700"),
    primary: {
      default: useColorModeValue("blue.600", "blue.300"),
      hover: useColorModeValue("blue.700", "blue.400"),
      light: useColorModeValue("blue.50", "blue.900"),
      dark: useColorModeValue("blue.800", "blue.200"),
      alpha: useColorModeValue("rgba(49, 130, 206, 0.1)", "rgba(144, 205, 244, 0.1)"),
    },
    secondary: {
      default: useColorModeValue("gray.600", "gray.400"),
      hover: useColorModeValue("gray.700", "gray.300"),
      light: useColorModeValue("gray.50", "gray.700"),
      dark: useColorModeValue("gray.800", "gray.200"),
    },
    text: {
      primary: useColorModeValue("gray.900", "white"),
      secondary: useColorModeValue("gray.600", "gray.300"),
      inverse: useColorModeValue("white", "gray.900"),
      muted: useColorModeValue("gray.500", "gray.400"),
      accent: useColorModeValue("blue.600", "blue.300"),
    },
    accent: {
      success: {
        default: useColorModeValue("green.500", "green.300"),
        bg: useColorModeValue("green.50", "green.900"),
        hover: useColorModeValue("green.600", "green.400"),
      },
      warning: {
        default: useColorModeValue("orange.500", "orange.300"),
        bg: useColorModeValue("orange.50", "orange.900"),
        hover: useColorModeValue("orange.600", "orange.400"),
      },
      info: {
        default: useColorModeValue("blue.500", "blue.300"),
        bg: useColorModeValue("blue.50", "blue.900"),
        hover: useColorModeValue("blue.600", "blue.400"),
      },
    },
    hover: {
      card: useColorModeValue("gray.50", "gray.750"),
      link: useColorModeValue("blue.600", "blue.300"),
    },
    shadow: {
      sm: useColorModeValue("lg", "dark-lg"),
      md: useColorModeValue("xl", "dark-xl"),
      lg: useColorModeValue("2xl", "dark-2xl"),
    }
  };

  // Common styles
  const styles = {
    container: {
      maxW: "container.xl",
      px: { base: 4, md: 6, lg: 8 },
    },
    section: {
      py: { base: 8, md: 12, lg: 16 },
    },
    card: {
      bg: colors.cardBg,
      borderColor: colors.border,
      borderWidth: "1px",
      borderRadius: "xl",
      boxShadow: colors.shadow.sm,
      transition: "all 0.2s ease-in-out",
      _hover: {
        boxShadow: colors.shadow.md,
        borderColor: colors.primary.default,
        transform: "translateY(-2px)",
        bg: colors.hover.card,
      },
    },
    infoCard: {
      bg: colors.primary.light,
      borderRadius: "lg",
      p: 6,
      transition: "all 0.2s ease-in-out",
      _hover: {
        transform: "translateY(-2px)",
        boxShadow: colors.shadow.sm,
      },
    },
    button: {
      primary: {
        bg: colors.primary.default,
        color: colors.text.inverse,
        fontWeight: "bold",
        px: 8,
        _hover: { 
          bg: colors.primary.hover,
          transform: "translateY(-1px)",
          boxShadow: colors.shadow.md,
        },
        _active: {
          bg: colors.primary.dark,
          transform: "translateY(0)",
        },
      },
      secondary: {
        bg: colors.primary.light,
        color: colors.primary.default,
        fontWeight: "bold",
        px: 8,
        borderWidth: "1px",
        borderColor: "transparent",
        _hover: { 
          bg: colors.primary.alpha,
          borderColor: colors.primary.default,
          transform: "translateY(-1px)",
          boxShadow: colors.shadow.sm,
        },
        _active: {
          bg: colors.primary.light,
          transform: "translateY(0)",
        },
      },
      outline: {
        bg: "transparent",
        color: colors.primary.default,
        borderColor: colors.primary.default,
        borderWidth: "1px",
        fontWeight: "bold",
        _hover: {
          bg: colors.primary.alpha,
          transform: "translateY(-1px)",
          boxShadow: colors.shadow.sm,
        },
        _active: {
          bg: colors.primary.light,
          transform: "translateY(0)",
        },
      },
    },
    text: {
      heading: {
        color: colors.text.primary,
        letterSpacing: "tight",
        lineHeight: "shorter",
      },
      subheading: {
        color: colors.text.secondary,
        letterSpacing: "wide",
        fontWeight: "medium",
      },
      body: {
        color: colors.text.secondary,
        lineHeight: "tall",
      },
      gradient: {
        bgGradient: `linear(to-r, ${colors.primary.default}, ${colors.accent.info.default})`,
        bgClip: "text",
        letterSpacing: "tight",
        lineHeight: "shorter",
      },
    },
    badge: {
      success: {
        bg: colors.accent.success.bg,
        color: colors.accent.success.default,
        px: 4,
        py: 1,
        borderRadius: "full",
        fontWeight: "bold",
        borderWidth: "1px",
        borderColor: "transparent",
        _hover: {
          borderColor: colors.accent.success.default,
        },
      },
      info: {
        bg: colors.accent.info.bg,
        color: colors.accent.info.default,
        px: 4,
        py: 1,
        borderRadius: "full",
        fontWeight: "bold",
        borderWidth: "1px",
        borderColor: "transparent",
        _hover: {
          borderColor: colors.accent.info.default,
        },
      },
      warning: {
        bg: colors.accent.warning.bg,
        color: colors.accent.warning.default,
        px: 4,
        py: 1,
        borderRadius: "full",
        fontWeight: "bold",
        borderWidth: "1px",
        borderColor: "transparent",
        _hover: {
          borderColor: colors.accent.warning.default,
        },
      },
    },
    icon: {
      primary: {
        color: colors.primary.default,
        boxSize: { base: 5, md: 6 },
        transition: "all 0.2s ease-in-out",
        _groupHover: {
          transform: "scale(1.1)",
          color: colors.primary.hover,
        },
      },
      secondary: {
        color: colors.text.secondary,
        boxSize: { base: 4, md: 5 },
        transition: "all 0.2s ease-in-out",
        _groupHover: {
          color: colors.text.primary,
        },
      },
      accent: {
        color: colors.text.accent,
        boxSize: { base: 5, md: 6 },
        transition: "all 0.2s ease-in-out",
        _groupHover: {
          transform: "scale(1.1) rotate(5deg)",
        },
      },
    },
    link: {
      default: {
        color: colors.text.secondary,
        transition: "all 0.2s ease-in-out",
        _hover: {
          color: colors.hover.link,
          textDecoration: "none",
        },
      },
      accent: {
        color: colors.primary.default,
        transition: "all 0.2s ease-in-out",
        _hover: {
          color: colors.primary.hover,
          textDecoration: "none",
        },
      },
    },
    dialog: {
      overlay: {
        bg: useColorModeValue("blackAlpha.600", "blackAlpha.800"),
        backdropFilter: "blur(4px)",
      },
      content: {
        bg: colors.cardBg,
        borderColor: colors.border,
        boxShadow: colors.shadow.lg,
      },
    },
    floatingButton: {
      position: "fixed",
      bottom: { base: 4, md: 8 },
      right: { base: 4, md: 8 },
      zIndex: 10,
      bg: colors.cardBg,
      color: colors.primary.default,
      borderWidth: "1px",
      borderColor: colors.border,
      boxShadow: colors.shadow.lg,
      _hover: {
        bg: colors.primary.light,
        color: colors.primary.hover,
        transform: "translateY(-2px)",
      },
    },
    scrollTopButton: {
      position: "fixed",
      bottom: { base: 20, md: 24 },
      right: { base: 4, md: 8 },
      zIndex: 10,
      bg: colors.cardBg,
      color: colors.primary.default,
      borderWidth: "1px",
      borderColor: colors.border,
      boxShadow: colors.shadow.lg,
      transform: showScrollTop ? "translateX(0)" : "translateX(100px)",
      opacity: showScrollTop ? 1 : 0,
      transition: "all 0.3s ease-in-out",
      _hover: {
        bg: colors.primary.light,
        color: colors.primary.hover,
        transform: showScrollTop ? "translateX(0) translateY(-2px)" : "translateX(100px)",
      },
    },
  };

  const scheduleDisclosure = useDisclosure();
  const guideDisclosure = useDisclosure();
  const [activeTab, setActiveTab] = useState('overview');

  const scheduleData = [
    { phase: '1차 모집', period: '2024.03.01 - 2024.03.31', status: '진행 예정' },
    { phase: '1차 심사', period: '2024.04.01 - 2024.04.15', status: '진행 예정' },
    { phase: '2차 모집', period: '2024.07.01 - 2024.07.31', status: '진행 예정' },
    { phase: '2차 심사', period: '2024.08.01 - 2024.08.15', status: '진행 예정' },
  ];

  return (
    <Box bg={colors.bg} minH="100vh">
      {/* Top Banner */}
      <Box 
        bg={colors.primary.default} 
        color={colors.text.inverse} 
        py={2}
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow={colors.shadow.sm}
      >
        <Container {...styles.container}>
          <Flex justify="space-between" align="center">
            <HStack gap="4">
              <Text fontSize="sm" fontWeight="medium">현재 진행중: 2024년 1차 모집 (03.01 - 03.31)</Text>
              <Badge {...styles.badge.success}>
                신청가능
              </Badge>
            </HStack>
            <HStack gap="6" fontSize="sm">
              <Tooltip content="로그인하여 신청 현황을 확인하세요" showArrow>
                <Link 
                  href="#" 
                  _hover={{ color: colors.primary.hover }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Box as={LuUser} {...styles.icon.secondary} />
                  <Text>로그인</Text>
                </Link>
              </Tooltip>
              <Link 
                href="#" 
                _hover={{ color: colors.primary.hover }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box as={LuUserPlus} {...styles.icon.secondary} />
                <Text>회원가입</Text>
              </Link>
              <Link 
                href="#" 
                _hover={{ color: colors.primary.hover }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box as={LuMenu} {...styles.icon.secondary} />
                <Text>사이트맵</Text>
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container {...styles.container}>
        {/* Navigation */}
        <Flex 
          align="center" 
          gap={2} 
          color={colors.text.secondary} 
          my={6}
          role="navigation"
          aria-label="Breadcrumb"
        >
          <Link 
            as={NextLink} 
            href="/" 
            display="flex" 
            alignItems="center" 
            gap={1}
            _hover={{ color: colors.primary.default }}
            role="group"
          >
            <Box as={HiHome} {...styles.icon.primary} />
            <Text fontWeight="medium">홈</Text>
          </Link>
          <Box as={LuChevronRight} {...styles.icon.secondary} />
          <Text fontWeight="medium">사업소개</Text>
        </Flex>

        {/* Hero Section */}
        <Box
          {...styles.card}
          bg={colors.secondary.light}
          p={{ base: 8, md: 12, lg: 16 }}
          mb={16}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            right={0}
            w="50%"
            h="100%"
            bgGradient={`linear(to-l, ${colors.primary.default}, transparent)`}
            opacity={0.1}
            transform="skewX(-15deg)"
          />
          <VStack align="start" gap={8} maxW="800px">
            <HStack gap={4}>
              <Badge {...styles.badge.info}>
                2024년 신규사업
              </Badge>
              <Badge {...styles.badge.success}>
                모집중
              </Badge>
            </HStack>
            <VStack align="start" gap={4}>
              <Heading 
                as="h1" 
                size="2xl" 
                {...styles.text.heading}
                bgGradient={styles.text.gradient.bgGradient}
                bgClip={styles.text.gradient.bgClip}
              >
                부산창업가꿈
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                {...styles.text.body}
                maxW="3xl"
              >
                청년 창업가를 위한 종합 지원 사업으로, 창업 초기 청년들에게 필요한 공간, 네트워크, 교육 등을 
                종합적으로 제공하여 안정적인 창업 환경을 구축하고, 지속 가능한 비즈니스 모델 구축을 지원합니다.
              </Text>
            </VStack>
            <SimpleGrid 
              columns={{ base: 1, md: 3 }} 
              gap={6} 
              w="full"
              mt={4}
            >
              <CustomButton
                size="lg"
                {...styles.button.primary}
                onClick={() => window.location.href = '/apply'}
                rightIcon={<LuExternalLink />}
              >
                사업 신청하기
              </CustomButton>
              <CustomButton
                size="lg"
                {...styles.button.secondary}
                onClick={scheduleDisclosure.onOpen}
                rightIcon={<LuCalendar />}
              >
                모집 일정 확인
              </CustomButton>
              <CustomButton
                size="lg"
                {...styles.button.secondary}
                onClick={guideDisclosure.onOpen}
                rightIcon={<LuInfo />}
              >
                신청 가이드
              </CustomButton>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Quick Stats */}
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 4 }} 
          gap={8} 
          mb={16}
        >
          {[
            { icon: LuTarget, title: '지원 규모', value: '최대 2억원', desc: '기업당 지원금' },
            { icon: LuUsers, title: '모집 인원', value: '20개사', desc: '연간 선발 기업' },
            { icon: LuGraduationCap, title: '멘토링', value: '전담 멘토 배정', desc: '1:1 밀착 지원' },
            { icon: LuBuilding, title: '입주 공간', value: '무상 제공', desc: '최대 2년' },
          ].map((stat, idx) => (
            <Box
              key={idx}
              {...styles.card}
              p={8}
              textAlign="center"
              role="group"
            >
              <VStack gap={6}>
                <Box {...styles.icon.primary}>
                  <stat.icon size={48} />
                </Box>
                <VStack gap={2}>
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
                    fontSize="3xl" 
                    color={colors.primary.default} 
                    fontWeight="bold"
                    letterSpacing="tight"
                  >
                    {stat.value}
                  </Text>
                  <Text 
                    {...styles.text.body}
                    fontSize="sm"
                  >
                    {stat.desc}
                  </Text>
                </VStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Box mb={8}>
          <HStack gap="4" mb={6}>
            {[
              { id: 'overview', label: '사업 개요' },
              { id: 'benefits', label: '지원 내용' },
              { id: 'eligibility', label: '신청 자격' },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'solid' : 'ghost'}
                {...(activeTab === tab.id ? styles.button.primary : styles.button.secondary)}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </HStack>

          <Box {...styles.card} p={8}>
            {activeTab === 'overview' && (
              <VStack align="start" gap="6">
                <Heading as="h2" size="lg" color={colors.primary.default}>
                  사업 개요
                </Heading>
                <Text fontSize="lg">
                  부산창업가꿈은 청년 창업가들이 혁신적인 아이디어로 사회적 가치를 창출하고 
                  지역 경제에 기여할 수 있도록 돕는 것을 목표로 합니다.
                </Text>
                <Stack gap="4">
                  <HStack>
                    <LuCheck color={colors.primary.default} />
                    <Text>창업 초기 기업 대상 맞춤형 성장 지원</Text>
                  </HStack>
                  <HStack>
                    <LuCheck color={colors.primary.default} />
                    <Text>전문가 멘토링 및 네트워킹 프로그램 운영</Text>
                  </HStack>
                  <HStack>
                    <LuCheck color={colors.primary.default} />
                    <Text>사무공간 및 주거공간 무상 제공</Text>
                  </HStack>
                </Stack>
              </VStack>
            )}

            {activeTab === 'benefits' && (
              <VStack align="start" gap="6">
                <Heading as="h2" size="lg" color={colors.primary.default}>
                  지원 내용
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} w="full">
                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      사업화 자금
                    </Heading>
                    <Stack gap="3">
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>기업당 최대 2억원 지원</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>시제품 제작 및 마케팅 비용</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>특허 출원 및 인증 획득 지원</Text>
                      </HStack>
                    </Stack>
                  </Box>
                  <Box>
                    <Heading as="h3" size="md" mb={4}>
                      공간 지원
                    </Heading>
                    <Stack gap="3">
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>독립 사무실 무상 제공</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>공용 회의실 및 휴게공간</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>기숙사형 주거공간 제공</Text>
                      </HStack>
                    </Stack>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}

            {activeTab === 'eligibility' && (
              <VStack align="start" gap="6">
                <Heading as="h2" size="lg" color={colors.primary.default}>
                  신청 자격
                </Heading>
                <Accordion.Root  w="full" >
                  <Accordion.Item value="basic-eligibility">
                    <h3>
                      <Accordion.ItemTrigger>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          기본 자격 요건
                        </Box>
                        <Accordion.ItemIndicator />
                      </Accordion.ItemTrigger>
                    </h3>
                    <Accordion.ItemContent>
                      <Stack gap="3">
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>만 39세 이하의 청년 창업가</Text>
                        </HStack>
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>창업 7년 이내 기업</Text>
                        </HStack>
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>부산광역시 소재 기업</Text>
                        </HStack>
                      </Stack>
                    </Accordion.ItemContent>
                  </Accordion.Item>

                  <Accordion.Item value="priority-eligibility">
                    <h3>
                      <Accordion.ItemTrigger>
                        <Box flex="1" textAlign="left" fontWeight="bold">
                          우대 사항
                        </Box>
                        <Accordion.ItemIndicator />
                      </Accordion.ItemTrigger>
                    </h3>
                    <Accordion.ItemContent>
                      <Stack gap="3">
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>특허/실용신안 보유 기업</Text>
                        </HStack>
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>정부 지원사업 수행 실적 보유</Text>
                        </HStack>
                        <HStack>
                          <LuCheck color={colors.primary.default} />
                          <Text>벤처기업 인증 보유</Text>
                        </HStack>
                      </Stack>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                </Accordion.Root>
              </VStack>
            )}
          </Box>
        </Box>

        {/* Contact Information */}
        <Box {...styles.card} p={8} mb={16}>
          <Heading as="h2" size="lg" mb={8} {...styles.text.heading}>
            문의 및 위치
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            <VStack align="start" gap="6">
              <Box w="full">
                <Image
                  src="/images/location-map.png"
                  alt="부산창업가꿈 위치"
                  borderRadius="md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300?text=지도+이미지";
                  }}
                />
              </Box>
              <CustomButton
                {...styles.button.outline}
                rightIcon={<LuMapPin />}
                onClick={() => window.open('https://map.naver.com')}
              >
                네이버 지도로 보기
              </CustomButton>
            </VStack>
            <VStack align="start" gap="6">
              <Box
                w="full"
                p={4}
                bg={colors.secondary.light}
                borderRadius="md"
              >
                <HStack gap={4}>
                  <Box color={colors.primary.default}>
                    <LuClock size={24} />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="bold" fontSize="lg">운영시간</Text>
                    <Text>월~금 09:00 ~ 20:00</Text>
                    <Text fontSize="sm" color="gray.600">(주말·공휴일 상황에 따라 변동)</Text>
                  </VStack>
                </HStack>
              </Box>

              <Box
                w="full"
                p={4}
                bg={colors.secondary.light}
                borderRadius="md"
              >
                <HStack gap={4}>
                  <Box color={colors.primary.default}>
                    <LuMapPin size={24} />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="bold" fontSize="lg">위치</Text>
                    <Text>부산광역시 연제구 고분로 170</Text>
                    <Text>부산경상대학교 학생회관 1층</Text>
                    <Text fontSize="sm" color="gray.600">규모: 529.9m² / 기숙사 B동 (303.12m²)</Text>
                  </VStack>
                </HStack>
              </Box>

              <Box
                w="full"
                p={4}
                bg={colors.secondary.light}
                borderRadius="md"
              >
                <HStack gap={4}>
                  <Box color={colors.primary.default}>
                    <LuPhone size={24} />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="bold" fontSize="lg">연락처</Text>
                    <Text>부산경상대학교 산학협력단: 051-850-1053</Text>
                    <Text>부산창업가꿈: 051-850-1196</Text>
                  </VStack>
                </HStack>
              </Box>

              <Box
                w="full"
                p={4}
                bg={colors.secondary.light}
                borderRadius="md"
              >
                <HStack gap={4}>
                  <Box color={colors.primary.default}>
                    <LuMail size={24} />
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text fontWeight="bold" fontSize="lg">이메일</Text>
                    <Text>jyt56@bsks.ac.kr</Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </SimpleGrid>
        </Box>
      </Container>

      {/* Footer */}
      <Box bg={colors.cardBg} py={8} borderTop="1px" borderColor={colors.border}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={8}>
            <VStack align="start">
              <Text fontWeight="bold" mb={2}>관련 사이트</Text>
              <Link 
                href="https://www.busan.go.kr" 
                target="_blank" 
                rel="noopener noreferrer" 
                color="gray.600"
                _hover={{ color: colors.primary.default }}
              >
                부산광역시청
              </Link>
              <Link 
                href="https://www.btp.or.kr" 
                target="_blank" 
                rel="noopener noreferrer" 
                color="gray.600"
                _hover={{ color: colors.primary.default }}
              >
                부산테크노파크
              </Link>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold" mb={2}>문의 안내</Text>
              <Text color={colors.text.secondary}>평일 09:00 - 18:00</Text>
              <Text color={colors.text.secondary}>점심시간 12:00 - 13:00</Text>
              <CustomButton
                size="sm"
                {...styles.button.outline}
                rightIcon={<LuDownload />}
                mt={2}
              >
                사업안내 브로셔
              </CustomButton>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold" mb={2}>개인정보처리방침</Text>
              <Link href="#" color="gray.600" _hover={{ color: colors.primary.default }}>
                개인정보처리방침
              </Link>
              <Link href="#" color="gray.600" _hover={{ color: colors.primary.default }}>
                이용약관
              </Link>
            </VStack>
            <VStack align="start">
              <Text fontWeight="bold" mb={2}>SNS</Text>
              <HStack gap="4">
                <IconButton
                  aria-label="Facebook"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <LuFacebook />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <LuInstagram />
                </IconButton>
                <IconButton
                  aria-label="Youtube"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <LuYoutube />
                </IconButton>
              </HStack>
            </VStack>
          </SimpleGrid>
          <Separator my={8} />
          <Text color="gray.500" fontSize="sm" textAlign="center">
            © 2024 부산창업가꿈. All rights reserved.
          </Text>
        </Container>
      </Box>

      {/* Floating Buttons */}
      <Box
        position="fixed"
        bottom={{ base: 4, md: 8 }}
        right={{ base: 4, md: 8 }}
        zIndex={10}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <IconButton
          aria-label={colorMode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          onClick={toggleColorMode}
          bg={colors.cardBg}
          color={colors.primary.default}
          borderWidth="1px"
          borderColor={colors.border}
          boxShadow={colors.shadow.lg}
          _hover={{
            bg: colors.primary.light,
            color: colors.primary.hover,
            transform: "translateY(-2px)",
          }}
        >
          {colorMode === 'light' ? <LuMoon /> : <LuSun />}
        </IconButton>
        <IconButton
          aria-label="맨 위로 이동"
          onClick={scrollToTop}
          bg={colors.cardBg}
          color={colors.primary.default}
          borderWidth="1px"
          borderColor={colors.border}
          boxShadow={colors.shadow.lg}
          transform={showScrollTop ? "translateX(0)" : "translateX(100px)"}
          opacity={showScrollTop ? 1 : 0}
          transition="all 0.3s ease-in-out"
          _hover={{
            bg: colors.primary.light,
            color: colors.primary.hover,
            transform: showScrollTop ? "translateX(0) translateY(-2px)" : "translateX(100px)",
          }}
        >
          <LuArrowUp />
        </IconButton>
      </Box>

      {/* Dialogs */}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <CustomButton {...styles.button.secondary}>
            모집 일정 확인
          </CustomButton>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop {...styles.dialog.overlay} />
          <Dialog.Positioner>
            <Dialog.Content {...styles.dialog.content}>
              <Dialog.Header borderBottomColor={colors.border}>
                <Dialog.Title {...styles.text.heading}>2024년 모집 일정</Dialog.Title>
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
                      <HStack justify="space-between">
                        <VStack align="start" gap="1">
                          <Text fontWeight="bold">{item.phase}</Text>
                          <Text color={colors.text.secondary}>{item.period}</Text>
                        </VStack>
                        <Badge
                          colorScheme={
                            item.status === '진행중' ? 'green' :
                            item.status === '진행 예정' ? 'blue' : 'gray'
                          }
                        >
                          {item.status}
                        </Badge>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <CustomButton {...styles.button.secondary}>
            신청 가이드
          </CustomButton>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>신청 가이드</Dialog.Title>
                <Dialog.CloseTrigger position="absolute" top={2} right={2}>
                  ✕
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack gap="6" align="stretch">
                  <Box>
                    <Heading size="sm" mb={3}>준비 서류</Heading>
                    <Stack gap="2">
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>사업계획서 (지정양식)</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>사업자등록증 사본</Text>
                      </HStack>
                      <HStack>
                        <LuCheck color={colors.primary.default} />
                        <Text>대표자 주민등록등본</Text>
                      </HStack>
                    </Stack>
                  </Box>
                  <Box>
                    <Heading size="sm" mb={3}>신청 절차</Heading>
                    <Stack gap="2">
                      <HStack>
                        <Text>1.</Text>
                        <Text>회원가입 및 로그인</Text>
                      </HStack>
                      <HStack>
                        <Text>2.</Text>
                        <Text>신청서 작성 및 제출</Text>
                      </HStack>
                      <HStack>
                        <Text>3.</Text>
                        <Text>서류 심사</Text>
                      </HStack>
                      <HStack>
                        <Text>4.</Text>
                        <Text>대면 평가</Text>
                      </HStack>
                      <HStack>
                        <Text>5.</Text>
                        <Text>최종 선정</Text>
                      </HStack>
                    </Stack>
                  </Box>
                  <CustomButton
                    colorScheme="blue"
                    onClick={() => window.location.href = '/download/guide.pdf'}
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
    </Box>
  );
}
