import { BandwidthHistoryChart } from "./graphs/BandwidthHistoryChart";
import { ProtocolDistributionChart } from "./graphs/ProtocolDistributionChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type ProtocolData = Record<string, number>;

type ChartAreaProps = {
  currentBandwidth: number;
  protocolData: ProtocolData;
};

export function ChartArea({ currentBandwidth, protocolData }: ChartAreaProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <div className="@xl/main:col-span-2 @5xl/main:col-span-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Bandwidth History</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Live network throughput
              </span>
              <span className="@[540px]/card:hidden">Last 3 months</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[250px] flex">
            <BandwidthHistoryChart currentBandwidth={currentBandwidth} />
          </CardContent>
        </Card>
      </div>
      <div className="@xl/main:col-span-2 @5xl/main:col-span-1">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Protocol Distribution</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Live network throughput
              </span>
              <span className="@[540px]/card:hidden">Last 3 months</span>
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
