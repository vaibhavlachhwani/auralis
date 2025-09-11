package tech.vaibhavlachhwani.packetcollectorservice.service;

import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.ConnectionData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;

@Service
@AllArgsConstructor
public class WebSocketBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastDashboardData(DashboardData data) {
        messagingTemplate.convertAndSend("/topic/dashboard", data);
    }

    public void broadcastConnectionData(ConnectionData data) {
        messagingTemplate.convertAndSend("/topic/connection", data);
    }
}
