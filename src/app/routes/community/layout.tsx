import { HeroSection } from "@/components/sections/HeroSection";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <HeroSection
        slideContents={[
          {
            header: "커뮤니티",
            title: "답변게시판",
            image: "/images/community/sub_visual.png",
          },
        ]}
      />
      {children}
    </Box>
  );
};

export default Layout;
