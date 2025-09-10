import type { IpTraffic, PortTraffic } from "@/types";
import { TopTalkersChart } from "./graphs/TopTalkersChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TopServicesChart } from "./graphs/TopServicesChart";
import { TopDestinationChart } from "./graphs/TopDestinatonChart";

type BarAreaProps = {
  topTalkersData: IpTraffic[] | null;
  topDestinationData: IpTraffic[] | null;
  topServicesData: PortTraffic[] | null;
};

export function BarArea({
  topTalkersData,
  topDestinationData,
  topServicesData,
}: BarAreaProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
      <div className="@xl/main:col-span-3 @5xl/main:col-span-1">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Top Talkers</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Top source IPs by traffic volume
              </span>
              <span className="@[540px]/card:hidden">
                Top source IPs by traffic volume
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[200px] flex">
            <TopTalkersChart data={topTalkersData} />
          </CardContent>
        </Card>
      </div>
      <div className="@xl/main:col-span-3 @5xl/main:col-span-1">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Top Destination</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Top destination IPs by traffic volume
              </span>
              <span className="@[540px]/card:hidden">
                Top destination IPs by traffic volume
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[200px] flex">
            <TopDestinationChart data={topDestinationData} />
          </CardContent>
        </Card>
      </div>
      <div className="@xl/main:col-span-3 @5xl/main:col-span-1">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Top destination ports by traffic volume
              </span>
              <span className="@[540px]/card:hidden">
                Top destination ports by traffic volume
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 h-[200px] flex">
            <TopServicesChart data={topServicesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
