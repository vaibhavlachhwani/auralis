import pyshark
import asyncio
import websockets
import threading
import queue
import json
import sys

from config import INTERFACE, BPF_FILTER, WEBSOCKET_URI
from packet_parser import parse_packet

def capture_thread(q, connection_event):
    """This function runs in a separate thread and handles packet capture."""
    try:
        print("[Capture Thread] Started.")
        capture = pyshark.LiveCapture(interface=INTERFACE, bpf_filter=BPF_FILTER)
        for packet in capture.sniff_continuously():
            # Only process and queue the packet if the network is connected.
            if connection_event.is_set():
                try:
                    parsed = parse_packet(packet=packet)
                    if parsed:
                        # This is a blocking call. It will wait for a free spot in the queue
                        # instead of discarding the packet. This applies backpressure.
                        q.put(parsed)
                except Exception as e:
                    print(f"[Capture Thread] Error parsing packet: {e}")
            # If not connected, the packet is simply ignored.

    except Exception as e:
        print(f"[Capture Thread] Failed to start capture: {e}")

async def network_thread(q, connection_event):
    """This function runs in the main asyncio loop, handling networking."""
    loop = asyncio.get_running_loop()

    while True:
        # Ensure the flag is cleared before attempting to connect
        connection_event.clear()
        print("Attempting to connect to WebSocket server...")
        try:
            async with websockets.connect(WEBSOCKET_URI) as websocket:
                print("Successfully connected to WebSocket server.")
                # Signal that the network is now connected
                connection_event.set()
                while True:
                    packet_to_send = await loop.run_in_executor(None, q.get)
                    
                    serialized_packet = json.dumps(packet_to_send)
                    await websocket.send(serialized_packet)
                    # Optional: print for verbosity
                    print(f"Sent packet: {packet_to_send.get('src_ip', 'N/A')}:{packet_to_send.get('src_port', 'N/A')} -> {packet_to_send.get('dst_ip', 'N/A')}:{packet_to_send.get('dst_port', 'N/A')}")

        except websockets.exceptions.ConnectionClosed as e:
            print(f"WebSocket connection lost: {e}. Reconnecting...")
            # The loop will restart, and the event will be cleared.
        except ConnectionRefusedError:
            print("Connection refused. Is the server running? Retrying in 5 seconds...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"An unexpected networking error occurred: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)

if __name__ == "__main__":
    packet_queue = queue.Queue(maxsize=100)
    connection_status_event = threading.Event()
    
    # The capture thread is a daemon so it exits when the main program exits
    cap_thread = threading.Thread(target=capture_thread, args=(packet_queue, connection_status_event), daemon=True)
    cap_thread.start()

    print("Starting network service...")
    try:
        asyncio.run(network_thread(packet_queue, connection_status_event))
    except KeyboardInterrupt:
        print("\nProgram terminated by user.")