from pyshark.packet.packet import Packet

def parse_packet(packet: Packet) -> dict:
    try:
        parsed = {
            "epoch_timestamp": packet.sniff_timestamp,
            "frame_length": packet.length,
            "src_ip": getattr(packet.ip, "src", None),
            "dst_ip": getattr(packet.ip, "dst", None),
            "src_port": getattr(packet[packet.transport_layer], "srcport", None) if packet.transport_layer else None,
            "dst_port": getattr(packet[packet.transport_layer], "dstport", None) if packet.transport_layer else None,
            "protocol": packet.transport_layer,
        }

        if packet.transport_layer == "TCP":
            tcp_layer = packet.tcp
            parsed["tcp_flags"] = {
                "fin": getattr(tcp_layer, "flags_fin", None),
                "syn": getattr(tcp_layer, "flags_syn", None),
                "rst": getattr(tcp_layer, "flags_rst", None),
                "psh": getattr(tcp_layer, "flags_push", None),
                "ack": getattr(tcp_layer, "flags_ack", None),
                "urg": getattr(tcp_layer, "flags_urg", None),
                "ece": getattr(tcp_layer, "flags_ece", None),
                "cwr": getattr(tcp_layer, "flags_cwr", None),
            }

        return parsed

    except AttributeError:
        return None