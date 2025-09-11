package tech.vaibhavlachhwani.packetcollectorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AggregatedData {
    private long totalBytes;
    private long totalPackets;
    private long newConnectionAttemptCount;
    private long connectionResetCount;

    private Map<String, Long> bytesPerProtocol;
    private Map<String, Long> bytesBySourceIp;
    private Map<String, Long> bytesByDestinationIp;
    private Map<Integer, Long> bytesPerDestinationPort;

    private Map<String, Long> bytesPerConnection;
}
