import { DATA_TOPIC, SOCKET_URL } from "@/config";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,

      onConnect: () => {
        setIsConnected(true);

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
        setIsConnected(false);
        console.error("Error occured : ", frame.body);
      },

      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return { dashboardData, isConnected };
};
