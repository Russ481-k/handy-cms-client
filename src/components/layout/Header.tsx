// "use client";

// import {
//   Box,
//   Container,
//   Flex,
//   Heading,
//   Button,
//   IconButton,
//   useColorMode,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import Link from "next/link";
// import { MoonIcon, SunIcon } from "@chakra-ui/icons";

// export function Header() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const isDark = colorMode === "dark";

//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");

//   return (
//     <Box
//       as="header"
//       position="sticky"
//       top={0}
//       zIndex={100}
//       bg={bgColor}
//       borderBottom="1px"
//       borderColor={borderColor}
//       boxShadow="sm"
//     >
//       <Container maxW="container.xl" py={4}>
//         <Flex justify="space-between" align="center">
//           <Link href="/">
//             <Heading
//               as="h1"
//               size="lg"
//               bgGradient="linear(to-r, blue.500, purple.500)"
//               bgClip="text"
//             >
//               부산창업가꿈 해운대
//             </Heading>
//           </Link>

//           <Flex gap={4} align="center">
//             <Link href="/about">
//               <Button variant="ghost">소개</Button>
//             </Link>
//             <Link href="/companies">
//               <Button variant="ghost">입주 기업</Button>
//             </Link>
//             <Link href="/contact">
//               <Button variant="ghost">문의하기</Button>
//             </Link>
//             <IconButton
//               aria-label="Toggle color mode"
//               icon={isDark ? <SunIcon /> : <MoonIcon />}
//               onClick={toggleColorMode}
//               variant="ghost"
//             />
//           </Flex>
//         </Flex>
//       </Container>
//     </Box>
//   );
// }
