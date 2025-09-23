import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { TrendData } from "@/types";
import { useMemo } from "react";

type HistoricalBandwidthChartProps = {
  trendData: TrendData[];
  start: Date;
  end: Date;
};

const chartConfig = {
  avgBandwidth: {
    label: "Avg Bandwidth",
    color: "var(--chart-1)",
  },
  maxBandwidth: {
    label: "Max Bandwidth",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function HistoricalBandwidthChart({
  trendData,
  start,
  end,
}: HistoricalBandwidthChartProps) {
  const durationInHours = useMemo(() => {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, [start, end]);

  const formattedData = trendData.map((d) => {
    const date = new Date(d.time);
    let time;

    if (durationInHours <= 24) {
      time = date.toLocaleTimeString();
    } else if (durationInHours <= 7 * 24) {
      time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else {
      time = date.toLocaleDateString();
    }

    return {
      ...d,
      time,
    };
  });

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        accessibilityLayer
        data={formattedData}
        margin={{ left: 0, right: 8 }}
      >
        <CartesianGrid vertical={false} />

        <XAxis dataKey="time" tickLine={true} axisLine={false} />
        <YAxis
          tickFormatter={(value) => `${Number(value).toFixed(2)}`}
          tickLine={false}
          axisLine={false}
          label={{ value: "Mbps", angle: -90, position: "insideLeft" }}
        />

        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                if (name === "avgBandwidth") {
                  return `${Number(value).toFixed(2)} Mbps (Avg)`;
                }
                if (name === "maxBandwidth") {
                  return `${Number(value).toFixed(2)} Mbps (Max)`;
                }
                return `${Number(value).toFixed(2)} Mbps`;
              }}
            />
          }
        />

        <defs>
          <linearGradient id="fillAvgBandwidth" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-avgBandwidth)"
              stopOpacity={1.0}
            />
            <stop
              offset="95%"
              stopColor="var(--color-avgBandwidth)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMaxBandwidth" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-maxBandwidth)"
              stopOpacity={1.0}
            />
            <stop
              offset="95%"
              stopColor="var(--color-maxBandwidth)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="avgBandwidth"
          type="monotone"
          fill="url(#fillAvgBandwidth)"
          stroke="var(--color-avgBandwidth)"
          stackId="a"
          connectNulls={true}
          isAnimationActive={true}
        />
        <Area
          dataKey="maxBandwidth"
          type="monotone"
          fill="url(#fillMaxBandwidth)"
          stroke="var(--color-maxBandwidth)"
          stackId="b"
          connectNulls={true}
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  );
}
