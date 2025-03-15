import { Box } from "@chakra-ui/react";
import { TopBanner } from "./TopBanner";
import { Navigation } from "./Navigation";
import { useColors } from "@/styles/theme";
import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

export const Header = () => {
  const colors = useColors();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTopBannerVisible, setIsTopBannerVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  // 반응형 설정
  const isMobile = useBreakpointValue({ base: true, md: false });
  const topBannerHeight = 40;
  const navHeightDefault = isMobile ? 60 : 80;
  const navHeightScrolled = isMobile ? 50 : 60;

  const headerHeight = isTopBannerVisible
    ? isScrolled
      ? topBannerHeight + navHeightScrolled
      : topBannerHeight + navHeightDefault
    : isScrolled
    ? navHeightScrolled
    : navHeightDefault;

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById("main-content");
      if (!mainContent) return;

      const currentScrollY = mainContent.scrollTop;

      // 스크롤 값이 임계점 이상이면 네비게이션 축소
      // 모바일에서는 더 빨리 축소되도록 임계점 조정
      const scrollThreshold = isMobile ? 50 : 100;
      setIsScrolled(currentScrollY > scrollThreshold);

      // 스크롤 방향에 따라 TopBanner 표시 여부 결정
      // 모바일에서는 더 빨리 숨겨지도록 임계점 조정
      if (currentScrollY <= scrollThreshold) {
        setIsTopBannerVisible(
          prevScrollY > currentScrollY || currentScrollY <= 2
        );
      } else {
        // 모바일에서는 스크롤 시 항상 TopBanner 숨김
        setIsTopBannerVisible(isMobile ? false : prevScrollY > currentScrollY);
      }

      setPrevScrollY(currentScrollY);

      // 메인 컨텐츠 영역의 패딩 업데이트
      updateMainContentPadding();
    };

    const updateMainContentPadding = () => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.style.paddingTop = headerHeight + "px";
      }
    };

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);

      // 초기 패딩 설정
      updateMainContentPadding();

      return () => mainContent.removeEventListener("scroll", handleScroll);
    }
  }, [prevScrollY, headerHeight, isMobile]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      zIndex={100}
      transition="all 0.3s ease-in-out"
      padding={0}
      margin={0}
      height={headerHeight + "px"}
    >
      <Box
        overflow="hidden"
        maxHeight={isTopBannerVisible ? topBannerHeight + "px" : "2px"}
        opacity={1}
        transition="all 0.3s ease-in-out"
        position="relative"
        zIndex={101}
      >
        <TopBanner />
      </Box>
      <Box
        boxShadow={isScrolled ? colors.shadow.md : "none"}
        transition="all 0.3s ease-in-out"
      >
        <Navigation isScrolled={isScrolled} />
      </Box>
    </Box>
  );
};
