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

export type ConnectionData = {
  connectionId: string | null;
  sourceIp: string | null;
  sourcePort: number;
  destinationIp: string | null;
  destinationPort: number;
  protocol: string | null;
  bytes: number;
  speedMbps: number;
};

export type TrendData = {
  time: string;
  avgBandwidth: number;
  maxBandwidth: number;
};

export type HistoryResponse = {
  queryStart: string;
  queryEnd: string;
  trendData: TrendData[];
  protocolDistribution: Record<string, number> | null;
  topTalkers: IpTraffic[] | null;
  topDestinations: IpTraffic[] | null;
  topServices: PortTraffic[] | null;
};
