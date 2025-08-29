package tech.vaibhavlachhwani.packetcollectorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardData {
    private double bandwidthMbps;
    private double packetsPerSecond;
    private double averagePacketSizeBytes;

    private double newConnectionsPerSecond;
    private double resetsPerSecond;

    private Map<String, Long> protocolDistribution;

    private List<IpTraffic> topTalkers;
    private List<IpTraffic> topDestinations;
    private List<PortTraffic> topServices;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class IpTraffic {
        private String ip;
        private long bytes;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PortTraffic {
        private int port;
        private long bytes;
    }
}
