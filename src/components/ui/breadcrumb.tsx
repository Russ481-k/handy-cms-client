"use client";

import {  Box, } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { HeroSection } from "../sections/HeroSection";

function useSlideContents() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const getContents = useCallback(() => {
    if (paths.length === 0) {
      const slideContents = [
        {
          title: "AI와 함께 창업의 미래를 열다!",
          subtitle:
            "창업 공간 + 맞춤 교육 + 추가 지원까지\n지금 창업의 꿈을 실현하세요!",
          image: "/images/banners/banner_1.jpg",
        },
        {
          title: "혁신적인 창업 지원 시스템",
          subtitle:
            "AI 기반 맞춤형 솔루션으로\n당신의 창업을 성공으로 이끌어드립니다",
          image: "/images/banners/banner_2.gif",
        },
        {
          title: "함께 성장하는 창업 생태계",
          subtitle:
            "다양한 분야의 전문가와 함께\n창업의 모든 단계를 지원합니다",
          image: "/images/banners/banner_3.gif",
        },
      ];
      return slideContents;
    }
    // 서브 페이지들
    const subPageImages: {
      [key: string]: { header: string; title: string; image: string };
    } = {
      about: {
        header: "창업가꿈 소개",
        title: "비전 및 목표",
        image: "/images/intro/sub_visual.png",
      },
      recruit: {
        header: "창업기업 모집",
        title: "모집공고",
        image: "/images/apply/sub_visual.png",
      },
      companies: {
        header: "창업기업 소개",
        title: "참여기업",
        image: "/images/companies/sub_visual.png",
      },
      community: {
        header: "커뮤니티",
        title: "답변게시판",
        image: "/images/community/sub_visual.png",
      },
    };

    // 중첩된 경로 처리 (예: about/vision)
    if (paths.length > 1) {
      const subPath = paths[1];
      if (subPageImages[subPath]) {
        return [subPageImages[subPath]];
      }
    }

    // 단일 경로 처리
    const pageKey = paths[0];
    if (subPageImages[pageKey]) {
      return [subPageImages[pageKey]];
    }

    return [];
  }, [paths]);

  return getContents;
}

export { useSlideContents };

export function BreadcrumbNav() {
  const getSlideContents = useSlideContents();
 

  return (
    <Box position="relative">
      <HeroSection slideContents={getSlideContents} />
    </Box>
  );
}
