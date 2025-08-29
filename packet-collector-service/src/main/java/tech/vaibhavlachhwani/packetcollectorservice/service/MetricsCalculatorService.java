package tech.vaibhavlachhwani.packetcollectorservice.service;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.AggregatedData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class MetricsCalculatorService {
    private static final double WINDOW_DURATION_SECONDS = 2.0;
    private static final int TOP_N_COUNT = 5;

    private final RealTimeMetricsAggregator aggregator;

    @Scheduled(fixedRate = (long) WINDOW_DURATION_SECONDS * 1000)
    public void calculateAndBroadcastMetrics() {
        AggregatedData snapshot = aggregator.snapshotAndReset();

        double bandwidthMbps = (snapshot.getTotalBytes() * 8.0) / (WINDOW_DURATION_SECONDS * 1_000_000);
        double packetsPerSecond = snapshot.getTotalPackets() / WINDOW_DURATION_SECONDS;
        double averagePacketSizeBytes = snapshot.getTotalPackets() == 0 ? 0 :
                (double) snapshot.getTotalBytes() / snapshot.getTotalPackets();

        double newConnectionsPerSecond = snapshot.getNewConnectionAttemptCount() / WINDOW_DURATION_SECONDS;
        double resetsPerSecond = snapshot.getConnectionResetCount() / WINDOW_DURATION_SECONDS;

        Map<String, Long> protocolDistribution = snapshot.getBytesPerProtocol();

        List<DashboardData.IpTraffic> topTalkers = snapshot.getBytesBySourceIp()
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(TOP_N_COUNT)
                .map(entry -> new DashboardData.IpTraffic(entry.getKey(), entry.getValue()))
                .toList();

        List<DashboardData.IpTraffic> topDestination  = snapshot.getBytesByDestinationIp()
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(TOP_N_COUNT)
                .map(entry -> new DashboardData.IpTraffic(entry.getKey(), entry.getValue()))
                .toList();

        List<DashboardData.PortTraffic> topServices = snapshot.getBytesPerDestinationPort()
                .entrySet()
                .stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .limit(TOP_N_COUNT)
                .map(entry -> new DashboardData.PortTraffic(entry.getKey(), entry.getValue()))
                .toList();

        DashboardData dashboardData = DashboardData
                .builder()
                .bandwidthMbps(bandwidthMbps)
                .packetsPerSecond(packetsPerSecond)
                .averagePacketSizeBytes(averagePacketSizeBytes)
                .newConnectionsPerSecond(newConnectionsPerSecond)
                .resetsPerSecond(resetsPerSecond)
                .protocolDistribution(protocolDistribution)
                .topTalkers(topTalkers)
                .topDestinations(topDestination)
                .topServices(topServices)
                .build();

        System.out.println(dashboardData);
        System.out.println("****************************************************************************************************************");
    }
}
