package tech.vaibhavlachhwani.packetcollectorservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PacketCollectorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PacketCollectorServiceApplication.class, args);
    }

}
