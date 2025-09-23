# Packet Collector Service

![Auralis Logo](./docs/auralis-logo.svg)

This service is the central hub of the Auralis network monitoring system. It is a backend application built with Java and the Spring Boot framework. Its primary responsibilities are to ingest parsed packet data, aggregate it in real-time to compute key performance metrics, store historical data, and broadcast these metrics to the dashboard for visualization.

## Functionality

-   **Data Ingestion**: Exposes a WebSocket endpoint (`/ingest`) to receive parsed packet data from the `network-capture-service`.
-   **Real-Time Aggregation**: Processes the incoming stream of packet data, aggregating it in memory to calculate metrics such as bandwidth usage, packets per second, protocol distribution, and top talkers.
-   **Historical Data Storage**: Persists aggregated metrics into a **TimescaleDB** database, enabling long-term storage and historical analysis.
-   **Metrics Broadcasting**: Periodically sends the aggregated metrics to all connected dashboard clients via a STOMP-enabled WebSocket endpoint (`/topic/metrics`).
-   **Connection Tracking**: Maintains a list of active network connections, which is also sent to the dashboard.
-   **Historical Data Retrieval**: Provides REST API endpoints to query and retrieve historical network metrics from TimescaleDB for specified time ranges.

## Technologies Used

-   **Framework**: [Spring Boot 3](https://spring.io/projects/spring-boot)
-   **Language**: [Java 21](https://www.oracle.com/java/)
-   **Build Tool**: [Apache Maven](https://maven.apache.org/)
-   **WebSockets**: [Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket.html) with [STOMP](https://stomp.github.io/) for messaging.
-   **Database**: [TimescaleDB](https://www.timescale.com/) (built on PostgreSQL) for efficient time-series data storage and querying.
-   **JPA/Hibernate**: For database interaction with TimescaleDB.

## Getting Started

### Prerequisites

-   **Java Development Kit (JDK)**: Version 21 or higher.
-   **Apache Maven**: For compiling the project and managing dependencies.
-   **TimescaleDB**: A running instance of TimescaleDB (or PostgreSQL with the TimescaleDB extension) is required. Ensure it's accessible from where this service will run.

### Installation and Running

1.  **Navigate to the directory**:
    ```bash
    cd packet-collector-service
    ```

2.  **Configure Database Connection**: Before running, ensure your `application.properties` (or `application-dev.properties`) file is configured with the correct TimescaleDB connection details (e.g., URL, username, password).

3.  **Build and run the service using Maven**:
    ```bash
    mvn spring-boot:run
    ```

    This command will compile the project, download the necessary dependencies, and start the application. By default, the service will run on port `8080` and connect to your TimescaleDB instance.

## Data Flow and Component Responsibilities

1.  **Ingestion**: The `network-capture-service` sends JSON payloads to the `/ingest` WebSocket endpoint. This endpoint is configured in `IngestWebSocketConfig` and handled by `PacketIngestHandler`.

2.  **Deserialization**: `PacketIngestHandler` receives the raw text message, deserializes the JSON into a `PacketMetrics` DTO (Data Transfer Object), and passes it to the `RealTimeMetricsAggregator`.

3.  **Real-Time Aggregation**: `RealTimeMetricsAggregator` acts as an in-memory database. It uses concurrent data structures (like `ConcurrentHashMap`) to safely store and aggregate the incoming `PacketMetrics` data from multiple threads.

4.  **Scheduled Calculation and Persistence**: The `MetricsCalculatorService` is annotated with `@Scheduled` and runs once every second. It retrieves the aggregated data from the `RealTimeMetricsAggregator` for the completed time window, computes high-level metrics, and then **persists these aggregated metrics to TimescaleDB**. After persistence, it clears the aggregator's internal stores to prepare for the next interval.

5.  **Broadcasting**: The `MetricsCalculatorService` invokes the `WebSocketBroadcastService`, passing it the `AggregatedData` DTO.

6.  **STOMP-based Distribution**: The `WebSocketBroadcastService` uses a `SimpMessagingTemplate` to send the `AggregatedData` to the `/topic/metrics` STOMP topic. The `WebSocketConfig` class configures this message broker and the `/ws` endpoint that the `dashboard` clients connect to.

7.  **Historical Data Retrieval**: The `HistoryController` exposes REST endpoints (e.g., `/api/history/metrics`) that allow the `dashboard` to request historical aggregated metrics for specific time ranges. The `HistoryService` handles these requests by querying the TimescaleDB database.

## Endpoints

-   **Ingestion WebSocket**: `ws://localhost:8080/ingest`
    -   This is a raw WebSocket endpoint where the `network-capture-service` sends parsed packet data.
-   **Metrics STOMP WebSocket**: `ws://localhost:8080/ws`
    -   This is a STOMP-enabled endpoint for the dashboard.
    -   **Subscription Topics**:
        -   `/topic/metrics`: Broadcasts aggregated `DashboardData`.
        -   `/topic/connections`: Broadcasts the list of active `ConnectionData`.
-   **Historical Data REST API**: `/api/history/metrics`
    -   **GET**: `http://localhost:8080/api/history/metrics?start={ISO_START_TIME}&end={ISO_END_TIME}`
        -   Retrieves aggregated historical metrics within the specified time range.
