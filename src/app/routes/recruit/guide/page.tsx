"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Separator,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaFileAlt,
  FaPhone,
  FaCopy,
} from "react-icons/fa";

export default function GuidePage() {
  const email = "buvakim@naver.com";
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={12} align="stretch">
        {/* 제목 섹션 */}
        <Box>
          <Heading as="h1" size="2xl" mb={6}>
            지원 안내
          </Heading>
          <Text fontSize="xl" color="gray.600">
            해운대 도심형 청년 창업·주거 복합공간 입주 기업 모집
          </Text>
        </Box>

        {/* 모집 개요 섹션 */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            1. 모집 개요
          </Heading>
          <VStack
            gap={4}
            align="stretch"
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="sm"
          >
            <HStack>
              <Icon as={FaCalendarAlt} color="blue.500" w={5} h={5} />
              <Text>
                <strong>모집기간:</strong> 2025년 2월 13일(목) ~ 2월 19일(수)
                18시까지
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaMapMarkerAlt} color="red.500" w={5} h={5} />
              <Text>
                <strong>위치:</strong> 부산광역시 해운대구 윗반송로51번길 36
                (반송동 216-10)
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaUsers} color="green.500" w={5} h={5} />
              <Text>
                <strong>모집분야:</strong> 기술 기반 창업, 디자인, 크리에이터
                창업
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaFileAlt} color="purple.500" w={5} h={5} />
              <Text>
                <strong>접수방법:</strong> 이메일 접수
              </Text>
              <Button
                size="sm"
                onClick={onCopy}
                colorScheme={hasCopied ? "green" : "blue"}
              >
                <FaCopy />
                {hasCopied ? "복사됨" : email}
              </Button>
            </HStack>
            <Text>
              <strong>사업기간:</strong> 2025년 3월 ~ 2025년 12월 (10개월)
            </Text>
            <Text color="gray.600" fontSize="sm">
              ※ 최대 1년 단위로 연장 심사 후 총 2년 이내 연장 가능
            </Text>
          </VStack>
        </Box>

        {/* 신청 대상 섹션 */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            2. 신청 대상
          </Heading>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  자격 요건
                </Text>
                <Box gap={2}>
                  <li>대표자 만 18세 이상 39세 이하 (2025.2.13. 기준)</li>
                  <li>
                    해운대구 거주 또는 사업장 소재지가 해운대구인 청년창업가
                    <Text fontSize="sm" color="gray.600" ml={4}>
                      ※ 타 지역 거주/사업장일 경우, 입주 후 3개월(예비창업자는
                      6개월) 내 해운대구로 이전
                    </Text>
                  </li>
                  <li>창업 후 7년 이내 (혹은 예비창업자)</li>
                </Box>
              </Box>

              <Separator />

              <Box>
                <Text fontSize="lg" fontWeight="bold" color="red.500" mb={2}>
                  신청 제외 대상
                </Text>
                <Box gap={2} color="gray.700">
                  <li>사치·향락 업종, 단순 유통·도소매, 금품 관련 사업자</li>
                  <li>국세·지방세 체납자, 금융기관 채무불이행자 등</li>
                  <li>정부지원 사업 참여제한 대상</li>
                  <li>
                    기타 자치단체장이 사업 목적과 맞지 않다고 판단하는 기업
                  </li>
                </Box>
              </Box>
            </VStack>
          </Box>
        </Box>

        {/* 입주 조건 섹션 */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            3. 입주 조건
          </Heading>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>구분</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    보증금
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    월 임대료
                  </Table.ColumnHeader>
                  <Table.ColumnHeader>비고</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {[
                  {
                    id: 1,
                    name: "공유오피스",
                    category: "120만원",
                    price: "10만원",
                    note: "관리비 포함",
                  },
                  {
                    id: 2,
                    name: "주거공간",
                    category: "100만원",
                    price: "10만원",
                    note: "관리비 포함",
                  },
                ].map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell textAlign="end">{item.price}</Table.Cell>
                    <Table.Cell>{item.note}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Box mt={6}>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                우대 순위
              </Text>
              <Box gap={2}>
                <li>해운대구 거주자</li>
                <li>공유오피스·주거 동시 계약자</li>
                <li>지역(반송동) 상권 활성화 창업아이템 또는 활동 가능자</li>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 시설 개요 섹션 */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>
            4. 시설 개요
          </Heading>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
            <VStack align="stretch" gap={6}>
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  층별 공간 구성
                </Text>
                <VStack align="stretch" gap={4}>
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Text fontWeight="bold" color="blue.700">
                      1층: 미디어아트 카페 (109.89㎡)
                    </Text>
                    <Text ml={4}>실감형 미디어아트, 야외테라스</Text>
                  </Box>
                  <Box p={4} bg="pink.50" borderRadius="md">
                    <Text fontWeight="bold" color="pink.700">
                      2층A: 여성주거공용공간 (46.46㎡)
                    </Text>
                    <Text ml={4}>여성전용 3실(각 15.26㎡)</Text>
                    <Text ml={4} fontSize="sm">
                      거실·세탁실·정수기·TV·에어컨 등 기본 비품 구비
                    </Text>
                  </Box>
                  <Box p={4} bg="green.50" borderRadius="md">
                    <Text fontWeight="bold" color="green.700">
                      2층B: 공유오피스 (51.98㎡)
                    </Text>
                    <Text ml={4}>개방형 8석 + 소회의실(13.38㎡)</Text>
                    <Text ml={4} fontSize="sm">
                      탕비실·프린터·무선공유기·프로젝터 등 업무환경 제공
                    </Text>
                  </Box>
                  <Box p={4} bg="purple.50" borderRadius="md">
                    <Text fontWeight="bold" color="purple.700">
                      3층: 남성주거공용공간 (70.78㎡)
                    </Text>
                    <Text ml={4}>남성전용 5실(각 15.26㎡)</Text>
                    <Text ml={4} fontSize="sm">
                      거실·세탁실·정수기·TV·에어컨 등 기본 비품 구비
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>

        {/* 문의처 섹션 */}
        <Box bg="blue.50" p={6} borderRadius="lg">
          <HStack gap={4}>
            <Icon as={FaPhone} color="blue.500" w={6} h={6} />
            <Box>
              <Heading as="h2" size="md" mb={2}>
                문의처
              </Heading>
              <Text>부산벤처기업협회 특화사업팀</Text>
              <Text fontSize="xl" fontWeight="bold">
                ☎ 051-343-0109
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
}
