import { columns } from "@/components/connections/columns";
import { DataTable } from "@/components/connections/DataTable";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useConnectionData } from "@/hooks/useConnectionData";

export function ConnectionsPage() {
  const { connectionData, isConnected } = useConnectionData();

  if (!isConnected) {
    return (
      <>
        <header>
          <SiteHeader title="Connections" />
        </header>
        <div className="flex flex-col h-full justify-center items-center">
          <Spinner size={64} variant="infinite" />
          <h2>Establishing connection...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <SiteHeader title="Connections" />
      </header>
      <div className="container mx-auto p-6">
        <DataTable columns={columns} data={connectionData} />
      </div>
    </>
  );
}
