import { KpiCard } from "./KpiCard";
import { type DashboardData } from "@/types"; // Import your central types
import { usePrevious } from "@/hooks/usePrevious";
import { formatBitsPerSecond } from "@/utils/formatters";

type KpiCardsSectionProps = {
  data: DashboardData;
};

// Helper function to calculate the percentage change safely
const calculateChange = (current: number, previous?: number): number => {
  if (previous === undefined || previous === null || previous === 0) {
    return 0; // Can't calculate change if previous is zero or doesn't exist
  }
  return ((current - previous) / previous) * 100;
};

export function KpiCardsSection({ data }: KpiCardsSectionProps) {
  // Use our custom hook to get the data from the last render
  const previousData = usePrevious(data);

  // Calculate the change for each metric
  const bandwidthChange = calculateChange(
    data.bandwidthMbps,
    previousData?.bandwidthMbps
  );
  const ppsChange = calculateChange(
    data.packetsPerSecond,
    previousData?.packetsPerSecond
  );
  const avgPacketSizeChange = calculateChange(
    data.averagePacketSizeBytes,
    previousData?.averagePacketSizeBytes
  );
  const newConnsChange = calculateChange(
    data.newConnectionsPerSecond,
    previousData?.newConnectionsPerSecond
  );
  const resetConnsChange = calculateChange(
    data.resetsPerSecond,
    previousData?.resetsPerSecond
  );

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <KpiCard
        title="Live Bandwidth"
        value={formatBitsPerSecond(data.bandwidthMbps * 1_000_000, 2)}
        unit="Network Speed"
        change={bandwidthChange}
      />

      <KpiCard
        title="Packets/Sec"
        value={data.packetsPerSecond.toFixed(0)}
        unit="Packets per Second"
        change={ppsChange}
      />

      <KpiCard
        title="Avg. Packet Size"
        value={data.averagePacketSizeBytes.toFixed(0)}
        unit="Bytes"
        change={avgPacketSizeChange}
      />

      <KpiCard
        title="New Connections/Sec"
        value={data.newConnectionsPerSecond.toFixed(1)}
        unit="Connections per Second"
        change={newConnsChange}
      />
    </div>
  );
}
