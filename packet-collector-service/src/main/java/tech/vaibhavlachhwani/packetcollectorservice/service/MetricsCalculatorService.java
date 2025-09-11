package tech.vaibhavlachhwani.packetcollectorservice.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.AggregatedData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.ConnectionData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
@Slf4j
public class MetricsCalculatorService {
    private static final double WINDOW_DURATION_SECONDS = 2.0;
    private static final int TOP_N_COUNT = 5;

    private final RealTimeMetricsAggregator aggregator;
    private final WebSocketBroadcastService broadcastService;

    @Scheduled(fixedRate = (long) (WINDOW_DURATION_SECONDS * 1000))
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

        broadcastService.broadcastDashboardData(dashboardData);
        log.info("Broadcasting DashboardData...");

        List<ConnectionData> connections = snapshot.getBytesPerConnection()
                .entrySet()
                .stream()
                .map(entry -> parseConnectionId(entry.getKey(), entry.getValue()))
                .toList();

        broadcastService.broadcastConnectionData(connections);
        log.info("Broadcasting ConnectionData... ");
    }

    private ConnectionData parseConnectionId(String connectionId, long bytes) {
        try {
            String[] parts = connectionId.split("-");
            if (parts.length != 3) {
                log.warn("Malformed connection ID found: {}", connectionId);
                return null;
            }

            String[] sourceParts = parts[0].split(":");
            String[] destParts = parts[1].split(":");
            if (sourceParts.length != 2 || destParts.length != 2) {
                log.warn("Malformed IP/Port in connection ID: {}", connectionId);
                return null;
            }

            String sourceIp = sourceParts[0];
            int sourcePort = Integer.parseInt(sourceParts[1]);
            String destinationIp = destParts[0];
            int destinationPort = Integer.parseInt(destParts[1]);
            String protocol = parts[2];

            return ConnectionData
                    .builder()
                    .connectionId(connectionId)
                    .sourceIp(sourceIp)
                    .sourcePort(sourcePort)
                    .destinationIp(destinationIp)
                    .destinationPort(destinationPort)
                    .protocol(protocol)
                    .bytes(bytes)
                    .build();

        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
            log.error("Failed to parse connection ID: {}", connectionId, e);
            return null;
        }
    }
}
