import { HeroSection } from "@/components/sections/HeroSection";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <HeroSection
        slideContents={[
          {
            header: "창업기업 모집",
            title: "모집공고",
            image: "/images/apply/sub_visual.png",
          },
        ]}
      />
      {children}
    </Box>
  );
};

export default Layout;
