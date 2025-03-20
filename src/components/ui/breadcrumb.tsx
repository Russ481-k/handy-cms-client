"use client";

import { Breadcrumb, Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useColors } from "@/styles/theme";
import React from "react";

const routeMap: { [key: string]: string } = {
  about: "소개",
  companies: "입주 기업",
  contact: "문의하기",
  education: "교육 프로그램",
  news: "소식",
  application: "입주 신청",
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const colors = useColors();

  if (paths.length === 0) return null;

  const linkStyles = {
    color: colors.text.secondary,
    transition: "all 0.2s",
    fontSize: "sm",
    fontWeight: "medium",
    position: "relative" as const,
    _after: {
      content: '""',
      position: "absolute" as const,
      bottom: "-2px",
      left: 0,
      width: "100%",
      height: "2px",
      bg: colors.primary.default,
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.2s ease-in-out",
    },
    _hover: {
      color: colors.primary.default,
      _after: {
        transform: "scaleX(1)",
        transformOrigin: "left",
      },
    },
  };

  return (
    <Box
      pt={20}
      pb={6}
      px={{ base: 4, md: 8 }}
      bg={colors.bg}
      borderBottom="1px"
      borderColor={colors.border}
    >
      <Flex align="center" gap={2}>
        <Breadcrumb.Root size="md">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link as={Link} href="/" {...linkStyles}>
                Home
              </Breadcrumb.Link>
            </Breadcrumb.Item>

            {paths.map((path, index) => {
              if (path === "routes") return null;
              const isLast = index === paths.length - 1;
              const href = `/${paths.slice(0, index + 1).join("/")}`;
              const label = routeMap[path] || path;

              return (
                <React.Fragment key={`separator-${path}`}>
                  <Breadcrumb.Separator>
                    <Box
                      as="span"
                      color="gray.400"
                      mx={2}
                      fontSize="sm"
                      fontWeight="light"
                    >
                      /
                    </Box>
                  </Breadcrumb.Separator>
                  <Breadcrumb.Item>
                    {isLast ? (
                      <Breadcrumb.CurrentLink
                        color={colors.text.primary}
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        {label}
                      </Breadcrumb.CurrentLink>
                    ) : (
                      <Breadcrumb.Link as={Link} href={href} {...linkStyles}>
                        {label}
                      </Breadcrumb.Link>
                    )}
                  </Breadcrumb.Item>
                </React.Fragment>
              );
            })}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Flex>
    </Box>
  );
}
