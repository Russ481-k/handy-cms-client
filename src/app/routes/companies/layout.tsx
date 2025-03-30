import { HeroSection } from "@/components/sections/HeroSection";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <HeroSection
        slideContents={[
          {
            header: "창업기업 소개",
            title: "참여기업",
            image: "/images/companies/sub_visual.png",
          },
        ]}
      />
      {children}
    </Box>
  );
};

export default Layout;
