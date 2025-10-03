# Auralis - Real-Time Network Monitoring Dashboard

![Auralis Logo](./docs/auralis-logo.svg)

## Demo

./docs/auralis_demo_final.mp4



Auralis is a powerful and intuitive web-based network monitoring tool designed to provide real-time insights into your network traffic. It captures live data packets, processes them to extract key metrics, and presents them on a dynamic and user-friendly dashboard.

## Key Features

-   **Real-Time Traffic Monitoring**: View live metrics such as bandwidth utilization, packets per second, and the number of active connections.
-   **In-Depth Traffic Analysis**: Identify top talkers, top destinations, and the most used services on your network.
-   **Interactive Dashboard**: A modern, responsive web interface with interactive charts and tables for easy data exploration.
-   **Protocol Distribution**: See a breakdown of network traffic by protocol (TCP, UDP, etc.).
-   **Connection Details**: View a detailed list of active network connections with information like source/destination IPs, ports, and data transferred.
-   **Historical Data Analysis**: Explore past network activity with a dedicated history page, allowing for trend analysis and retrospective investigation.

## Data Flow

1.  **Packet Capture and Forwarding**:
    -   The **`network-capture-service`** listens on a network interface using `tshark`.
    -   Raw packets are parsed by `pyshark` to extract key information (IPs, ports, protocols, etc.).
    -   This data is serialized to JSON and sent to the `packet-collector-service` via a WebSocket connection to the `/ingest` endpoint.

2.  **Data Aggregation, Storage, and Broadcasting**:
    -   The **`packet-collector-service`** receives the JSON data and aggregates it in real-time.
    -   A scheduled service calculates metrics like bandwidth, top talkers, and protocol distribution.
    -   **Historical Data Storage**: Aggregated metrics are also persisted to a **TimescaleDB** database for historical analysis.
    -   The aggregated metrics are then broadcasted as JSON payloads to all subscribed clients on a STOMP-enabled WebSocket topic (`/topic/metrics`).

3.  **Real-Time and Historical Visualization**:
    -   The **`dashboard`** establishes a WebSocket connection to the `packet-collector-service`.
    -   It subscribes to the STOMP topics to receive the aggregated metrics.
    -   The UI, built with React, dynamically updates to display the incoming data in charts and tables, providing a real-time view of the network activity.
    -   The dashboard also fetches historical data from the `packet-collector-service` (which retrieves it from TimescaleDB) for its dedicated history analysis page.

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
    -   **TimescaleDB**: For efficient storage and querying of time-series historical network data.

-   **Packet Capture (`network-capture-service`)**:
    -   Python 3
    -   `pyshark` for packet sniffing and parsing
    -   `websockets` for client-side WebSocket communication

## Local Development and Deployment

This guide provides instructions for setting up and running the Auralis project on a local machine using Docker and the provided helper scripts. For a manual, service-by-service setup, see the `README.md` file in each service's directory.

### 1. Prerequisites

Before you begin, ensure you have the following software installed on your system.

| Software         | Minimum Version | Description                                                  |
| :--------------- | :-------------- | :----------------------------------------------------------- |
| **Docker Engine**  | `20.10.0+`      | Required to build and run the containerized services.        |
| **Docker Compose** | `v2.0.0+`       | Used to orchestrate the multi-container application.         |
| **Python**         | `3.8+`          | For running the `network-capture-service`.                   |
| **tshark**         | Any             | The command-line tool for Wireshark, used for packet capture. |

### 2. Installation

Follow the instructions for your operating system to install the required software.

---

#### **For Debian-Based Systems (e.g., Ubuntu, Mint)**

```bash
# 1. Update package lists
sudo apt-get update

# 2. Install Docker and Docker Compose
# This command also adds the Docker repository if it's not already present.
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Install Python and tshark
sudo apt-get install -y python3 python3-pip tshark

# 4. Add your user to the 'docker' group to run Docker without sudo
# You will need to log out and log back in for this change to take effect.
sudo usermod -aG docker $USER

# 5. Configure tshark to allow non-root users to capture packets (Optional but recommended)
# When prompted, select 'Yes'. This avoids running the capture script with sudo.
sudo dpkg-reconfigure wireshark-common
sudo usermod -aG wireshark $USER
```

