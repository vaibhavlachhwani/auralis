package tech.vaibhavlachhwani.packetcollectorservice.dto;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class CaseInsensitiveBooleanDeserializer extends JsonDeserializer<Boolean> {
    @Override
    public Boolean deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        JsonToken token = p.getCurrentToken();

        if (token.equals(JsonToken.VALUE_TRUE)) {
            return Boolean.TRUE;
        }
        if (token.equals(JsonToken.VALUE_FALSE)) {
            return Boolean.FALSE;
        }
        if (token.equals(JsonToken.VALUE_NULL)) {
            return null;
        }

        if (token.equals(JsonToken.VALUE_STRING)) {
            String text = p.getText().trim();
            if ("True".equalsIgnoreCase(text)) {
                return Boolean.TRUE;
            }
            if ("False".equalsIgnoreCase(text)) {
                return Boolean.FALSE;
            }
        }

        return (Boolean) ctxt.handleUnexpectedToken(Boolean.class, p);
    }
}
