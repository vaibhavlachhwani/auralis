import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatBytes } from "@/utils/formatters";
import type { PortTraffic } from "@/types";

type TopServicesChartProps = {
  data: PortTraffic[] | null;
};

// --- Chart Configuration ---
const chartConfig = {
  bytes: {
    label: "Bytes",
    color: "var(--chart-2)", // Use a different color
  },
} satisfies ChartConfig;

export function TopServicesChart({ data }: TopServicesChartProps) {
  const chartData = useMemo(() => data?.slice().reverse() || [], [data]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ left: 10, right: 40 }}
      >
        <YAxis
          dataKey="port" // Use 'port' as the label
          type="category"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          width={50}
        />
        <XAxis type="number" hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => formatBytes(Number(value))}
              indicator="line"
            />
          }
        />
        <Bar
          dataKey="bytes"
          fill="var(--color-bytes)"
          radius={4}
          isAnimationActive={false}
        >
          <LabelList
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) => formatBytes(value, 1)}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
