import { BarArea } from "@/components/BarArea";
import { ChartArea } from "@/components/ChartArea";
import { KpiCardsSection } from "@/components/KpiCardsSection";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { useDashboardData } from "@/hooks/useDashboardData";

export function OverviewPage() {
  const { dashboardData, isConnected } = useDashboardData();

  if (!dashboardData || !isConnected) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <header>
        <SiteHeader title="Overview" />
      </header>
      <main>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <KpiCardsSection data={dashboardData} />
              <ChartArea
                currentBandwidth={
                  !dashboardData ? 0.0 : dashboardData.bandwidthMbps
                }
                protocolData={dashboardData.protocolDistribution}
              />
              <BarArea
                topServicesData={dashboardData.topServices}
                topTalkersData={dashboardData.topTalkers}
                topDestinationData={dashboardData.topDestinations}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
