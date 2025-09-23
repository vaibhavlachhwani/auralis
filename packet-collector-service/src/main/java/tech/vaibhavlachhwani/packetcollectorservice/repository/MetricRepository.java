package tech.vaibhavlachhwani.packetcollectorservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tech.vaibhavlachhwani.packetcollectorservice.entity.Metric;

import java.time.Instant;
import java.util.List;

@Repository
public interface MetricRepository extends JpaRepository<Metric, Instant> {
    // You can keep this for fetching raw, un-aggregated data if needed.
    List<Metric> findByTimeBetweenOrderByTimeAsc(Instant start, Instant end);

    // --- AGGREGATION QUERIES ---

    /**
     * Aggregates bandwidth metrics by the minute.
     * Ideal for time ranges up to 24 hours.
     */
    @Query(value = "SELECT time_bucket('1 minute', time) as bucket, " +
            "AVG(bandwidth_mbps) as avg_bandwidth, " +
            "MAX(bandwidth_mbps) as peak_bandwidth " +
            "FROM metrics WHERE time BETWEEN ?1 AND ?2 " +
            "GROUP BY bucket ORDER BY bucket",
            nativeQuery = true)
    List<Object[]> findBandwidthAggregatedByMinute(Instant start, Instant end);

    /**
     * Aggregates bandwidth metrics by the hour.
     * Ideal for time ranges up to 7-30 days.
     */
    @Query(value = "SELECT time_bucket('1 hour', time) as bucket, " +
            "AVG(bandwidth_mbps) as avg_bandwidth, " +
            "MAX(bandwidth_mbps) as peak_bandwidth " +
            "FROM metrics WHERE time BETWEEN ?1 AND ?2 " +
            "GROUP BY bucket ORDER BY bucket",
            nativeQuery = true)
    List<Object[]> findBandwidthAggregatedByHour(Instant start, Instant end);

    /**
     * Aggregates bandwidth metrics by the day.
     * Ideal for long-term time ranges (e.g., several months).
     */
    @Query(value = "SELECT time_bucket('1 day', time) as bucket, " +
            "AVG(bandwidth_mbps) as avg_bandwidth, " +
            "MAX(bandwidth_mbps) as peak_bandwidth " +
            "FROM metrics WHERE time BETWEEN ?1 AND ?2 " +
            "GROUP BY bucket ORDER BY bucket",
            nativeQuery = true)
    List<Object[]> findBandwidthAggregatedByDay(Instant start, Instant end);

    // --- AGGREGATION QUERIES FOR TOP N TABLES (JSONB) ---

    @Query(value = "SELECT ip, SUM(bytes) as total_bytes FROM (" +
            "  SELECT (jsonb_array_elements(top_talkers)->>'ip') as ip, " +
            "         (jsonb_array_elements(top_talkers)->>'bytes')::bigint as bytes " +
            "  FROM metrics WHERE time BETWEEN ?1 AND ?2 AND top_talkers IS NOT NULL" +
            ") as unnested_talkers " +
            "GROUP BY ip ORDER BY total_bytes DESC LIMIT ?3",
            nativeQuery = true)
    List<Object[]> findTopTalkersInRange(Instant start, Instant end, int limit);

    @Query(value = "SELECT port, SUM(bytes) as total_bytes FROM (" +
            "  SELECT (jsonb_array_elements(top_services)->>'port')::integer as port, " +
            "         (jsonb_array_elements(top_services)->>'bytes')::bigint as bytes " +
            "  FROM metrics WHERE time BETWEEN ?1 AND ?2 AND top_services IS NOT NULL" +
            ") as unnested_services " +
            "GROUP BY port ORDER BY total_bytes DESC LIMIT ?3",
            nativeQuery = true)
    List<Object[]> findTopServicesInRange(Instant start, Instant end, int limit);

    @Query(value = "SELECT ip, SUM(bytes) as total_bytes FROM (" +
            "  SELECT (jsonb_array_elements(top_destinations)->>'ip') as ip, " +
            "         (jsonb_array_elements(top_destinations)->>'bytes')::bigint as bytes " +
            "  FROM metrics WHERE time BETWEEN ?1 AND ?2 AND top_talkers IS NOT NULL" +
            ") as unnested_destinations " +
            "GROUP BY ip ORDER BY total_bytes DESC LIMIT ?3",
            nativeQuery = true)
    List<Object[]> findTopDestinationsInRange(Instant start, Instant end, int limit);

    // --- AGGREGATION PROTOCOL DISTRIBUTION (JSONB) ---

    @Query(value = "SELECT protocol, SUM(bytes) as total_bytes FROM (" +
            "  SELECT key as protocol, value::bigint as bytes " +
            "  FROM metrics, jsonb_each_text(protocol_distribution) " +
            "  WHERE time BETWEEN ?1 AND ?2 AND protocol_distribution IS NOT NULL" +
            ") as unnested_protocols " +
            "GROUP BY protocol ORDER BY total_bytes DESC LIMIT ?3",
            nativeQuery = true)
    List<Object[]> findProtocolDistributionInRange(Instant start, Instant end, int limit);
}
