#!/bin/bash

# This script stops the Auralis services.

echo "Stopping Docker services..."
docker compose down

echo "Stopping Python capture service..."
# Use pkill to find and kill the process running capture.py
sudo pkill -f capture.py

echo "All services stopped."
