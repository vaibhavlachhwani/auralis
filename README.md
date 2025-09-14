# Auralis - Real-Time Network Monitoring Dashboard

Auralis is a web-based network monitoring tool that provides real-time insights into network traffic. It captures live packets, processes them, and displays aggregated metrics on a user-friendly dashboard.

## Architecture

The application is composed of three main services:

```
+--------------------------+      +----------------------------+      +-----------------+
| network-capture-service  |      |  packet-collector-service  |      |    dashboard    |
| (Python)                 |      |  (Java / Spring Boot)      |      | (React / Vite)  |
+--------------------------+      +----------------------------+      +-----------------+
           |                                  ^      |                         ^
           | (1) Parsed Packets               |      | (2) Aggregated Data     |
           | (WebSocket)                      |      | (WebSocket / STOMP)     |
           v                                  |      v                         |
+--------------------------+                  |                                |
| Ingest WebSocket         |                  |                                |
| (/ingest)                |                  |                                |
+--------------------------+                  |                                |
           |                                  |                                |
           v                                  |                                |
+--------------------------+                  |                                |
| RealTimeMetricsAggregator|                  |                                |
+--------------------------+                  |                                |
           |                                  |                                |
           v                                  |                                |
+--------------------------+                  |                                |
| MetricsCalculatorService |------------------+                                |
| (Scheduled)              |                                                   |
+--------------------------+                                                   |
```

1.  **`network-capture-service`**: Captures raw packets, parses them, and sends them to the `packet-collector-service` via a WebSocket.
2.  **`packet-collector-service`**: Ingests the packet data, aggregates it in real-time, and broadcasts the metrics to the dashboard via a STOMP-enabled WebSocket.
3.  **`dashboard`**: A React-based frontend that visualizes the real-time network data.

## Features

*   Real-time monitoring of network traffic.
*   Key metrics like bandwidth usage, packets per second, and active connections.
*   Top talkers, top destinations, and top services identification.
*   A web-based dashboard with interactive charts and tables.

## Technologies Used

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   Recharts
    *   Shadcn/ui
*   **Backend:**
    *   Java
    *   Spring Boot
    *   WebSocket (STOMP)
*   **Packet Capture:**
    *   Python
    *   Pyshark
    *   WebSockets

## Getting Started

### Prerequisites

*   Java 21+
*   Maven
*   Python 3
*   Node.js and npm

### Running the Application

1.  **Start the `packet-collector-service`:**
    ```bash
    cd packet-collector-service
    mvn spring-boot:run
    ```
    The service will start on port 8080.

2.  **Start the `network-capture-service`:**
    ```bash
    cd network-capture-service
    pip install -r requirements.txt
    sudo python capture.py
    ```
    Note: `sudo` is required to capture network packets.

3.  **Start the `dashboard`:**
    ```bash
    cd dashboard
    npm install
    npm run dev
    ```
    The dashboard will be available at `http://localhost:5173`.

## Project Structure

```
.
├── dashboard/                  # React frontend
├── network-capture-service/    # Python packet capture service
└── packet-collector-service/   # Java/Spring Boot backend
```
