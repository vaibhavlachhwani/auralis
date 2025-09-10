import { KpiCard } from "./KpiCard";

export function KpiCardsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <KpiCard />
      <KpiCard />
      <KpiCard />
      <KpiCard />
    </div>
  );
}
