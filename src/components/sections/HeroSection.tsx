"use client";

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
import { usePathname } from "next/navigation";

const MotionBox = motion.create(Box);

export interface SlideContent {
  header?: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface HeroSectionProps {
  slideContents: SlideContent[];
}

export function HeroSection({ slideContents }: HeroSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = useColors();
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const routeMap: { [key: string]: string } = {
    about: "소개",
    companies: "입주 기업",
    contact: "문의하기",
    education: "교육 프로그램",
    news: "소식",
    application: "입주 신청",
  };
  const linkStyles = {
    color: colors.primary.dark,
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
    <Box bg={colors.bg}>
      <Container p={0} maxW="100%">
        <Box
          position="relative"
          height={{ base: "400px", md: "500px", lg: "118vh" }}
          overflow="hidden"
        >
          {slideContents.length > 1 && (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/cAJ2OoIWhiQ?autoplay=1&mute=1&loop=1&playlist=cAJ2OoIWhiQ&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
              style={{
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
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
              backgroundImage={`url(${slideContents[currentPage]?.image})`}
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
                >
                  {slideContents[currentPage]?.header && (
                    <Text
                      fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                      fontWeight="bold"
                      color={
                        slideContents[currentPage]?.subtitle
                          ? "#0D344E"
                          : "white"
                      }
                      lineHeight="1.6"
                      whiteSpace="pre-line"
                    >
                      {slideContents[currentPage]?.header}
                    </Text>
                  )}
                  <Heading
                    as="h1"
                    fontSize={
                      slideContents[currentPage]?.header
                        ? { base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }
                        : { base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }
                    }
                    fontWeight="extrabold"
                    mb={slideContents[currentPage]?.header ? 6 : 2}
                    color={
                      slideContents[currentPage]?.subtitle ? "#0D344E" : "white"
                    }
                    lineHeight="1.2"
                  >
                    {slideContents[currentPage]?.title}
                  </Heading>
                  {slideContents[currentPage]?.subtitle && (
                    <Text
                      fontSize={{ base: "md", sm: "lg", md: "xl" }}
                      mb={{ base: 8, md: 28 }}
                      fontWeight="bold"
                      color={
                        slideContents[currentPage]?.subtitle
                          ? "#0D344E"
                          : colors.bg
                      }
                      lineHeight="1.6"
                      whiteSpace="pre-line"
                    >
                      {slideContents[currentPage]?.subtitle}
                    </Text>
                  )}
                  {slideContents[currentPage]?.header ? (
                    <Box
                      backgroundColor="white"
                      borderRadius="full"
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
                                      color={colors.primary.dark}
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
