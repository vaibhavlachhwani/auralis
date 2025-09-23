package tech.vaibhavlachhwani.packetcollectorservice.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.HistoricalData;
import tech.vaibhavlachhwani.packetcollectorservice.repository.MetricRepository;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class HistoryService {
    private final MetricRepository metricRepository;
    private static final int TOP_N_LIMIT = 6; // How many top talkers/services to query
    private static final int PROTOCOL_LIMIT = 5;

    public HistoricalData getAggregatedMetrics(Instant start, Instant end) {
        List<HistoricalData.TrendDataPoint> trendData = getTrendData(start, end);

        List<DashboardData.IpTraffic> topTalkers = metricRepository.findTopTalkersInRange(start, end, TOP_N_LIMIT)
                .stream()
                .map(row -> new DashboardData.IpTraffic((String) row[0], ((BigDecimal) row[1]).longValue()))
                .collect(Collectors.toList());

        List<DashboardData.IpTraffic> topDestinations = metricRepository.findTopDestinationsInRange(start, end, TOP_N_LIMIT)
                .stream()
                .map(row -> new DashboardData.IpTraffic((String) row[0], ((BigDecimal) row[1]).longValue()))
                .collect(Collectors.toList());

        List<DashboardData.PortTraffic> topServices = metricRepository.findTopServicesInRange(start, end, TOP_N_LIMIT)
                .stream()
                .map(row -> new DashboardData.PortTraffic((Integer) row[0], ((BigDecimal) row[1]).longValue()))
                .collect(Collectors.toList());

        Map<String, Long> protocolDistribution = metricRepository.findProtocolDistributionInRange(start, end, PROTOCOL_LIMIT)
                .stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> ((BigDecimal) row[1]).longValue()
                ));

        // --- 4. Assemble the Final DTO ---
        return HistoricalData.builder()
                .queryStart(start)
                .queryEnd(end)
                .trendData(trendData)
                .topTalkers(topTalkers)
                .topServices(topServices)
                .topDestinations(topDestinations)
                .protocolDistribution(protocolDistribution)
                .build();
    }

    private List<HistoricalData.TrendDataPoint> getTrendData(Instant start, Instant end) {
        Duration duration = Duration.between(start, end);
        List<Object[]> results;

        if (duration.toHours() <= 24) {
            results = metricRepository.findBandwidthAggregatedByMinute(start, end);
        } else if (duration.toDays() <= 7) {
            results = metricRepository.findBandwidthAggregatedByHour(start, end);
        } else {
            results = metricRepository.findBandwidthAggregatedByDay(start, end);
        }

        return results.stream()
                .map(this::mapToTrendDataPoint)
                .collect(Collectors.toList());
    }

    private HistoricalData.TrendDataPoint mapToTrendDataPoint(Object[] row) {
        return HistoricalData.TrendDataPoint
                .builder()
                .time(((Instant) row[0]))
                .avgBandwidth((Double) row[1])
                .maxBandwidth((Double) row[2])
                .build();
    }
}
