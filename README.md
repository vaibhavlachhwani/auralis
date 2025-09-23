# Auralis - Real-Time Network Monitoring Dashboard

![Auralis Logo](./docs/auralis-logo.svg)

Auralis is a powerful and intuitive web-based network monitoring tool designed to provide real-time insights into your network traffic. It captures live data packets, processes them to extract key metrics, and presents them on a dynamic and user-friendly dashboard.

## Key Features

-   **Real-Time Traffic Monitoring**: View live metrics such as bandwidth utilization, packets per second, and the number of active connections.
-   **In-Depth Traffic Analysis**: Identify top talkers, top destinations, and the most used services on your network.
-   **Interactive Dashboard**: A modern, responsive web interface with interactive charts and tables for easy data exploration.
-   **Protocol Distribution**: See a breakdown of network traffic by protocol (TCP, UDP, etc.).
-   **Connection Details**: View a detailed list of active network connections with information like source/destination IPs, ports, and data transferred.

## Data Flow

1.  **Packet Capture and Forwarding**:
    -   The **`network-capture-service`** listens on a network interface using `tshark`.
    -   Raw packets are parsed by `pyshark` to extract key information (IPs, ports, protocols, etc.).
    -   This data is serialized to JSON and sent to the `packet-collector-service` via a WebSocket connection to the `/ingest` endpoint.

2.  **Data Aggregation and Broadcasting**:
    -   The **`packet-collector-service`** receives the JSON data and aggregates it in real-time.
    -   A scheduled service calculates metrics like bandwidth, top talkers, and protocol distribution.
    -   The aggregated metrics are then broadcasted as JSON payloads to all subscribed clients on a STOMP-enabled WebSocket topic (`/topic/metrics`).

3.  **Real-Time Visualization**:
    -   The **`dashboard`** establishes a WebSocket connection to the `packet-collector-service`.
    -   It subscribes to the STOMP topics to receive the aggregated metrics.
    -   The UI, built with React, dynamically updates to display the incoming data in charts and tables, providing a real-time view of the network activity.

For a more detailed look at the internal architecture of each service, please refer to the `README.md` file in its respective directory.

## Technologies Used

-   **Frontend (`dashboard`)**:
    -   React
    -   Vite
    -   TypeScript
    -   Tailwind CSS
    -   Recharts for charting
    -   Shadcn/ui for UI components

-   **Backend (`packet-collector-service`)**:
    -   Java (JDK 21)
    -   Spring Boot 3
    -   Spring WebSocket (with STOMP)
    -   Maven for dependency management

-   **Packet Capture (`network-capture-service`)**:
    -   Python 3
    -   `pyshark` for packet sniffing and parsing
    -   `websockets` for client-side WebSocket communication

## Getting Started

### Prerequisites

To run Auralis, you will need the following installed on your system:

-   **Java**: Version 21 or higher
-   **Maven**: For building and running the `packet-collector-service`
-   **Python**: Version 3.x
-   **Node.js**: For managing the `dashboard` dependencies and running the development server
-   **`tshark`**: The command-line utility for `Wireshark`. The `network-capture-service` depends on it for packet capture. You can install it via your system's package manager (e.g., `sudo apt-get install tshark` on Debian/Ubuntu).

### Running the Application

Follow these steps to get all the services up and running:

1.  **Start the `packet-collector-service`**:
    Open a terminal, navigate to the `packet-collector-service` directory, and run the service using Maven:
    ```bash
    cd packet-collector-service
    mvn spring-boot:run
    ```
    This will start the backend service on port `8080`.

2.  **Start the `network-capture-service`**:
    In a new terminal, navigate to the `network-capture-service` directory. You may need to create a `requirements.txt` file and install the dependencies first.
    ```bash
    cd network-capture-service
    # Create requirements.txt if it doesn't exist
    # echo "pyshark" > requirements.txt
    # echo "websockets" >> requirements.txt
    pip install -r requirements.txt
    sudo python capture.py
    ```
    **Note**: Running this script with `sudo` is necessary as packet capture requires elevated privileges.

3.  **Start the `dashboard`**:
    Finally, in a third terminal, navigate to the `dashboard` directory, install the Node.js dependencies, and start the development server:
    ```bash
    cd dashboard
    npm install
    npm run dev
    ```
    The dashboard will now be accessible in your web browser at `http://localhost:5173`.

## Project Structure

The repository is organized into three main directories, each containing one of the core services:

```
.
├── dashboard/                  # Contains the React-based frontend application
├── network-capture-service/    # The Python service for capturing and parsing network packets
└── packet-collector-service/   # The Java/Spring Boot backend for data aggregation and broadcasting
```

For more detailed information about each service, please refer to the `README.md` file within its respective directory.
