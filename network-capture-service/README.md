# Network Capture Service

![Auralis Logo](./docs/auralis-logo.svg)

This service is a core component of the Auralis network monitoring tool. It is responsible for capturing live network packets from a specified network interface, parsing them to extract essential information, and forwarding the data to the `packet-collector-service` for aggregation and analysis.

## Functionality

-   **Packet Capture**: Uses the `pyshark` library, a Python wrapper for `tshark`, to sniff network traffic in real-time.
-   **Packet Parsing**: Extracts key details from each packet, including source and destination IP addresses, ports, protocol, packet size, and TCP flags.
-   **Data Forwarding**: Serializes the parsed packet data into a JSON format and sends it to the `packet-collector-service` via a WebSocket connection.

## Technologies Used

-   **Language**: [Python 3](https://www.python.org/)
-   **Packet Sniffing/Parsing**: [`pyshark`](https://kiminewt.github.io/pyshark/)
-   **WebSocket Communication**: [`websockets`](https://websockets.readthedocs.io/en/stable/)

## Getting Started

### Prerequisites

-   **Python 3**: Ensure you have a modern version of Python 3 installed.
-   **`tshark`**: This service depends on `tshark`, the command-line interface for the Wireshark network analyzer. You must install it on your system before running the service.

    -   **On Debian/Ubuntu**:
        ```bash
        sudo apt-get update
        sudo apt-get install tshark
        ```
        During the installation, you may be asked if non-superusers should be allowed to capture packets. For security reasons, it is recommended to select **No** and run the script with `sudo`.

    -   **On other systems**: Please refer to the official [Wireshark documentation](https://www.wireshark.org/download.html) for installation instructions.

### Installation and Running

1.  **Navigate to the directory**:
    ```bash
    cd network-capture-service
    ```

2.  **Create and install dependencies**:
    If a `requirements.txt` file does not exist, create one:
    ```bash
    echo "pyshark" > requirements.txt
    echo "websockets" >> requirements.txt
    ```
    Then, install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the capture script**:
    ```bash
    sudo python capture.py
    ```

    **Important**: You must run this script with `sudo` or as a user with sufficient privileges to capture network packets. This is because packet sniffing requires low-level access to the network interfaces.

## Configuration

The service can be configured by modifying the following files:

-   **`capture.py`**: You can change the network interface to be monitored by updating the `interface` variable in this script.
-   **`config.py`**: This file contains the WebSocket server URI to which the service sends data. By default, it is set to `ws://localhost:8080/ingest`. You can change this if your `packet-collector-service` is running on a different host or port.