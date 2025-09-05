package tech.vaibhavlachhwani.packetcollectorservice.service;

import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.DashboardData;

@Service
@AllArgsConstructor
public class DemoWebSocketBroadcastService {
    private final SimpMessagingTemplate messagingTemplate;

    public void broadcast(DashboardData data) {
        messagingTemplate.convertAndSend("/topic/data", data);
        System.out.println("Sending data");
    }
}
