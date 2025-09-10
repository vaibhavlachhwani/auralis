import { useMemo } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Pie, PieChart } from "recharts";
import type { ProtocolData } from "@/types";

type ProtocolDistributionChartProps = {
  protocolData: ProtocolData | null;
};

// --- Chart Configuration ---
// Define colors for the most common protocols.
const chartConfig = {
  TCP: {
    label: "TCP",
    color: "var(--chart-1)",
  },
  UDP: {
    label: "UDP",
    color: "var(--chart-2)",
  },
  ICMP: {
    label: "ICMP",
    color: "var(--chart-3)",
  },
  Other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ProtocolDistributionChart({
  protocolData,
}: ProtocolDistributionChartProps) {
  const { chartData, totalBytes } = useMemo(() => {
    if (!protocolData) {
      return { chartData: [], totalBytes: 0 };
    }

    const data = Object.entries(protocolData).map(([protocol, bytes]) => ({
      name: protocol,
      value: bytes,
      fill: `var(--color-${protocol})`, // Generates CSS variable like var(--color-TCP)
    }));

    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return { chartData: data, totalBytes: total };
  }, [protocolData]); // Dependency array: re-calculate only when protocolData changes.

  return (
    <ChartContainer config={chartConfig} className="mx-auto h-full w-full">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius="60%" // This turns the Pie into a Doughnut chart
          strokeWidth={5}
          isAnimationActive={false}
        >
          {/* This adds a label in the middle of the doughnut */}
          {/* You might need to install a library like 'filesize' for clean formatting */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-2xl font-bold"
          >
            {(totalBytes / 1024).toFixed(1)} KB
          </text>
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
