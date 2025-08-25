import pyshark
import asyncio
from packet_parser import parse_packet
from config import INTERFACE, BPF_FILTER
from ws_exporter import send_packets

def capture_packets():
    capture = pyshark.LiveCapture(interface=INTERFACE, bpf_filter=BPF_FILTER)

    print("Starting live capture... Press Ctrl+C to stop.")

    try:
        for packet in capture.sniff_continuously():
            try:
                parsed = parse_packet(packet=packet)
                print(parsed)
                
                if parsed:
                    asyncio.run(send_packets(parsed))

            except AttributeError:
                print(f"[{packet.sniff_time}] Non-IP packet | {packet.highest_layer}")

    except KeyboardInterrupt:
        print("\nCapture stopped by user!")

    finally:
        capture.close()

if __name__ == "__main__":
    capture_packets()