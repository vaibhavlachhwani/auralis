export type ProtocolData = Record<string, number>;

export type PortTraffic = {
  port: number;
  bytes: number;
};

export type IpTraffic = {
  ip: string;
  bytes: number;
};

export type DashboardData = {
  bandwidthMbps: number;
  packetsPerSecond: number;
  averagePacketSizeBytes: number;
  newConnectionsPerSecond: number;
  resetsPerSecond: number;
  protocolDistribution: Record<string, number> | null;
  topTalkers: IpTraffic[] | null;
  topDestinations: IpTraffic[] | null;
  topServices: PortTraffic[] | null;
};
