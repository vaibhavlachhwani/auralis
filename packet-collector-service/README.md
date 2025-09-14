# Packet Collector Service

This service is the central hub of the Auralis network monitoring system. It is a backend application built with Java and the Spring Boot framework. Its primary responsibilities are to ingest parsed packet data, aggregate it in real-time to compute key performance metrics, and broadcast these metrics to the dashboard for visualization.

## Functionality

- **Data Ingestion**: Exposes a WebSocket endpoint (`/ingest`) to receive parsed packet data from the `network-capture-service`.
- **Real-Time Aggregation**: Processes the incoming stream of packet data, aggregating it in memory to calculate metrics such as bandwidth usage, packets per second, protocol distribution, and top talkers.
- **Metrics Broadcasting**: Periodically sends the aggregated metrics to all connected dashboard clients via a STOMP-enabled WebSocket endpoint (`/topic/metrics`).
- **Connection Tracking**: Maintains a list of active network connections, which is also sent to the dashboard.

## Technologies Used

- **Framework**: [Spring Boot 3](https://spring.io/projects/spring-boot)
- **Language**: [Java 21](https://www.oracle.com/java/)
- **Build Tool**: [Apache Maven](https://maven.apache.org/)
- **WebSockets**: [Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket.html) with [STOMP](https://stomp.github.io/) for messaging.

## Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Version 21 or higher.
- **Apache Maven**: For compiling the project and managing dependencies.

### Installation and Running

1.  **Navigate to the directory**:
    ```bash
    cd packet-collector-service
    ```

2.  **Build and run the service using Maven**:
    ```bash
    mvn spring-boot:run
    ```

    This command will compile the project, download the necessary dependencies, and start the application. By default, the service will run on port `8080`.

## Architecture

The service is built around a reactive, event-driven architecture. It uses two distinct WebSocket endpoints: one for ingesting data and another for broadcasting results. The core logic is centered around a real-time aggregator and a scheduled calculator.

```
   ┌──────────────────────────┐
   │ network-capture-service  │
   └──────────────────────────┘
              │
              │ (1) Parsed Packets (JSON)
              │ via WebSocket
              ▼
   ┌──────────────────────────┐
   │ IngestWebSocketConfig    │
   │ (Defines /ingest endpoint)│
   └──────────────────────────┘
              │
              │
              ▼
   ┌──────────────────────────┐
   │ PacketIngestHandler      │
   └──────────────────────────┘
              │
              │ (2) Raw PacketMetrics DTO
              ▼
   ┌──────────────────────────┐
   │ RealTimeMetricsAggregator│
   │ (Concurrent In-Memory Maps)│
   └──────────────────────────┘
              ▲
              │ (4) Fetches and clears data
              │
   ┌──────────────────────────┐
   │ MetricsCalculatorService │
   │ (@Scheduled every second)│
   └──────────────────────────┘
              │
              │ (5) AggregatedData DTO
              ▼
   ┌──────────────────────────┐
   │ WebSocketBroadcastService│
   └──────────────────────────┘
              │
              │ (6) Sends data to STOMP topics
              ▼
   ┌──────────────────────────┐
   │ WebSocketConfig          │
   │ (Defines /ws endpoint)   │
   └──────────────────────────┘
              │
              │ (7) Broadcast to clients
              ▼
   ┌──────────────────────────┐
   │ dashboard                │
   └──────────────────────────┘
```

### Data Flow and Component Responsibilities

1.  **Ingestion**: The `network-capture-service` sends JSON payloads to the `/ingest` endpoint. This endpoint is configured in `IngestWebSocketConfig` and handled by `PacketIngestHandler`.

2.  **Deserialization**: `PacketIngestHandler` receives the raw text message, deserializes the JSON into a `PacketMetrics` DTO (Data Transfer Object), and passes it to the `RealTimeMetricsAggregator`.

3.  **Real-Time Aggregation**: `RealTimeMetricsAggregator` acts as an in-memory database. It uses concurrent data structures (like `ConcurrentHashMap`) to safely store and aggregate the incoming `PacketMetrics` data from multiple threads.

4.  **Scheduled Calculation**: The `MetricsCalculatorService` is annotated with `@Scheduled` and runs once every second. It retrieves the aggregated data from the `RealTimeMetricsAggregator` for the completed time window and then clears the aggregator's internal stores to prepare for the next interval.

5.  **Metric Computation**: This service computes the final high-level metrics, such as total bandwidth, packets per second, top talkers, etc., and packages them into an `AggregatedData` DTO.

6.  **Broadcasting**: The `MetricsCalculatorService` invokes the `WebSocketBroadcastService`, passing it the `AggregatedData` DTO.

7.  **STOMP-based Distribution**: The `WebSocketBroadcastService` uses a `SimpMessagingTemplate` to send the `AggregatedData` to the `/topic/metrics` STOMP topic. The `WebSocketConfig` class configures this message broker and the `/ws` endpoint that the `dashboard` clients connect to.

## Endpoints

-   **Ingestion WebSocket**: `ws://localhost:8080/ingest`
    -   This is a raw WebSocket endpoint where the `network-capture-service` sends parsed packet data.
-   **Metrics STOMP WebSocket**: `ws://localhost:8080/ws`
    -   This is a STOMP-enabled endpoint for the dashboard.
    -   **Subscription Topics**:
        -   `/topic/metrics`: Broadcasts aggregated `DashboardData`.
        -   `/topic/connections`: Broadcasts the list of active `ConnectionData`.
