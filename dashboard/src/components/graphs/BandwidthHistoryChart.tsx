import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const TIME_WINDOW_SECONDS = 60;
const UPDATE_INTERVAL_SECONDS = 2;
const MAX_DATA_POINTS = TIME_WINDOW_SECONDS / UPDATE_INTERVAL_SECONDS;

type DataPoint = {
  secondsAgo: number;
  bandwidth: number | null;
};

type BandwidthHistoryChartProps = {
  currentBandwidth: number;
};

const chartConfig = {
  bandwidth: {
    label: "Bandwidth",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const createInitialData = (): DataPoint[] => {
  const initialData: DataPoint[] = [];
  for (let i = 0; i < MAX_DATA_POINTS; i++) {
    initialData.push({
      secondsAgo: (MAX_DATA_POINTS - 1 - i) * UPDATE_INTERVAL_SECONDS,
      bandwidth: null,
    });
  }
  return initialData;
};

export function BandwidthHistoryChart({
  currentBandwidth,
}: BandwidthHistoryChartProps) {
  const [data, setData] = useState<DataPoint[]>(createInitialData());

  useEffect(() => {
    setData((prevData) => {
      const shiftedData = prevData.slice(1);

      const newDataPoint: DataPoint = {
        secondsAgo: 0,
        bandwidth: currentBandwidth,
      };

      const newData = [...shiftedData, newDataPoint];

      return newData.map((point, index) => ({
        ...point,
        secondsAgo: (MAX_DATA_POINTS - 1 - index) * UPDATE_INTERVAL_SECONDS,
      }));
    });
  }, [currentBandwidth]);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="secondsAgo"
          domain={[TIME_WINDOW_SECONDS, 0]}
          ticks={[60, 50, 40, 30, 20, 10, 0]}
          tickFormatter={(value) => `${value}s`}
          tickLine={true}
          axisLine={false}
        />
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
              labelFormatter={(label) => `${label}`}
              formatter={(value) => `${Number(value).toFixed(2)} Mbps`}
            />
          }
        />

        <defs>
          <linearGradient id="fillBandwidth" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-bandwidth)"
              stopOpacity={1.0}
            />
            <stop
              offset="95%"
              stopColor="var(--color-bandwidth)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="bandwidth"
          type="monotone"
          fill="url(#fillBandwidth)"
          stroke="var(--color-bandwidth)"
          stackId="a"
          connectNulls={true}
          isAnimationActive={true}
        />
      </AreaChart>
    </ChartContainer>
  );
}
