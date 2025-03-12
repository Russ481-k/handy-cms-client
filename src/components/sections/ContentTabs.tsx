import { useState } from 'react';
import { Box, HStack, Button, VStack, Heading, Text, SimpleGrid, Stack, Accordion } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { useColors, useStyles } from "@/styles/theme";

export const ContentTabs = () => {
  const colors = useColors();
  const styles = useStyles(colors, false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Box mb={8}>
      <HStack gap="4" mb={6} overflowX={{ base: "auto", md: "visible" }} pb={2}>
        {[
          { id: 'overview', label: '사업 개요' },
          { id: 'benefits', label: '지원 내용' },
          { id: 'eligibility', label: '신청 자격' },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'solid' : 'ghost'}
            bgGradient={activeTab === tab.id ? colors.gradient.primary : 'none'}
            bg={activeTab === tab.id ? undefined : "rgba(99, 102, 241, 0.1)"}
            color={activeTab === tab.id ? colors.text.inverse : colors.primary.default}
            borderRadius="full"
            py={6}
            px={8}
            fontWeight="bold"
            backdropFilter="blur(12px)"
            _hover={{
              bg: activeTab === tab.id ? undefined : "rgba(99, 102, 241, 0.15)",
              bgGradient: activeTab === tab.id ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : undefined,
              transform: "translateY(-2px)",
              boxShadow: colors.shadow.sm,
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </HStack>

      <Box 
        {...styles.card} 
        p={8}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="6px"
          bgGradient={
            activeTab === 'overview' ? colors.gradient.primary : 
            activeTab === 'benefits' ? colors.gradient.secondary : 
            colors.gradient.accent
          }
        />
        
        {activeTab === 'overview' && (
          <VStack align="start" gap="6">
            <Heading as="h2" size="lg" bgGradient={colors.gradient.primary} bgClip="text">
              사업 개요
            </Heading>
            <Text fontSize="lg">
              부산창업가꿈은 청년 창업가들이 혁신적인 아이디어로 사회적 가치를 창출하고 
              지역 경제에 기여할 수 있도록 돕는 것을 목표로 합니다.
            </Text>
            <Stack gap="4">
              <Stack direction="row">
                <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                <Text>창업 초기 기업 대상 맞춤형 성장 지원</Text>
              </Stack>
              <Stack direction="row">
                <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                <Text>전문가 멘토링 및 네트워킹 프로그램 운영</Text>
              </Stack>
              <Stack direction="row">
                <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                <Text>사무공간 및 주거공간 무상 제공</Text>
              </Stack>
            </Stack>
          </VStack>
        )}

        {activeTab === 'benefits' && (
          <VStack align="start" gap="6">
            <Heading as="h2" size="lg" bgGradient={colors.gradient.secondary} bgClip="text">
              지원 내용
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} w="full">
              <Box
                p={6}
                borderRadius="xl"
                bg="rgba(99, 102, 241, 0.05)"
                borderWidth="1px"
                borderColor={colors.border}
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: colors.shadow.sm,
                  borderColor: colors.primary.default,
                }}
              >
                <Heading as="h3" size="md" mb={4} color={colors.primary.default}>
                  사업화 자금
                </Heading>
                <Stack gap="3">
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                    <Text>기업당 최대 2억원 지원</Text>
                  </Stack>
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                    <Text>시제품 제작 및 마케팅 비용</Text>
                  </Stack>
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                    <Text>특허 출원 및 인증 획득 지원</Text>
                  </Stack>
                </Stack>
              </Box>
              <Box
                p={6}
                borderRadius="xl"
                bg="rgba(14, 165, 233, 0.05)"
                borderWidth="1px"
                borderColor={colors.border}
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: colors.shadow.sm,
                  borderColor: colors.accent.info.default,
                }}
              >
                <Heading as="h3" size="md" mb={4} color={colors.accent.info.default}>
                  공간 지원
                </Heading>
                <Stack gap="3">
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.accent.info.default} boxSize={5} />
                    <Text>독립 사무실 무상 제공</Text>
                  </Stack>
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.accent.info.default} boxSize={5} />
                    <Text>공용 회의실 및 휴게공간</Text>
                  </Stack>
                  <Stack direction="row">
                    <Box as={LuCheck} color={colors.accent.info.default} boxSize={5} />
                    <Text>기숙사형 주거공간 제공</Text>
                  </Stack>
                </Stack>
              </Box>
            </SimpleGrid>
          </VStack>
        )}

        {activeTab === 'eligibility' && (
          <VStack align="start" gap="6">
            <Heading as="h2" size="lg" bgGradient={colors.gradient.accent} bgClip="text">
              신청 자격
            </Heading>
            <Accordion.Root w="full">
              <Accordion.Item value="basic-eligibility">
                <h3>
                  <Accordion.ItemTrigger
                    p={4}
                    bg="rgba(99, 102, 241, 0.05)"
                    _hover={{
                      bg: "rgba(99, 102, 241, 0.1)",
                    }}
                    borderRadius="lg"
                  >
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      기본 자격 요건
                    </Box>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                </h3>
                <Accordion.ItemContent p={4} pt={2}>
                  <Stack gap="3">
                    <Stack direction="row">
                      <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                      <Text>만 39세 이하의 청년 창업가</Text>
                    </Stack>
                    <Stack direction="row">
                      <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                      <Text>창업 7년 이내 기업</Text>
                    </Stack>
                    <Stack direction="row">
                      <Box as={LuCheck} color={colors.primary.default} boxSize={5} />
                      <Text>부산광역시 소재 기업</Text>
                    </Stack>
                  </Stack>
                </Accordion.ItemContent>
              </Accordion.Item>

              <Accordion.Item value="priority-eligibility">
                <h3>
                  <Accordion.ItemTrigger
                    p={4}
                    bg="rgba(139, 92, 246, 0.05)"
                    _hover={{
                      bg: "rgba(139, 92, 246, 0.1)",
                    }}
                    borderRadius="lg"
                    mt={2}
                  >
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      우대 사항
                    </Box>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                </h3>
                <Accordion.ItemContent p={4} pt={2}>
                  <Stack gap="3">
                    <Stack direction="row">
                      <Box as={LuCheck} color="#8b5cf6" boxSize={5} />
                      <Text>특허/실용신안 보유 기업</Text>
                    </Stack>
                    <Stack direction="row">
                      <Box as={LuCheck} color="#8b5cf6" boxSize={5} />
                      <Text>정부 지원사업 수행 실적 보유</Text>
                    </Stack>
                    <Stack direction="row">
                      <Box as={LuCheck} color="#8b5cf6" boxSize={5} />
                      <Text>벤처기업 인증 보유</Text>
                    </Stack>
                  </Stack>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </VStack>
        )}
      </Box>
    </Box>
  );
}; 