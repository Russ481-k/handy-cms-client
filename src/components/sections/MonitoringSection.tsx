"use client";

import { Box } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import { useColorMode } from "@/components/ui/color-mode";
import { Section } from "@/components/ui/section";
import {
  ColDef,
  CellClassParams,
  ClientSideRowModelModule,
  ModuleRegistry,
  CellStyleModule,
} from "ag-grid-community";
import {
  defaultGridOptions,
  themeDarkMode,
  themeLightMode,
} from "@/lib/ag-grid-config";
import { useMemo, useEffect, useState } from "react";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule, CellStyleModule]);

interface MonitoringData {
  id: string;
  status: string;
  lastUpdate: string;
}

export function MonitoringSection() {
  const [rowData, setRowData] = useState<MonitoringData[]>([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const newData = Array.from({ length: 16 }, (_, i) => ({
      id: `LED-${i + 1}`,
      status: Math.random() > 0.5 ? "on" : "off",
      lastUpdate: new Date().toLocaleTimeString(),
    }));
    setRowData(newData);
  }, []);

  const columnDefs = useMemo<ColDef<MonitoringData>[]>(
    () => [
      { field: "id", headerName: "LED ID", width: 100 },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellStyle: (params: CellClassParams<MonitoringData>) => ({
          backgroundColor: params.value === "on" ? "#3182CE" : "#CBD5E0",
          color: "white",
        }),
      },
      { field: "lastUpdate", headerName: "최종 업데이트", width: 150 },
    ],
    []
  );

  return (
    <Section title="LED 상태 모니터링" subtitle="실시간 LED 상태 정보">
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
