import {
  Box,
  Container,
  Text,
  Button,
  Flex,
  IconButton,
  Heading,
  Link,
} from "@chakra-ui/react";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const MotionBox = motion.create(Box);

interface SlideContent {
  title: string;
  subtitle: string;
  image: string;
}

export function HeroSection() {
  const [currentPage, setCurrentPage] = useState(0);
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
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + newDirection;
        if (nextPage < 0) return slideContents.length - 1;
        if (nextPage >= slideContents.length) return 0;
        return nextPage;
      });
    },
    [isAnimating, slideContents.length]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage]);

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
    <Box px={0} py={24}>
      <Container maxW="1920px">
        <Box
          position="relative"
          height={{ base: "400px", md: "500px", lg: "680px" }}
          overflow="hidden"
          borderRadius={{ base: "20px", md: "26px" }}
        >
          {/* Controller Background */}
          <Box
            position="absolute"
            bottom={0}
            right={0}
            width={{ base: "100%", md: "400px" }}
            height={{ base: "60px", md: "80px" }}
            bg="white"
            borderTopLeftRadius={{ base: "0", md: "24px" }}
            zIndex={3}
            display="flex"
            alignItems="center"
            px={{ base: 4, md: 8 }}
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
                width={`${((currentPage + 1) / slideContents.length) * 100}%`}
                bg="blue.500"
                transition="width 0.3s ease"
              />
            </Box>

            {/* Navigation */}
            <Flex align="center" gap={6} ml={8}>
              <Flex align="center" gap={3}>
                <Text color="gray.900" fontSize="xl" fontWeight="bold">
                  {String(currentPage + 1).padStart(2, "0")}
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

          <AnimatePresence initial={false} custom={currentPage}>
            <MotionBox
              key={currentPage}
              custom={currentPage}
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
              backgroundImage={`url(${slideContents[currentPage].image})`}
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
                  <Heading
                    as="h1"
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
                    fontWeight="extrabold"
                    mb={2}
                    color="#0D344E"
                    lineHeight="1.2"
                  >
                    {slideContents[currentPage].title}
                  </Heading>
                  <Text
                    fontSize={{ base: "md", sm: "lg", md: "xl" }}
                    mb={{ base: 8, md: 28 }}
                    fontWeight="bold"
                    color="#0D344E"
                    lineHeight="1.6"
                    whiteSpace="pre-line"
                  >
                    {slideContents[currentPage].subtitle}
                  </Text>
                  <Flex
                    gap={4}
                    flexWrap="wrap"
                    flexDirection="column"
                    maxW="3xs"
                  >
                    <Link href="/routes/recruit/guide">
                      <Button
                        size="md"
                        variant="outline"
                        color="blue.500"
                        borderColor="blue.500"
                        p={6}
                        fontSize="lg"
                        borderRadius="full"
                        borderWidth={2}
                        _hover={{
                          transform: "translateX(10px)",
                          bg: "transparent",
                        }}
                        transition="all 0.2s"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="bold">창업 신청하기</Text>
                        <Box as={LuArrowRight} boxSize={4} />
                      </Button>
                    </Link>
                    <Link href="/routes/about/vision">
                      <Button
                        size="md"
                        variant="outline"
                        color="#7A40DD"
                        borderColor="#7A40DD"
                        p={6}
                        fontSize="lg"
                        borderRadius="full"
                        borderWidth={2}
                        _hover={{
                          transform: "translateX(10px)",
                          bg: "transparent",
                        }}
                        transition="all 0.2s"
                        justifyContent="space-between"
                      >
                        <Text fontWeight="bold">창업기관 소개</Text>
                        <Box as={LuArrowRight} boxSize={4} />
                      </Button>
                    </Link>
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
