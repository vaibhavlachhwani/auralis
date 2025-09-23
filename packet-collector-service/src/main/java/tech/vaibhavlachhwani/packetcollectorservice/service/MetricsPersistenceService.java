package tech.vaibhavlachhwani.packetcollectorservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;
import tech.vaibhavlachhwani.packetcollectorservice.entity.Metric;
import tech.vaibhavlachhwani.packetcollectorservice.repository.MetricRepository;

import java.time.Instant;

@Service
@AllArgsConstructor
@Slf4j
public class MetricsPersistenceService {

    private MetricRepository repository;
    private ObjectMapper objectMapper;

    public void save(DashboardData dashboardData) {
        try {
            if (dashboardData.getPacketsPerSecond() == 0.0) {
                return;
            }

            String protocolDistribution = objectMapper.writeValueAsString(dashboardData.getProtocolDistribution());
            String topTalkers = objectMapper.writeValueAsString(dashboardData.getTopTalkers());
            String topDestinations = objectMapper.writeValueAsString(dashboardData.getTopDestinations());
            String topServices = objectMapper.writeValueAsString(dashboardData.getTopServices());

            Metric metric = Metric
                    .builder()
                    .time(Instant.now())
                    .bandwidthMbps(dashboardData.getBandwidthMbps())
                    .packetsPerSecond(dashboardData.getPacketsPerSecond())
                    .newConnectionsPerSec(dashboardData.getNewConnectionsPerSecond())
                    .resetConnectionsPerSec(dashboardData.getResetsPerSecond())
                    .protocolDistribution(protocolDistribution)
                    .topTalkers(topTalkers)
                    .topDestinations(topDestinations)
                    .topServices(topServices)
                    .build();

            repository.save(metric);
            log.info("Saved metric data to db.");
        } catch (Exception e) {
            log.error("Failed to store historical data", e);
        }
    }
}
