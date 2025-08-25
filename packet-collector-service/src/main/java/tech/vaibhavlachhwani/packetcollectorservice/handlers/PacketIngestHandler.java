package tech.vaibhavlachhwani.packetcollectorservice.handlers;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class PacketIngestHandler extends TextWebSocketHandler {
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String recMessage = message.getPayload();
        System.out.println("Received : " + recMessage);
        TextMessage response = new TextMessage("Server ACK");
        session.sendMessage(response);
    }
}
