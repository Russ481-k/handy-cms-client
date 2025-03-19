import {
  Box,
  Container,
  Text,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  isDark: boolean;
}

const MotionBox = motion(Box);

interface SlideContent {
  title: string;
  subtitle: string;
  image: string;
}

export function HeroSection({ isDark }: HeroSectionProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const slideContents: SlideContent[] = [
    {
      title: "AI와 함께 창업의 미래를 열다!",
      subtitle:
        "창업 공간 + 맞춤 교육 + 추가 지원까지\n지금 창업의 꿈을 실현하세요!",
      image: "/images/banners/banner_1.jpg",
    },
    {
      title: "혁신적인 창업 지원 시스템",
      subtitle:
        "AI 기반 맞춤형 솔루션으로\n당신의 창업을 성공으로 이끌어드립니다",
      image: "/images/banners/banner_1.jpg",
    },
    {
      title: "함께 성장하는 창업 생태계",
      subtitle: "다양한 분야의 전문가와 함께\n창업의 모든 단계를 지원합니다",
      image: "/images/banners/banner_1.jpg",
    },
  ];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPage(([prevPage]) => {
      const nextPage = prevPage + newDirection;
      if (nextPage < 0) return [slideContents.length - 1, newDirection];
      if (nextPage >= slideContents.length) return [0, newDirection];
      return [nextPage, newDirection];
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <Box px={0} py={8}>
      <Container maxW="1920px">
        <Box
          position="relative"
          height="680px"
          overflow="hidden"
          borderRadius="24px"
        >
          {/* Controller Background */}
          <Box
            position="absolute"
            bottom={0}
            right={0}
            width="400px"
            height="80px"
            bg="white"
            borderTopLeftRadius="24px"
            zIndex={3}
            display="flex"
            alignItems="center"
            px={8}
          >
            {/* Progress Bar */}
            <Box
              flex={1}
              height="2px"
              bg="gray.100"
              borderRadius="full"
              overflow="hidden"
              position="relative"
            >
              <Box
                position="absolute"
                left={0}
                top={0}
                height="100%"
                width={`${((page + 1) / slideContents.length) * 100}%`}
                bg="blue.500"
                transition="width 0.3s ease"
              />
            </Box>

            {/* Navigation */}
            <Flex align="center" gap={6} ml={8}>
              <Flex align="center" gap={3}>
                <Text color="gray.900" fontSize="xl" fontWeight="bold">
                  {String(page + 1).padStart(2, "0")}
                </Text>
                <Box w="1px" h="20px" bg="gray.200" />
                <Text color="gray.400" fontSize="xl">
                  {String(slideContents.length).padStart(2, "0")}
                </Text>
              </Flex>
              <Flex gap={2}>
                <IconButton
                  aria-label="Previous slide"
                  variant="ghost"
                  size="lg"
                  color="gray.400"
                  borderRadius="full"
                  onClick={() => paginate(-1)}
                  _hover={{ color: "gray.900", bg: "gray.50" }}
                  transition="all 0.2s"
                >
                  <Box as={LuChevronLeft} boxSize={6} />
                </IconButton>
                <IconButton
                  aria-label="Next slide"
                  variant="ghost"
                  size="lg"
                  color="gray.400"
                  borderRadius="full"
                  onClick={() => paginate(1)}
                  _hover={{ color: "gray.900", bg: "gray.50" }}
                  transition="all 0.2s"
                >
                  <Box as={LuChevronRight} boxSize={6} />
                </IconButton>
              </Flex>
            </Flex>
          </Box>

          <AnimatePresence initial={false} custom={direction}>
            <MotionBox
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              position="absolute"
              width="100%"
              height="100%"
              backgroundImage={`url(${slideContents[page].image})`}
              backgroundSize="cover"
              backgroundPosition="center"
              onAnimationComplete={() => setIsAnimating(false)}
            >
              <Container
                maxW="container.xl"
                height="100%"
                position="relative"
                zIndex={2}
              >
                <Flex
                  direction="column"
                  justify="center"
                  height="100%"
                  maxW="3xl"
                  px={{ base: 4, md: 8 }}
                >
                  <Text
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="bold"
                    mb={4}
                    color="gray.900"
                    lineHeight="1.2"
                  >
                    {slideContents[page].title}
                  </Text>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    mb={8}
                    color="gray.700"
                    lineHeight="1.6"
                    whiteSpace="pre-line"
                  >
                    {slideContents[page].subtitle}
                  </Text>
                  <Flex gap={4} flexWrap="wrap">
                    <Button
                      size="lg"
                      bg="blue.500"
                      color="white"
                      px={8}
                      py={6}
                      fontSize="lg"
                      borderRadius="full"
                      _hover={{
                        bg: "blue.600",
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      <Text mr={2}>창업 신청하기</Text>
                      <Box as={LuArrowRight} boxSize={4} />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      color="gray.700"
                      borderColor="gray.300"
                      px={8}
                      py={6}
                      fontSize="lg"
                      borderRadius="full"
                      _hover={{
                        borderColor: "gray.400",
                        bg: "gray.50",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                    >
                      창업기관 소개
                    </Button>
                  </Flex>
                </Flex>
              </Container>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
