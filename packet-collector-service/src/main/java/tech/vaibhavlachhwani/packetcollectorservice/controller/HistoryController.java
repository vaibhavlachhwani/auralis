package tech.vaibhavlachhwani.packetcollectorservice.controller;

import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.vaibhavlachhwani.packetcollectorservice.dto.HistoricalData;
import tech.vaibhavlachhwani.packetcollectorservice.service.HistoryService;

import java.time.Instant;

@RestController
@RequestMapping("/api/history")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/metrics")
    public ResponseEntity<HistoricalData> getHistoricalMetrics(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {

        HistoricalData data = historyService.getAggregatedMetrics(start, end);
        return ResponseEntity.ok(data);
    }
}
