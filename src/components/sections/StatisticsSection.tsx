"use client";

import { Box, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useMemo, useEffect, useState } from "react";
import {
  AgCartesianChartOptions,
  AgChartThemeName,
  AgSeriesTooltipRendererParams,
  AgAxisLabelFormatterParams,
} from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { Section } from "@/components/ui/section";

interface ChartData {
  hour: string;
  value: number;
}

export function StatisticsSection() {
  const textColor = useColorModeValue("gray.800", "white");
  const chartTheme = useColorModeValue<AgChartThemeName>(
    "ag-default",
    "ag-default-dark"
  );

  const [data, setData] = useState<ChartData[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const newData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}시`,
      value: Math.floor(Math.random() * 100),
    }));
    setData(newData);
    setTotalCount(newData.reduce((sum, item) => sum + item.value, 0));
  }, []);

  const chartOptions = useMemo<AgCartesianChartOptions>(
    () => ({
      autoSize: true,
      theme: chartTheme,
      data,
      background: {
        fill: "transparent",
      },
      series: [
        {
          type: "bar",
          xKey: "hour",
          yKey: "value",
          yName: "데이터 수",
          fill: "#3182CE",
          stroke: "#2B6CB0",
          highlightStyle: {
            item: {
              fill: "#4299E1",
              stroke: "#2B6CB0",
            },
          },
          tooltip: {
            renderer: (
              params: AgSeriesTooltipRendererParams<ChartData>
            ): string => {
              return `${params.datum.value.toLocaleString()} 건`;
            },
          },
        },
      ],
      title: {
        text: "시간별 통계",
        fontSize: 14,
        color: textColor,
      },
      subtitle: {
        text: "24시간 동안의 데이터 분포",
        fontSize: 12,
        color: textColor,
      },
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: "시간",
            color: textColor,
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "데이터 수",
            color: textColor,
          },
          label: {
            formatter: (params: AgAxisLabelFormatterParams) =>
              params.value.toLocaleString(),
          },
        },
      ],
      legend: {
        enabled: false,
      },
    }),
    [textColor, chartTheme, data]
  );

  return (
    <Section
      title="시간별 통계"
      subtitle="24시간 동안의 데이터 분포"
      headerRight={
        <Text fontSize="xs" color="gray.500">
          총 {totalCount.toLocaleString()}건
        </Text>
      }
    >
      <Box h="full">
        <AgCharts options={chartOptions} />
      </Box>
    </Section>
  );
}
