# INTERFACE = "enp0s13f0u1"
INTERFACE = "any"
BPF_FILTER = "ip and not port 8080 and not net 127.0.0.0/8"
INGEST_SERVICE_URL = "ws://localhost:8080/ingest"