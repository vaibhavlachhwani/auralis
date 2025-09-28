#!/bin/bash

# A script to run the Auralis services.
# Use the -v flag to see the output of the python service.

# Prompt for sudo password at the beginning and update the timestamp.
# This will remain active for the default timeout (usually 15 minutes).
sudo -v

# Default to running the Python service in the background
VERBOSE=false

# Check for a flag to run in the foreground
if [ "$1" == "-v" ]; then
  VERBOSE=true
fi

# Start Docker services
echo "Starting Docker services in detached mode..."
docker compose up -d

# Navigate to the Python service directory
cd network-capture-service

# Start Python service
if [ "$VERBOSE" = true ]; then
  echo "Starting Python service in foreground. Output will be displayed."
  # The sudo credentials should be cached from the start of the script.
  sudo python3 capture.py
else
  echo "Starting Python service in the background."
  # Redirect stdout and stderr to /dev/null to run silently.
  sudo python3 capture.py > /dev/null 2>&1 &
fi

# Return to the root directory
cd ..

echo "Services are starting."