import { DATA_TOPIC, SOCKET_URL } from "@/config";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

const ConnectionStatus = {
  CONNECTING: "Connecting...",
  OPEN: "Open",
  CLOSED: "Closed",
  ERROR: "Error!",
};

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.CONNECTING
  );

  useEffect(() => {
    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,

      onConnect: () => {
        setConnectionStatus(ConnectionStatus.OPEN);

        client.subscribe(DATA_TOPIC, (message) => {
          try {
            const payload = JSON.parse(message.body);
            setDashboardData(payload);
          } catch (error) {
            console.error(Date.now(), "Error parsing message body : ", error);
          }
        });
      },

      onStompError: (frame) => {
        setConnectionStatus(ConnectionStatus.ERROR);
        console.error("Error occured : ", frame.body);
      },

      onDisconnect: () => {
        setConnectionStatus(ConnectionStatus.CLOSED);
      },

      debug: (str) => {
        console.info(Date.now(), str);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return { dashboardData, connectionStatus };
};
