#!/bin/bash

# This script stops the Auralis services on a Raspberry Pi.
# It uses the docker-compose.rpi.yml override file to ensure
# the correct containers are targeted.

echo "Stopping Raspberry Pi Docker services..."
docker compose -f docker-compose.yml -f docker-compose.rpi.yml down

echo "Stopping Python capture service..."
# Use pkill to find and kill the process running capture.py
sudo pkill -f capture.py

echo "All services stopped."
