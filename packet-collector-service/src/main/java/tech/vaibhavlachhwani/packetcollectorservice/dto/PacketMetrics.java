package tech.vaibhavlachhwani.packetcollectorservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PacketMetrics {

    @JsonProperty("epoch_timestamp")
    @JsonDeserialize(using = EpochToInstantDeserializer.class)
    private Instant timestamp;

    @JsonProperty("frame_length")
    private int packetLength;

    @JsonProperty("src_ip")
    private String sourceIp;

    @JsonProperty("dst_ip")
    private String destinationIp;

    @JsonProperty("src_port")
    private Integer sourcePort;

    @JsonProperty("dst_port")
    private Integer destinationPort;

    @JsonProperty("protocol")
    private String protocol;

    @JsonProperty("tcp_flags")
    private TcpFlags tcpFlags;
}
