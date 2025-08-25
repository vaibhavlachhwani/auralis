import asyncio
import websockets
import json
from config import INGEST_SERVICE_URL

async def send_packets(packet_data):
    uri = INGEST_SERVICE_URL
    
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps(packet_data))
        response = await websocket.recv()
        print(f"Response: {response}")