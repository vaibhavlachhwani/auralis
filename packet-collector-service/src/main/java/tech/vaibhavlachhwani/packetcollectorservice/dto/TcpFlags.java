package tech.vaibhavlachhwani.packetcollectorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TcpFlags {
    private Boolean fin;
    private Boolean syn;
    private Boolean rst;
    private Boolean psh;
    private Boolean ack;
    private Boolean urg;
    private Boolean ece;
    private Boolean cwr;
}
