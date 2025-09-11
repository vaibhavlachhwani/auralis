import { SiteHeader } from "@/components/site-header/SiteHeader";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useConnectionData } from "@/hooks/useConnectionData";

export function ConnectionsPage() {
  const { connectionData, isConnected } = useConnectionData();

  if (connectionData.length == 0 || !isConnected) {
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
      <p>{JSON.stringify(connectionData)}</p>
      <p>{isConnected}</p>
    </>
  );
}
