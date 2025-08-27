package tech.vaibhavlachhwani.packetcollectorservice.dto;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;

public class EpochToInstantDeserializer extends JsonDeserializer<Instant> {
    @Override
    public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        String epochTimestampString = p.getText();

        if (epochTimestampString == null || epochTimestampString.trim().isEmpty()) {
            return null;
        }

        try {
            String[] parts = epochTimestampString.split("\\.");
            long seconds = Long.parseLong(parts[0]);
            long nanoseconds = 0;

            if (parts.length > 1) {
                BigDecimal fractionalPart = new BigDecimal("0." + parts[1]);
                nanoseconds = fractionalPart.movePointRight(9).longValue();
            }

            return Instant.ofEpochSecond(seconds, nanoseconds);
        } catch (NumberFormatException e) {
            throw new IOException("Failed to parse epoch string: " + epochTimestampString, e);
        }
    }
}
