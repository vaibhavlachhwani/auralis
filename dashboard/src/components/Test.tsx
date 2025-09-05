import { useDashboardData } from "@/hooks/useDashboardData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SiteHeader } from "./SiteHeader";

export function Test() {
  const { dashboardData, connectionStatus } = useDashboardData();
  const data = JSON.stringify(dashboardData);

  return (
    <>
      <header>
        <SiteHeader title="Test" />
      </header>
      <main>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Incoming WS DashboardData</CardTitle>
              <CardDescription>{connectionStatus}</CardDescription>
            </CardHeader>

            <CardContent>
              <p>{data}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
