#!/bin/bash

# A script to run the Auralis services on a Raspberry Pi.
# This script uses the docker-compose.rpi.yml override file.
# Use the -v flag to see the output of the python service.

# Prompt for sudo password at the beginning and update the timestamp.
sudo -v

# Default to running the Python service in the background
VERBOSE=false

# Check for a flag to run in the foreground
if [ "$1" == "-v" ]; then
  VERBOSE=true
fi

# Start Docker services using the RPi override file
echo "Starting Docker services for Raspberry Pi in detached mode..."
docker compose -f docker-compose.yml -f docker-compose.rpi.yml up -d

# Navigate to the Python service directory
cd network-capture-service

# Start Python service
if [ "$VERBOSE" = true ]; then
  echo "Starting Python service in foreground. Output will be displayed."
  sudo python3 capture.py
else
  echo "Starting Python service in the background."
  sudo python3 capture.py > /dev/null 2>&1 &
fi

# Return to the root directory
cd ..

echo "Services are starting."
