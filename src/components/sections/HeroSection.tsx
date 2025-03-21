import {
  Box,
  Container,
  Text,
  Button,
  Flex,
  IconButton,
  Heading,
  Link,
  Breadcrumb,
} from "@chakra-ui/react";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { useColors } from "@/styles/theme";
import { useSlideContents } from "../ui/breadcrumb";
import { usePathname } from "next/navigation";

const MotionBox = motion.create(Box);

export interface SlideContent {
  header?: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface HeroSectionProps {
  slideContents: () => SlideContent[];
}

export function HeroSection({ slideContents }: HeroSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contents, setContents] = useState<SlideContent[]>([]);

  const colors = useColors();
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const getSlideContents = useSlideContents();

  if (paths.length === 0) return null;

  const routeMap: { [key: string]: string } = {
    about: "소개",
    companies: "입주 기업",
    contact: "문의하기",
    education: "교육 프로그램",
    news: "소식",
    application: "입주 신청",
  };
  const linkStyles = {
    color: colors.text.primary,
    transition: "all 0.2s",
    fontSize: "xl",
    fontWeight: "bold",
    position: "relative" as const,
    _after: {
      content: '""',
      position: "absolute" as const,
      bottom: "-2px",
      left: 0,
      width: "100%",
      height: "2px",
      bg: colors.primary.default,
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.2s ease-in-out",
    },
    _hover: {
      color: colors.primary.default,
      _after: {
        transform: "scaleX(1)",
        transformOrigin: "left",
      },
    },
  };
  useEffect(() => {
    setContents(slideContents());
  }, [slideContents]);

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
        if (nextPage < 0) return contents.length - 1;
        if (nextPage >= contents.length) return 0;
        return nextPage;
      });
    },
    [isAnimating, contents.length]
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

  if (contents.length === 0) return null;

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
          {contents.length > 1 && (
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
                  width={`${((currentPage + 1) / contents.length) * 100}%`}
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
                    {String(contents.length).padStart(2, "0")}
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
          )}

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
              backgroundImage={`url(${contents[currentPage]?.image})`}
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
                  {contents[currentPage]?.header && (
                    <Text
                      fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      color={
                        contents[currentPage]?.subtitle ? "#0D344E" : colors.bg
                      }
                      lineHeight="1.6"
                      whiteSpace="pre-line"
                    >
                      {contents[currentPage]?.header}
                    </Text>
                  )}
                  <Heading
                    as="h1"
                    fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
                    fontWeight="extrabold"
                    mb={contents[currentPage]?.header ? 6 : 2}
                    color={
                      contents[currentPage]?.subtitle ? "#0D344E" : colors.bg
                    }
                    lineHeight="1.2"
                  >
                    {contents[currentPage]?.title}
                  </Heading>
                  {contents[currentPage]?.subtitle && (
                    <Text
                      fontSize={{ base: "md", sm: "lg", md: "xl" }}
                      mb={{ base: 8, md: 28 }}
                      fontWeight="bold"
                      color={
                        contents[currentPage]?.subtitle ? "#0D344E" : colors.bg
                      }
                      lineHeight="1.6"
                      whiteSpace="pre-line"
                    >
                      {contents[currentPage]?.subtitle}
                    </Text>
                  )}
                  {contents[currentPage]?.header ? (
                    <Box
                      backgroundColor="white"
                      borderRadius="full"
                      border="1px solid"
                      borderColor={colors.border}
                      py={4}
                      px={8}
                      w="fit-content"
                    >
                      <Breadcrumb.Root size="md">
                        <Breadcrumb.List>
                          <Breadcrumb.Item>
                            <Breadcrumb.Link as={Link} href="/" {...linkStyles}>
                              Home
                            </Breadcrumb.Link>
                          </Breadcrumb.Item>

                          {paths.map((path, index) => {
                            if (path === "routes") return null;
                            const isLast = index === paths.length - 1;
                            const href = `/${paths
                              .slice(0, index + 1)
                              .join("/")}`;
                            const label = routeMap[path] || path;

                            return (
                              <React.Fragment key={`separator-${path}`}>
                                <Breadcrumb.Separator>
                                  <Box
                                    as="span"
                                    color="gray.400"
                                    mx={2}
                                    fontSize="sm"
                                    fontWeight="light"
                                  >
                                    /
                                  </Box>
                                </Breadcrumb.Separator>
                                <Breadcrumb.Item>
                                  {isLast ? (
                                    <Breadcrumb.CurrentLink
                                      color={colors.text.primary}
                                      fontSize="xl"
                                      fontWeight="bold"
                                    >
                                      {label}
                                    </Breadcrumb.CurrentLink>
                                  ) : (
                                    <Breadcrumb.Link
                                      as={Link}
                                      href={href}
                                      {...linkStyles}
                                    >
                                      {label}
                                    </Breadcrumb.Link>
                                  )}
                                </Breadcrumb.Item>
                              </React.Fragment>
                            );
                          })}
                        </Breadcrumb.List>
                      </Breadcrumb.Root>
                    </Box>
                  ) : (
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
                  )}
                </Flex>
              </Container>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}
