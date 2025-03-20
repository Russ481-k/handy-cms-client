"use client";

import { useState } from "react";
import { Box, Container, Heading, Text, Input, Flex } from "@chakra-ui/react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const faqs = [
    {
      category: "지원 자격",
      items: [
        {
          question: "예비창업자도 지원할 수 있나요?",
          answer:
            "네, 예비창업자도 지원 가능합니다. 단, 선정 후 일정 기간 내에 사업자 등록을 완료해야 합니다.",
        },
        {
          question: "현재 다른 지원사업에 참여 중인데 지원할 수 있나요?",
          answer:
            "동일한 사업아이템으로 타 기관의 지원을 받고 있는 경우에는 지원이 제한됩니다. 다만, 다른 아이템으로 지원하는 경우에는 가능합니다.",
        },
      ],
    },
    {
      category: "지원 절차",
      items: [
        {
          question: "지원서는 어디서 작성하나요?",
          answer:
            "홈페이지 내 모집공고 페이지에서 온라인으로 지원서를 작성하실 수 있습니다. 지원서 양식은 공고문에 첨부되어 있습니다.",
        },
        {
          question: "서류 심사 결과는 언제 알 수 있나요?",
          answer:
            "서류 심사 결과는 접수 마감 후 2주 이내에 개별적으로 안내드립니다. 합격자에 한해 발표심사 일정을 개별 통보해 드립니다.",
        },
      ],
    },
    {
      category: "지원 혜택",
      items: [
        {
          question: "사무공간이 제공되나요?",
          answer:
            "네, 선정된 기업에게는 창업가꿈센터 내 독립 사무공간이 제공됩니다. 공과금은 실비로 부과됩니다.",
        },
        {
          question: "지원금은 어떤 용도로 사용할 수 있나요?",
          answer:
            "지원금은 사업화에 필요한 인건비, 재료비, 외주용역비, 마케팅비 등으로 사용 가능합니다. 자세한 사항은 선정 후 안내드립니다.",
        },
      ],
    },
    {
      category: "교육 프로그램",
      items: [
        {
          question: "교육은 의무적으로 참여해야 하나요?",
          answer:
            "네, 기본 교육 과정은 필수로 참여하셔야 합니다. 단, 심화 과정은 선택적으로 참여 가능합니다.",
        },
        {
          question: "교육은 어떤 방식으로 진행되나요?",
          answer:
            "오프라인 강의와 온라인 학습을 병행하여 진행됩니다. 실습 위주의 교육으로 실무에 바로 적용할 수 있습니다.",
        },
      ],
    },
  ];

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          자주 묻는 질문
        </Heading>
        <Text color="gray.600" fontSize="lg" mb={8}>
          창업가꿈 프로그램에 대해 자주 묻는 질문들을 모았습니다.
        </Text>

        <Flex maxW="600px" mb={8}>
          <Box
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            color="gray.300"
          >
            <FaSearch />
          </Box>
          <Input
            pl={10}
            placeholder="질문을 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </Flex>
      </Box>

      {filteredFaqs.map((category, categoryIndex) => (
        <Box key={categoryIndex} mb={8}>
          <Heading as="h2" size="lg" mb={4}>
            {category.category}
          </Heading>
          <Box>
            {category.items.map((item, itemIndex) => {
              const key = `${categoryIndex}-${itemIndex}`;
              const isOpen = openItems[key];

              return (
                <Box
                  key={itemIndex}
                  mb={4}
                  borderWidth={1}
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Box
                    as="button"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p={4}
                    onClick={() => toggleItem(categoryIndex, itemIndex)}
                    bg={isOpen ? "gray.50" : "white"}
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.2s"
                  >
                    <Text fontSize="lg" fontWeight="medium" textAlign="left">
                      {item.question}
                    </Text>
                    <Box as={isOpen ? FaChevronUp : FaChevronDown} />
                  </Box>
                  <Box p={4} bg="white" display={isOpen ? "block" : "none"}>
                    <Text fontSize="lg">{item.answer}</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}

      <Box mt={12} p={6} bg="blue.50" borderRadius="lg">
        <Heading as="h2" size="lg" mb={4}>
          더 궁금하신 점이 있으신가요?
        </Heading>
        <Text fontSize="lg">
          이메일: info@changupgakkum.com
          <br />
          전화: 02-123-4567 (평일 09:00-18:00)
        </Text>
      </Box>
    </Container>
  );
}
