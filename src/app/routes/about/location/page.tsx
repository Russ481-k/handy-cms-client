"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  SimpleGrid,
  Card,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { useColorMode } from "@/components/ui/color-mode";

export default function LocationPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(mapScript);
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(
            35.229896192111696,
            129.155449720031
          ), // 해운대구 윗반송로51번길 36 좌표
          level: 3,
        };
        const map = new window.kakao.maps.Map(
          container ?? document.body,
          options
        );

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          35.229896192111696,
          129.155449720031
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content:
            '<div style="padding:5px; font-size: 14px; font-weight: bold; color: #000; width: 100px; text-align: center;">부산창업가꿈</div>',
        });
        infowindow.open(map, marker);
      });
    };

    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => {
      mapScript.removeEventListener("load", onLoadKakaoMap);
    };
  }, []);

  return (
    <Container maxW="container.xl" py={16}>
      <VStack gap={12} align="stretch">
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
          >
            오시는 길
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            부산창업가꿈 해운대는 해운대구에 위치해 있습니다
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body>
              <VStack align="start" gap={4}>
                <Box
                  w="100%"
                  h="400px"
                  bg={isDark ? "gray.700" : "gray.100"}
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Box
                    id="map"
                    h="400px"
                    borderRadius="xl"
                    overflow="hidden"
                    border="1px"
                    borderColor={isDark ? "gray.700" : "gray.200"}
                  />
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    주소
                  </Text>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    부산광역시 해운대구 윗반송로51번길 36
                  </Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={isDark ? "gray.800" : "white"}
            borderWidth="1px"
            borderColor={isDark ? "gray.700" : "gray.200"}
            boxShadow="lg"
          >
            <Card.Body>
              <VStack align="start" gap={6}>
                <Box>
                  <Text
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaMapMarkerAlt} mr={2} color="blue.500" />
                    위치 안내
                  </Text>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    해운대구청에서 도보로 5분 거리에 위치해 있습니다.
                    해운대해수욕장과 가까워 여름철에는 해수욕을 즐기실 수
                    있습니다.
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaPhone} mr={2} color="green.500" />
                    연락처
                  </Text>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    051-123-4567
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaEnvelope} mr={2} color="purple.500" />
                    이메일
                  </Text>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    info@startup-dream.or.kr
                  </Text>
                </Box>

                <Box>
                  <Text
                    fontWeight="bold"
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaClock} mr={2} color="orange.500" />
                    운영 시간
                  </Text>
                  <Text color={isDark ? "gray.300" : "gray.600"}>
                    평일: 09:00 - 18:00
                    <br />
                    주말 및 공휴일: 휴무
                  </Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
