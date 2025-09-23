package tech.vaibhavlachhwani.packetcollectorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HistoricalData {
    private Instant queryStart;
    private Instant queryEnd;

    private List<TrendDataPoint> trendData;

    private Map<String, Long> protocolDistribution;

    private List<DashboardData.IpTraffic> topTalkers;
    private List<DashboardData.IpTraffic> topDestinations;
    private List<DashboardData.PortTraffic> topServices;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendDataPoint {
        private Instant time;
        private double avgBandwidth;
        private double maxBandwidth;
    }
}
