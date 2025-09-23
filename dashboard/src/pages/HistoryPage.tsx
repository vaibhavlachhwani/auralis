import { BarArea } from "@/components/BarArea";
import { HistoryChartArea } from "@/components/HistoryChartArea";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useHistoryData } from "@/hooks/useHistoryData";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export function HistoryPage() {
  const isMobile = useIsMobile();
  const [start, setStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const [end, setEnd] = useState(() => new Date());
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    "24h"
  );

  const { data, loading, error } = useHistoryData(start, end);

  const handlePresetChange = (value: string) => {
    const now = new Date();
    let newStart = new Date();

    switch (value) {
      case "1h":
        newStart.setHours(now.getHours() - 1);
        break;
      case "6h":
        newStart.setHours(now.getHours() - 6);
        break;
      case "24h":
        newStart.setDate(now.getDate() - 1);
        break;
      case "7d":
        newStart.setDate(now.getDate() - 7);
        break;
      case "30d":
        newStart.setDate(now.getDate() - 30);
        break;
      default:
        return;
    }

    setStart(newStart);
    setEnd(now);
    setSelectedPreset(value);
  };

  const handleStartChange = (date: Date) => {
    setStart(date);
    setSelectedPreset(undefined);
  };

  const handleEndChange = (date: Date) => {
    setEnd(date);
    setSelectedPreset(undefined);
  };

  const Filters = () => (
    <div
      className={`flex gap-2 ${
        isMobile ? "flex-col items-stretch m-2" : "items-center"
      }`}
    >
      <Select onValueChange={handlePresetChange} value={selectedPreset}>
        <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
          <SelectValue placeholder="Select a preset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1h">Last 1 Hour</SelectItem>
          <SelectItem value="6h">Last 6 Hours</SelectItem>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
        </SelectContent>
      </Select>
      <DateTimePicker
        value={start}
        onChange={handleStartChange}
        className={isMobile ? "w-full" : ""}
      />
      <DateTimePicker
        value={end}
        onChange={handleEndChange}
        className={isMobile ? "w-full" : ""}
      />
    </div>
  );

  if (loading || !data) {
    return (
      <>
        <header>
          <SiteHeader title="History" />
        </header>
        <div className="flex flex-col h-full justify-center items-center">
          <Spinner size={64} variant="infinite" />
          <h2>Loading history data...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header>
          <SiteHeader title="History" />
        </header>
        <div className="flex flex-col h-full justify-center items-center">
          <h2>Error loading data</h2>
          <p>{error.message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <SiteHeader
          title="History"
          filterButton={
            isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Filter</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Filter the history data by time range.
                    </SheetDescription>
                  </SheetHeader>
                  <Filters />
                </SheetContent>
              </Sheet>
            ) : null
          }
        >
          {!isMobile ? <Filters /> : null}
        </SiteHeader>
      </header>
      <main>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HistoryChartArea
                trendData={data.trendData}
                protocolData={data.protocolDistribution}
                start={start}
                end={end}
              />
              <BarArea
                topServicesData={data.topServices}
                topTalkersData={data.topTalkers}
                topDestinationData={data.topDestinations}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
