import { CONNECTION_TOPIC, SOCKET_URL } from "@/config";
import type { ConnectionData } from "@/types";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

export const useConnectionData = () => {
  const [connectionData, setConnectionData] = useState<ConnectionData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,

      onConnect: () => {
        setIsConnected(true);

        client.subscribe(CONNECTION_TOPIC, (message) => {
          try {
            const payload = JSON.parse(message.body);
            setConnectionData(payload);
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

  return { connectionData, isConnected };
};
