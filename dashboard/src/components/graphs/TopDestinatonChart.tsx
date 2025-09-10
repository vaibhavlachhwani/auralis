import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatBytes } from "@/utils/formatters";
import type { IpTraffic } from "@/types";

type TopDestinationChartProps = {
  data: IpTraffic[] | null;
};

const chartConfig = {
  bytes: {
    label: "Bytes",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TopDestinationChart({ data }: TopDestinationChartProps) {
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
          dataKey="ip"
          type="category"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          width={110}
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
