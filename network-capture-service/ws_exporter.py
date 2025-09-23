import json

def serialize_packet(packet: dict) -> str:
    """
    Serializes the packet dictionary to a JSON string.
    """
    return json.dumps(packet)
