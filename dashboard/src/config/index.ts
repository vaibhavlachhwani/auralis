// Dynamically determine the backend hostname from the browser's current location.
// This allows the frontend to connect to the backend regardless of the server's IP address or domain.
const backendHostname = window.location.hostname;

// Construct the base URLs for the API and WebSocket connections.
// The backend service is expected to be running on port 8080.
export const SOCKET_URL = `ws://${backendHostname}:8080/ws`;
export const API_URL = `http://${backendHostname}:8080/api`;

// STOMP topics remain the same.
export const DASHBOARD_TOPIC = "/topic/dashboard";
export const CONNECTION_TOPIC = "/topic/connection";
