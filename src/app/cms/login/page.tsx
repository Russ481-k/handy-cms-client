"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useAuth } from "@/lib/AuthContext";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { useColors } from "@/styles/theme";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/cms/dashboard";
  const colors = useColors();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push(from);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Flex direction="column" gap={8}>
        <Flex direction="column" gap={6} textAlign="center">
          <Heading size="xl" fontWeight="bold">
            CMS 로그인
          </Heading>
          <Text color={colors.text.secondary}>
            관리자 계정으로 로그인하세요
          </Text>
        </Flex>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={colors.cardBg}
          boxShadow={colors.shadow.md}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={6}>
              <Flex direction="column" gap={5}>
                <Field label="이메일" errorText={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                  />
                </Field>
                <Field label="비밀번호" errorText={errors.password}>
                  <InputGroup
                    endElement={
                      <Button
                        variant="ghost"
                        aria-label={
                          showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      >
                        {showPassword ? <LuEyeOff /> : <LuEye />}
                      </Button>
                    }
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </InputGroup>
                </Field>
              </Flex>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                loading={isSubmitting}
                bgGradient={colors.gradient.primary}
                color="white"
                _hover={{
                  bgGradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: colors.shadow.md,
                }}
              >
                로그인
              </Button>
            </Flex>
          </form>
        </Box>
      </Flex>
    </Container>
  );
}
