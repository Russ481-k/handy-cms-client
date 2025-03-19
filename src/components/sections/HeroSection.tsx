import {
  Box,
  Container,
  Text,
  Button,
  Flex,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";

const MotionBox = motion(Box);

interface SlideContent {
  title: string;
  subtitle: string;
  image: string;
}

interface HeroSectionProps {
  isDark?: boolean;
}

export function HeroSection({ isDark = false }: HeroSectionProps) {
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
      image: "/images/banners/banner_2.gif",
    },
    {
      title: "함께 성장하는 창업 생태계",
      subtitle: "다양한 분야의 전문가와 함께\n창업의 모든 단계를 지원합니다",
      image: "/images/banners/banner_3.gif",
    },
  ];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback(
    (newDirection: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setPage(([currentPage]) => {
        const nextPage = currentPage + newDirection;
        if (nextPage < 0) return [0, newDirection];
        if (nextPage >= slideContents.length)
          return [slideContents.length - 1, newDirection];
        return [nextPage, newDirection];
      });
    },
    [isAnimating, slideContents.length]
  );

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
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg={isDark ? "gray.900" : "white"}
    >
      <Container maxW="container.xl" py={16}>
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
            position="relative"
            width="100%"
            height="100%"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={8}
            >
              <Box flex="1">
                <Heading
                  as="h1"
                  size="2xl"
                  mb={4}
                  color={isDark ? "white" : "gray.800"}
                >
                  {slideContents[page].title}
                </Heading>
                <Text
                  fontSize="xl"
                  mb={8}
                  whiteSpace="pre-line"
                  color={isDark ? "gray.300" : "gray.600"}
                >
                  {slideContents[page].subtitle}
                </Text>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={() => {
                    // 신청하기 버튼 클릭 시 처리
                  }}
                >
                  신청하기 <LuArrowRight style={{ marginLeft: "0.5rem" }} />
                </Button>
              </Box>
              <Box
                flex="1"
                position="relative"
                width="100%"
                height={{ base: "300px", md: "400px" }}
              >
                <Image
                  src={slideContents[page].image}
                  alt={slideContents[page].title}
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                  }}
                />
              </Box>
            </Flex>
          </MotionBox>
        </AnimatePresence>

        <Flex justify="center" mt={8} gap={4}>
          <IconButton
            aria-label="Previous slide"
            onClick={() => paginate(-1)}
            disabled={page === 0}
            variant="ghost"
            color={isDark ? "gray.300" : "gray.600"}
            _hover={{ bg: isDark ? "gray.700" : "gray.100" }}
          >
            <LuChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            onClick={() => paginate(1)}
            disabled={page === slideContents.length - 1}
            variant="ghost"
            color={isDark ? "gray.300" : "gray.600"}
            _hover={{ bg: isDark ? "gray.700" : "gray.100" }}
          >
            <LuChevronRight />
          </IconButton>
        </Flex>
      </Container>
    </Box>
  );
}
