package tech.vaibhavlachhwani.packetcollectorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConnectionData {
    private String connectionId;
    private String  sourceIp;
    private int sourcePort;
    private String destinationIp;
    private int destinationPort;
    private String protocol;
    private long bytes;
}
