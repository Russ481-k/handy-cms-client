"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Flex,
  Heading,
  Input,
  Text,
  Checkbox,
} from "@chakra-ui/react";
import { LuEye, LuEyeOff, LuCheck } from "react-icons/lu";
import { useAuth } from "@/lib/AuthContext";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { useColors } from "@/styles/theme";
import { Button } from "@/components/ui/button";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useSetRecoilState } from "recoil";
import { userState } from "@/lib/recoil/atoms/user";
import { toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/ui/logo";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || "/cms/menu";
  const colors = useColors();
  const setUser = useSetRecoilState(userState);

  const inputBg = useColorModeValue("white", "whiteAlpha.50");
  const inputBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const inputText = useColorModeValue("gray.800", "whiteAlpha.900");
  const inputPlaceholder = useColorModeValue("gray.400", "whiteAlpha.400");
  const inputHover = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedId");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberId(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username) {
      newErrors.username = "Please enter your username";
    }

    if (!password) {
      newErrors.password = "Please enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await login(username, password);
      if (response.success && response.user) {
        // 사용자 정보를 Recoil 상태에 저장
        setUser({
          uuid: response.user.uuid,
          username: response.user.username,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          avatar: response.user.avatar,
        });

        if (rememberId) {
          localStorage.setItem("rememberedId", username);
        } else {
          localStorage.removeItem("rememberedId");
        }

        toaster.success({
          title: "로그인 성공",
          description: "환영합니다!",
        });
        router.push(from);
      } else {
        toaster.error({
          title: "로그인 실패",
          description:
            response.message || "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
      }
    } catch (error) {
      toaster.error({
        title: "오류 발생",
        description: "로그인 중 오류가 발생했습니다." + error,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={4}
    >
      <Container maxW="lg" px={{ base: "4", sm: "8" }}>
        <Flex direction="column" gap={3} align="center">
          <Logo size="xl" isLogin />
          <Flex
            direction="column"
            gap={1}
            textAlign="center"
            transition="all 0.5s ease-in-out"
          >
            <Heading
              size="lg"
              fontWeight="bold"
              letterSpacing="tight"
              color={useColorModeValue("gray.900", "white")}
            >
              Welcome Back
            </Heading>
            <Text
              fontSize="md"
              color={colors.text.secondary}
              fontWeight="medium"
              letterSpacing="wide"
            >
              Sign in to your admin account
            </Text>
          </Flex>
          <Box
            w="full"
            maxW="md"
            py={{ base: "8", sm: "10" }}
            px={{ base: "6", sm: "10" }}
            bg={colors.cardBg}
            boxShadow={colors.shadow.md}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={colors.border}
          >
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap={6}>
                <Flex direction="column" gap={5}>
                  <Field
                    label={
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        letterSpacing="wide"
                      >
                        Username
                      </Text>
                    }
                    errorText={errors.username}
                  >
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      bg={inputBg}
                      borderColor={inputBorder}
                      color={inputText}
                      fontSize="md"
                      h="12"
                      _placeholder={{ color: inputPlaceholder }}
                      _hover={{ borderColor: inputBorder, bg: inputHover }}
                      _focus={{
                        borderColor: colors.primary.alpha,
                        boxShadow: `0 0 0 1px ${colors.primary.alpha}`,
                      }}
                    />
                  </Field>
                  <Field
                    label={
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        letterSpacing="wide"
                      >
                        Password
                      </Text>
                    }
                    errorText={errors.password}
                  >
                    <InputGroup
                      w="full"
                      endElementProps={{
                        paddingInline: 0,
                      }}
                      endElement={
                        <Button
                          variant="ghost"
                          color={inputText}
                          borderLeftRadius="0"
                          h="12"
                          _hover={{ bgColor: inputHover }}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
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
                        bg={inputBg}
                        borderColor={inputBorder}
                        color={inputText}
                        fontSize="md"
                        h="12"
                        _placeholder={{ color: inputPlaceholder }}
                        _hover={{ borderColor: inputBorder, bg: inputHover }}
                        _focus={{
                          borderColor: colors.primary.alpha,
                          boxShadow: `0 0 0 1px ${colors.primary.alpha}`,
                        }}
                      />
                    </InputGroup>
                  </Field>
                </Flex>
                <Checkbox.Root
                  checked={rememberId}
                  onCheckedChange={(e) => setRememberId(!!e.checked)}
                  colorPalette="blue"
                  size="md"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor={inputBorder}
                    bg={inputBg}
                    // _hover={{
                    //   bg: inputHover,
                    // }}
                    _checked={{
                      borderColor: "transparent",
                      bgGradient: colors.gradient.primary,
                      color: "white",
                      _hover: {
                        opacity: 0.8,
                      },
                    }}
                  >
                    <Checkbox.Indicator>
                      <LuCheck />
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Label>
                    <Text
                      fontSize="sm"
                      color={colors.text.secondary}
                      fontWeight="medium"
                      letterSpacing="wide"
                    >
                      Remember me
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  fontWeight="semibold"
                  h="12"
                  bgGradient={colors.gradient.primary}
                  color="white"
                  letterSpacing="wide"
                  _hover={{
                    bgGradient: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    boxShadow: colors.shadow.md,
                  }}
                >
                  Sign In
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
