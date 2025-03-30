import { HeroSection } from "@/components/sections/HeroSection";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <HeroSection
        slideContents={[
          {
            header: "창업가꿈 소개",
            title: "비전 및 목표",
            image: "/images/intro/sub_visual.png",
          },
        ]}
      />
      {children}
    </Box>
  );
};

export default Layout;