---

#### **For RHEL-Based Systems (e.g., Fedora, CentOS)**

```bash
# 1. Install DNF plugins and add Docker repository
sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

# 2. Install Docker and Docker Compose
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Start and enable the Docker service
sudo systemctl start docker
sudo systemctl enable docker

# 4. Install Python and tshark (wireshark-cli)
sudo dnf install -y python3 python3-pip wireshark-cli

# 5. Add your user to the 'docker' group to run Docker without sudo
# You will need to log out and log back in for this change to take effect.
sudo usermod -aG docker $USER
```

---

### 3. Running the Application Manually

This project includes helper scripts to simplify starting and stopping the application stack.

-   `run_services.sh`: Starts the Docker containers (database, backend, frontend) and the Python packet capture service.
-   `stop_services.sh`: Stops all running services.

**To Start Auralis:**

```bash
# To start all services and run the capture service silently in the background:
./run_services.sh

# To start all services and view the live output of the capture service:
./run_services.sh -v
```

The script will prompt for your `sudo` password to start the packet capture service. The dashboard will be available at `http://localhost:5173`.

**To Stop Auralis:**

```bash
# This will stop the Docker containers and the capture service.
./stop_services.sh
```

### 4. Running on System Startup (using `systemd`)

To configure Auralis to start automatically when your machine boots, you can create a `systemd` service.

**Step 1: Create a `systemd` Service File**

Create a new file named `auralis.service` in the `/etc/systemd/system/` directory. You will need `sudo` privileges to do this.

```bash
sudo nano /etc/systemd/system/auralis.service
```

Paste the following content into the file. **Important:** Replace `<your_user>` with your actual username and `<path_to_auralis>` with the absolute path to the project's root directory (e.g., `/home/user/auralis`).

```ini
[Unit]
Description=Auralis Network Monitoring Service
# Ensure services start after the network and Docker are ready
After=network.target docker.service
Requires=docker.service

[Service]
Type=forking
User=<your_user>
Group=docker
WorkingDirectory=<path_to_auralis>

# Use the provided scripts to start and stop the services
ExecStart=<path_to_auralis>/run_services.sh
ExecStop=<path_to_auralis>/stop_services.sh

Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Step 2: Configure Passwordless `sudo` for Scripts**

A `systemd` service cannot handle interactive password prompts. You must allow the user running the service to execute the necessary `sudo` commands without a password.

Run `sudo visudo` to safely edit the sudoers file, and add the following lines at the end. Remember to replace `<your_user>` and `<path_to_auralis>` with your specific details.

```
# Allow the Auralis service to run without a password
<your_user> ALL=(ALL) NOPASSWD: <path_to_auralis>/run_services.sh
<your_user> ALL=(ALL) NOPASSWD: <path_to_auralis>/stop_services.sh
<your_user> ALL=(ALL) NOPASSWD: /usr/bin/pkill -f capture.py
<your_user> ALL=(ALL) NOPASSWD: /usr/bin/python3 <path_to_auralis>/network-capture-service/capture.py
```

> **Security Note**: This configuration grants broad privileges for convenience in a development setup. For a production environment, it is strongly recommended to create a dedicated, non-root user with more restrictive permissions.

**Step 3: Enable and Manage the Service**

Reload the `systemd` daemon to recognize the new service, then enable it to start on boot.

```bash
# Reload systemd to process the new service file
sudo systemctl daemon-reload

# Enable the service to start automatically on boot
sudo systemctl enable auralis.service

# Start the service immediately
sudo systemctl start auralis.service
```

You can check the status and logs of the service at any time using these commands:

```bash
# Check the current status of the service
sudo systemctl status auralis.service

# View the latest logs from the service
sudo journalctl -u auralis.service -f
```

## Project Structure

The repository is organized into three main directories, each containing one of the core services:

```
.
├── dashboard/                  # Contains the React-based frontend application
├── network-capture-service/    # The Python service for capturing and parsing network packets
└── packet-collector-service/   # The Java/Spring Boot backend for data aggregation, broadcasting, and historical storage
```

For more detailed information about each service, please refer to the `README.md` file within its respective directory.
