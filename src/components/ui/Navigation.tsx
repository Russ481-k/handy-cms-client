"use client";

import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Popover,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const menuItems = [
  {
    id: 1,
    name: "창업가꿈 소개",
    children: [
      {
        id: 5,
        name: "비전 및 목표",
        url: "/about/vision",
      },
      {
        id: 6,
        name: "주요프로그램",
        url: "/about/program",
      },
      {
        id: 7,
        name: "찾아오시는 길",
        url: "/about/location",
      },
    ],
  },
  {
    id: 2,
    name: "창업기업 모집",
    children: [
      {
        id: 8,
        name: "모집공고",
        url: "/recruit/notice",
      },
      {
        id: 9,
        name: "지원안내",
        url: "/recruit/guide",
      },
      {
        id: 10,
        name: "교육내용",
        url: "/recruit/education",
      },
      {
        id: 11,
        name: "FAQ",
        url: "/recruit/faq",
      },
    ],
  },
  {
    id: 3,
    name: "창업기업 소개",
    children: [
      {
        id: 12,
        name: "참여기업",
        url: "/companies/participants",
      },
      {
        id: 14,
        name: "참고자료실",
        url: "/companies/resources",
      },
    ],
  },
  {
    id: 4,
    name: "커뮤니티",
    children: [
      {
        id: 19,
        name: "답변게시판",
        url: "/community/qna",
      },
    ],
  },
];

export default function Navigation() {
  const { open: isMobileMenuOpen, onToggle: toggleMobileMenu } =
    useDisclosure();
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  return (
    <Box
      as="nav"
      bg="white"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <NextLink href="/" passHref>
            <Box as="a" fontWeight="bold" fontSize="xl">
              창업가꿈
            </Box>
          </NextLink>

          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={toggleMobileMenu}
            variant="ghost"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </IconButton>

          <HStack
            display={{ base: "none", md: "flex" }}
            width={{ base: "full", md: "auto" }}
            alignItems="center"
            gap={4}
          >
            {menuItems.map((item) => (
              <Popover.Root key={item.id}>
                <Popover.Trigger>
                  <Button variant="ghost">
                    {item.name}
                    <ChevronDownIcon />
                  </Button>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.CloseTrigger />
                    <Popover.Arrow>
                      <Popover.ArrowTip />
                    </Popover.Arrow>
                    <Popover.Body>
                      <Popover.Title />
                      <VStack align="stretch" gap={1}>
                        {item.children.map((child) => (
                          <NextLink key={child.id} href={child.url} passHref>
                            <Link
                              p={2}
                              borderRadius="md"
                              bg={isActive(child.url) ? "blue.50" : undefined}
                              _hover={{ bg: "gray.50" }}
                            >
                              {child.name}
                            </Link>
                          </NextLink>
                        ))}
                      </VStack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            ))}
          </HStack>
        </Flex>

        <Box
          display={{ base: isMobileMenuOpen ? "block" : "none", md: "none" }}
          pb={4}
        >
          <VStack align="stretch" gap={4}>
            {menuItems.map((item) => (
              <Box key={item.id}>
                <Text fontWeight="semibold" mb={2}>
                  {item.name}
                </Text>
                <VStack pl={4} align="stretch" gap={1}>
                  {item.children.map((child) => (
                    <NextLink key={child.id} href={child.url} passHref>
                      <Link
                        py={1}
                        color={isActive(child.url) ? "blue.500" : "gray.600"}
                        fontWeight={isActive(child.url) ? "semibold" : "normal"}
                      >
                        {child.name}
                      </Link>
                    </NextLink>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
