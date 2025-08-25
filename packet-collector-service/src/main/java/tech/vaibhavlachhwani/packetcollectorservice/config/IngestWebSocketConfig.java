package tech.vaibhavlachhwani.packetcollectorservice.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import tech.vaibhavlachhwani.packetcollectorservice.handlers.PacketIngestHandler;

@Configuration
@EnableWebSocket
@AllArgsConstructor
public class IngestWebSocketConfig implements WebSocketConfigurer {
    private PacketIngestHandler packetIngestHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(packetIngestHandler, "/ingest")
                .setAllowedOriginPatterns("*");
    }
}
