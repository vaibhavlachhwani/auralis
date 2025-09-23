import { ProtocolDistributionChart } from "./graphs/ProtocolDistributionChart";
import { HistoricalBandwidthChart } from "./graphs/HistoricalBandwidthChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { TrendData } from "@/types";

type ProtocolData = Record<string, number>;

type HistoryChartAreaProps = {
  trendData: TrendData[];
  protocolData: ProtocolData | null;
  start: Date;
  end: Date;
};

export function HistoryChartArea({
  trendData,
  protocolData,
  start,
  end,
}: HistoryChartAreaProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <div className="@xl/main:col-span-2 @5xl/main:col-span-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Bandwidth History</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Historical network throughput
              </span>
              <span className="@[540px]/card:hidden">
                Historical network throughput
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[250px] flex">
            <HistoricalBandwidthChart
              trendData={trendData}
              start={start}
              end={end}
            />
          </CardContent>
        </Card>
      </div>
      <div className="@xl/main:col-span-2 @5xl/main:col-span-1">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Protocol Distribution</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Historical traffic breakdown by protocol
              </span>
              <span className="@[540px]/card:hidden">
                Historical traffic breakdown by protocol
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[250px] flex">
            <ProtocolDistributionChart protocolData={protocolData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
