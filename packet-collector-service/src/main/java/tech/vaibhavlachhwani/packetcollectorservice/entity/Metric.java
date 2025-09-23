package tech.vaibhavlachhwani.packetcollectorservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Entity
@Table(name = "metrics")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Metric {
    @Id
    @Column(nullable = false)
    private Instant time;

    private double bandwidthMbps;
    private double packetsPerSecond;
    private double newConnectionsPerSec;
    private double resetConnectionsPerSec;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String protocolDistribution;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String topTalkers; // Stored as a JSON string

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String topDestinations; // Stored as a JSON string

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String topServices; // Stored as a JSON string
}
