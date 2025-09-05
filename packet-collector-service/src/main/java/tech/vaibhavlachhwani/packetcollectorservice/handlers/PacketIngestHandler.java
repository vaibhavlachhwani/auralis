package tech.vaibhavlachhwani.packetcollectorservice.handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tech.vaibhavlachhwani.packetcollectorservice.dto.PacketMetrics;
import tech.vaibhavlachhwani.packetcollectorservice.service.RealTimeMetricsAggregator;

@Component
@AllArgsConstructor
public class PacketIngestHandler extends TextWebSocketHandler {
    private final RealTimeMetricsAggregator aggregator;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String packetMetricsJsonString = message.getPayload();

        ObjectMapper objectMapper = new ObjectMapper();
        PacketMetrics packetMetrics = objectMapper.readValue(packetMetricsJsonString, PacketMetrics.class);

        aggregator.processPacket(packetMetrics);

        TextMessage response = new TextMessage("Server ACK");
        session.sendMessage(response);
    }
}
