"use client";

import { CCTVSection } from "@/components/sections/CCTVSection";
import { EquipmentSection } from "@/components/sections/EquipmentSection";
import { MonitoringSection } from "@/components/sections/MonitoringSection";
import { StatisticsSection } from "@/components/sections/StatisticsSection";
import { GridSection } from "@/components/ui/grid-section";

import { Box } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function DashboardPage() {
  const bg = useColorModeValue("white", "black");
  const dashboardLayout = [
    { id: "monitoring", x: 0, y: 0, w: 6, h: 4 },
    { id: "cctv", x: 6, y: 0, w: 6, h: 4 },
    { id: "equipment", x: 0, y: 4, w: 6, h: 4 },
    { id: "statistics", x: 6, y: 4, w: 6, h: 4 },
  ];

  return (
    <Box bg={bg} h="100vh" w="100vw">
      <GridSection initialLayout={dashboardLayout}>
        <MonitoringSection />
        <CCTVSection />
        <EquipmentSection />
        <StatisticsSection />
      </GridSection>
    </Box>
  );
}
