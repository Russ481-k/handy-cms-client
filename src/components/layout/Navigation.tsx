import { 
  Box, 
  Container, 
  Flex, 
  HStack, 
  Text, 
  Link,
  Button,
  VStack,
  IconButton,
  useDisclosure,
  useBreakpointValue,
  Portal,
  Icon
} from "@chakra-ui/react";
import { Drawer } from "@chakra-ui/react";
import { LuChevronDown, LuMenu } from "react-icons/lu";
import NextLink from 'next/link';
import { useColors, useStyles } from "@/styles/theme";
import { useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";

interface NavigationProps {
  isScrolled?: boolean;
}

export const Navigation = ({ isScrolled = false }: NavigationProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const colors = useColors();
  const styles = useStyles(colors, false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const { open, onOpen, onClose } = useDisclosure();
  
  // 반응형 설정
  const isMobile = useBreakpointValue({ base: true, md: false });

  // 메뉴 구조 정의
  const menuItems = [
    {
      title: '창업기업 모집',
      items: [
        { name: '모집공고', href: '/recruit/notice' },
        { name: '지원안내', href: '/recruit/guide' },
        { name: '교육내용', href: '/recruit/education' },
        { name: 'FAQ', href: '/recruit/faq' },
      ]
    },
    {
      title: '창업기업 소개',
      items: [
        { name: '참여기업', href: '/companies/participants' },
        { name: '기업별 소개', href: '/companies/details' },
        { name: '참고자료실', href: '/companies/resources' },
      ]
    },
    {
      title: '커뮤니티',
      items: [
        { name: '답변게시판', href: '/community/qna' },
      ]
    },
  ];

  return (
    <Box 
      boxShadow={isScrolled ? colors.shadow.md : colors.shadow.sm}
      borderBottom="1px solid"
      borderColor={isDark ? 'whiteAlpha.200' : colors.border}
      width="100%"
      transition="all 0.3s ease-in-out"
      py={0}
      backdropFilter="blur(8px)"
      backgroundColor={
        isDark 
          ? `rgba(15, 23, 42, ${isScrolled ? 0.95 : 0.85})` 
          : `rgba(255, 255, 255, ${isScrolled ? 0.95 : 0.85})`
      }
      margin={0}
      padding={0}
      height={isScrolled ? "60px" : "80px"}
    >
      <Container {...styles.container} maxW="100%" px={{ base: 2, md: 6, lg: 8 }} py={0} height="100%">
        <Flex 
          justify="space-between" 
          align="center" 
          width="100%"
          height="100%"
        >
          {/* 로고 */}
          <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
            <HStack gap={{ base: 2, md: 3 }}>
              <Box 
                width={isScrolled ? { base: "70px", md: "90px" } : { base: "80px", md: "110px" }} 
                height={isScrolled ? { base: "25px", md: "30px" } : { base: "30px", md: "40px" }} 
                bg={isDark ? 'whiteAlpha.200' : 'gray.100'} 
                borderRadius="md" 
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.3s ease-in-out"
              >
                <Text fontSize={{ base: "xs", md: "sm" }} color={isDark ? 'whiteAlpha.700' : 'gray.500'}>로고</Text>
              </Box>
              <Text 
                fontWeight="bold" 
                fontSize={isScrolled ? { base: "md", md: "lg" } : { base: "lg", md: "xl" }}
                bgGradient={colors.gradient.primary}
                bgClip="text"
                transition="all 0.3s ease-in-out"
                display="block"
              >
                창업가꿈 4호점
              </Text>
            </HStack>
          </Link>

          {/* 데스크톱 메뉴 */}
          <HStack gap={1} display={{ base: "none", md: "flex" }}>
            {menuItems.map((menu, idx) => (
              <Box 
                key={idx} 
                position="relative"
                onMouseEnter={() => setActiveMenu(idx)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Button
                  variant="ghost"
                  px={4}
                  py={isScrolled ? 1 : 2}
                  fontWeight="semibold"
                  color={isDark ? 'whiteAlpha.900' : 'inherit'}
                  _hover={{
                    bg: isDark ? 'whiteAlpha.200' : "rgba(99, 102, 241, 0.1)",
                    color: colors.primary.default,
                  }}
                  fontSize={isScrolled ? "sm" : "md"}
                  transition="all 0.3s ease-in-out"
                >
                  {menu.title}
                  <Box as={LuChevronDown} ml={1} />
                </Button>
                
                {/* 드롭다운 메뉴 */}
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  width="200px"
                  bg={isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'}
                  borderWidth="1px"
                  borderColor={isDark ? 'whiteAlpha.200' : colors.border}
                  borderRadius="md"
                  boxShadow={colors.shadow.md}
                  p={2}
                  display={activeMenu === idx ? "block" : "none"}
                  zIndex={10}
                  backdropFilter="blur(8px)"
                >
                  <VStack align="stretch" gap={0}>
                    {menu.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        as={NextLink}
                        href={item.href}
                        p={3}
                        borderRadius="md"
                        display="block"
                        color={isDark ? 'whiteAlpha.900' : 'inherit'}
                        _hover={{
                          bg: isDark ? 'whiteAlpha.200' : "rgba(99, 102, 241, 0.1)",
                          color: colors.primary.default,
                          textDecoration: 'none'
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </VStack>
                </Box>
              </Box>
            ))}
          </HStack>

          {/* 모바일 메뉴 버튼 */}
          <IconButton
            aria-label="Open menu"
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            size="md"
            variant="ghost"
            color={isDark ? 'whiteAlpha.900' : 'inherit'}
            bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
            _hover={{
              bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100',
            }}
          >
            <LuMenu />
          </IconButton>
        </Flex>
      </Container>

      {/* 모바일 메뉴 - 간단한 구현 */}
      {open && (
        <Box
          position="fixed"
          top="0"
          right="0"
          width="280px"
          height="100vh"
          bg={isDark ? 'gray.900' : 'white'}
          boxShadow="lg"
          zIndex={1000}
          overflowY="auto"
          transition="transform 0.3s ease-in-out"
        >
          <Flex justify="space-between" align="center" p={4} borderBottomWidth="1px" borderColor={isDark ? 'whiteAlpha.200' : colors.border}>
            <Text 
              fontWeight="bold" 
              fontSize="xl"
              bgGradient={colors.gradient.primary}
              bgClip="text"
            >
              창업가꿈 4호점
            </Text>
            <IconButton
              aria-label="Close menu"
              onClick={onClose}
              variant="ghost"
              size="sm"
              color={isDark ? 'whiteAlpha.900' : 'inherit'}
              bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
              _hover={{
                bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100',
              }}
            >
              <Box as={LuChevronDown} transform="rotate(90deg)" />
            </IconButton>
          </Flex>
          
          <VStack align="stretch" gap={0}>
            {menuItems.map((menu, idx) => (
              <Box key={idx}>
                <Button
                  variant="ghost"
                  width="100%"
                  justifyContent="space-between"
                  py={4}
                  px={4}
                  fontWeight="semibold"
                  color={isDark ? 'whiteAlpha.900' : 'inherit'}
                  _hover={{
                    bg: isDark ? 'whiteAlpha.200' : "rgba(99, 102, 241, 0.1)",
                  }}
                  bg={activeMenu === idx ? (isDark ? 'whiteAlpha.100' : 'blackAlpha.50') : 'transparent'}
                  onClick={() => {
                    if (activeMenu === idx) {
                      setActiveMenu(null);
                    } else {
                      setActiveMenu(idx);
                    }
                  }}
                >
                  <Text>{menu.title}</Text>
                  <Box 
                    as={LuChevronDown} 
                    transform={activeMenu === idx ? 'rotate(180deg)' : 'rotate(0deg)'} 
                    transition="transform 0.2s"
                  />
                </Button>
                
                <VStack 
                  align="stretch" 
                  gap={0} 
                  display={activeMenu === idx ? "flex" : "none"}
                  bg={isDark ? 'whiteAlpha.50' : 'blackAlpha.50'}
                >
                  {menu.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      as={NextLink}
                      href={item.href}
                      p={3}
                      pl={6}
                      display="block"
                      color={isDark ? 'whiteAlpha.900' : 'inherit'}
                      _hover={{
                        bg: isDark ? 'whiteAlpha.200' : "rgba(99, 102, 241, 0.1)",
                        color: colors.primary.default,
                        textDecoration: 'none'
                      }}
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  ))}
                </VStack>
                {idx < menuItems.length - 1 && (
                  <Box borderBottom="1px solid" borderColor={isDark ? 'whiteAlpha.200' : colors.border} />
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      )}
      
      {/* 모바일 메뉴 배경 오버레이 */}
      {open && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100vh"
          bg="blackAlpha.600"
          zIndex={999}
          onClick={onClose}
        />
      )}
    </Box>
  );
};