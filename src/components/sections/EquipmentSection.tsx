"use client";

import { Box } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { useColorMode } from "@/components/ui/color-mode";
import { Section } from "@/components/ui/section";
import { useMemo } from "react";
import {
  ColDef,
  CellClassParams,
  ModuleRegistry,
  CellStyleModule,
  ClientSideRowModelModule,
} from "ag-grid-community";
import {
  defaultGridOptions,
  themeDarkMode,
  themeLightMode,
} from "@/lib/ag-grid-config";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule, CellStyleModule]);

interface EquipmentData {
  id: string;
  status: string;
  temperature: string;
  lastCheck: string;
}

export function EquipmentSection() {
  const { colorMode } = useColorMode();

  const columnDefs = useMemo<ColDef<EquipmentData>[]>(
    () => [
      { field: "id", headerName: "장비 ID", width: 120 },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellStyle: (params: CellClassParams<EquipmentData>) => ({
          backgroundColor: params.value === "normal" ? "#4299E1" : "#ECC94B",
          color: "white",
        }),
      },
      { field: "temperature", headerName: "온도", width: 100 },
      { field: "lastCheck", headerName: "최종 점검", width: 150 },
    ],
    []
  );

  const rowData = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `EQ-${i + 1}`,
        status: Math.random() > 0.3 ? "normal" : "warning",
        temperature: `${Math.floor(Math.random() * 30 + 20)}°C`,
        lastCheck: new Date().toLocaleTimeString(),
      })),
    []
  );

  return (
    <Section title="장비 상태" subtitle="실시간 장비 상태 정보">
      <Box h="full">
        <AgGridReact
          className="ag-theme-quartz"
          theme={colorMode === "dark" ? themeDarkMode : themeLightMode}
          {...defaultGridOptions}
          columnDefs={columnDefs}
          rowData={rowData}
          animateRows={true}
          domLayout="autoHeight"
        />
      </Box>
    </Section>
  );
}
