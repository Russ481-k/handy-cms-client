"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
  Field,
  Fieldset,
  Stack,
} from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Card } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface FormInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };

  return (
    <Container maxW="container.md" py={16}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            bgGradient="linear(to-r, blue.500, purple.500)"
            bgClip="text"
          >
            문의하기
          </Heading>
          <Text fontSize="xl" color={isDark ? "gray.300" : "gray.600"}>
            궁금하신 점이 있으시다면 언제든 문의해주세요
          </Text>
        </Box>

        <Card.Root
          bg={isDark ? "gray.800" : "white"}
          borderWidth="1px"
          borderColor={isDark ? "gray.700" : "gray.200"}
          boxShadow="lg"
        >
          <Card.Body gap={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Fieldset.Root size="lg">
                <Stack gap={4}>
                  <Fieldset.Legend>문의 정보</Fieldset.Legend>
                  <Fieldset.HelperText>
                    아래 양식을 작성하여 문의해주세요.
                  </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                  <Field.Root invalid={!!errors.name}>
                    <Field.Label>이름</Field.Label>
                    <Input
                      {...register("name", { required: "이름을 입력해주세요" })}
                      placeholder="이름을 입력해주세요"
                      bg={isDark ? "gray.700" : "white"}
                      borderColor={isDark ? "gray.600" : "gray.200"}
                      _hover={{
                        borderColor: isDark ? "gray.500" : "gray.300",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "none",
                      }}
                    />
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.email}>
                    <Field.Label>이메일</Field.Label>
                    <Input
                      {...register("email", {
                        required: "이메일을 입력해주세요",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "올바른 이메일 형식이 아닙니다",
                        },
                      })}
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      bg={isDark ? "gray.700" : "white"}
                      borderColor={isDark ? "gray.600" : "gray.200"}
                      _hover={{
                        borderColor: isDark ? "gray.500" : "gray.300",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "none",
                      }}
                    />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.subject}>
                    <Field.Label>제목</Field.Label>
                    <Input
                      {...register("subject", {
                        required: "제목을 입력해주세요",
                      })}
                      placeholder="제목을 입력해주세요"
                      bg={isDark ? "gray.700" : "white"}
                      borderColor={isDark ? "gray.600" : "gray.200"}
                      _hover={{
                        borderColor: isDark ? "gray.500" : "gray.300",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "none",
                      }}
                    />
                    <Field.ErrorText>{errors.subject?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.message}>
                    <Field.Label>메시지</Field.Label>
                    <Textarea
                      {...register("message", {
                        required: "메시지를 입력해주세요",
                      })}
                      placeholder="메시지를 입력해주세요"
                      rows={6}
                      bg={isDark ? "gray.700" : "white"}
                      borderColor={isDark ? "gray.600" : "gray.200"}
                      _hover={{
                        borderColor: isDark ? "gray.500" : "gray.300",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "none",
                      }}
                    />
                    <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  mt={4}
                >
                  보내기
                </Button>
              </Fieldset.Root>
            </form>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
}
