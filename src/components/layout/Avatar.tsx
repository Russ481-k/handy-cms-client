import { Group, Separator, Text, Box, Portal } from "@chakra-ui/react";
import { Avatar as ChakraAvatar } from "@/components/ui/avatar";
import { LuSettings, LuMoon, LuSun } from "react-icons/lu";
import { Menu as ChakraMenu } from "@chakra-ui/react";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useState, useEffect } from "react";
import { useColors } from "@/styles/theme";

interface AvatarProps {
  isSidebarOpen: boolean;
  asButton?: boolean;
  gradientBorder?: boolean;
}

type Placement = "bottom" | "right-start" | "right-end";

export function Avatar({ isSidebarOpen, asButton = true, gradientBorder = false }: AvatarProps) {
  const [placement, setPlacement] = useState<Placement>("right-start");
  const colors = useColors();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  // 홈페이지 스타일에 맞는 색상 적용
  const textColor = useColorModeValue(colors.text.primary, "whiteAlpha.900");
  const menuBg = useColorModeValue(colors.cardBg, colors.cardBg);
  const menuBorderColor = useColorModeValue(colors.border, "whiteAlpha.100");
  const menuItemHoverBg = useColorModeValue(colors.primary.alpha, "whiteAlpha.200");
  const menuTextColor = useColorModeValue(colors.text.primary, colors.text.primary);
  const menuSubtitleColor = useColorModeValue(colors.text.secondary, "whiteAlpha.700");
  const { toggleColorMode } = useColorMode();

  const stats = [
    { label: "Id", value: "sbyun" },
    { label: "Department", value: "Development" },
    { label: "Rank", value: "Enterprise" },
    { label: "Expire Date", value: "2025-12-12" },
  ];
  // const stats2 = [
  //   { label: "Id", value: "234", diff: -12, helpText: "Till date" },
  //   { label: "User Name", value: "234", diff: -12, helpText: "Till date" },
  //   { label: "E-mail", value: "234", diff: -12, helpText: "Till date" },
  //   {
  //     label: "Zip Code",
  //     value: "£12,340",
  //     diff: 12,
  //     helpText: "Last 30 days",
  //   },
  //   { label: "Address", value: "3,450", diff: 4.5, helpText: "Last 30 days" },
  // ];

  const avatarContent = (
    <>
      <Box 
        position="relative" 
        borderRadius="full" 
        p={gradientBorder ? "2px" : "0"}
        bgGradient={gradientBorder ? colors.gradient.primary : undefined}
        boxShadow={gradientBorder ? `0 0 0 1px ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` : "none"}
      >
        <ChakraAvatar size="2xs" name="Sage" src="https://bit.ly/sage-adebayo" />
      </Box>
      <Text
        color="inherit"
        overflow="hidden"
        opacity={isSidebarOpen ? 1 : 0}
        w={isSidebarOpen ? "full" : "0"}
        transition="all 0.2s ease-in-out"
        textAlign="left"
        whiteSpace="nowrap"
      >
        Sage
      </Text>
    </>
  );

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setPlacement("bottom");
      } else {
        setPlacement(isSidebarOpen ? "right-start" : "right-end");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  if (!asButton) {
    return (
      <Box display="flex" alignItems="center" gap="6px" p="7px">
        {avatarContent}
      </Box>
    );
  }

  const hoverStyles = {
    bg: isDark ? "whiteAlpha.200" : colors.primary.alpha,
    color: isDark ? "whiteAlpha.900" : colors.primary.default,
  };

  return (
    <ChakraMenu.Root
      positioning={{
        placement,
        strategy: "fixed",
        offset: {
          mainAxis: 4,
          crossAxis: isSidebarOpen ? 0 : -4,
        },
      }}
    >
      <ChakraMenu.Trigger>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="start"
          h="10"
          ml="-9px"
          borderRadius="md"
          overflow="hidden"
          transition="all 0.2s ease-in-out"
          w={isSidebarOpen ? "120px" : "40px"}
          textAlign="center"
          p="8px"
          gap="6px"
          bg="transparent"
          color={textColor}
          _hover={hoverStyles}
          _active={hoverStyles}
          _expanded={hoverStyles}
        >
          {avatarContent}
        </Box>
      </ChakraMenu.Trigger>
      <Portal>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content
            bg={menuBg}
            borderWidth="1px"
            borderColor={menuBorderColor}
            borderRadius="xl"
            boxShadow={colors.shadow.md}
            backdropFilter="blur(8px)"
          >
            <ChakraMenu.ItemGroup>
              <DataListRoot orientation="horizontal" p="2">
                {stats.map((item) => (
                  <DataListItem
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    labelColor={menuSubtitleColor}
                    color={menuTextColor}
                  />
                ))}
              </DataListRoot>
            </ChakraMenu.ItemGroup>
            <Separator borderColor={menuBorderColor} />
            <ChakraMenu.Item
              value="color-mode"
              justifyContent="center"
              h="8"
              onClick={toggleColorMode}
              color={menuTextColor}
              _hover={{ bg: menuItemHoverBg, color: colors.primary.default }}
            >
              <Box 
                as={isDark ? LuSun : LuMoon} 
                color={colors.primary.default}
                mr={1}
              />
              Color Mode
            </ChakraMenu.Item>
            <Separator borderColor={menuBorderColor} />
            <Group gap="0" w="full" h="8">
              <ChakraMenu.Item
                value="setting"
                width="50%"
                justifyContent="center"
                h="8"
                color={menuTextColor}
                _hover={{ bg: menuItemHoverBg, color: colors.primary.default }}
              >
                <Box 
                  as={LuSettings} 
                  fontSize="20px" 
                  color={colors.primary.default}
                  mr={1}
                />
                Setting
              </ChakraMenu.Item>
              <Separator
                orientation="vertical"
                h="8"
                size="sm"
                borderColor={menuBorderColor}
              />
              <ChakraMenu.Item
                value="logout"
                width="50%"
                justifyContent="center"
                h="8"
                color={menuTextColor}
                _hover={{ bg: menuItemHoverBg, color: colors.primary.default }}
              >
                LogOut
              </ChakraMenu.Item>
            </Group>
          </ChakraMenu.Content>
        </ChakraMenu.Positioner>
      </Portal>
    </ChakraMenu.Root>
  );
}
