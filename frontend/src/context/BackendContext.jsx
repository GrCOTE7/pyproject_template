import React, { createContext, useContext, useState, useEffect } from "react";

const BackendContext = createContext({ isConnected: false });

export const useBackendStatus = () => useContext(BackendContext);
export const BackendProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  // Permet à tous les composants d'accéder à l'état isConnected :

  useEffect(() => {
    let ws = null;
    let currentServerId = null;
    let reconnectTimeout = null;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/ws/reload`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "connected") {
          if (currentServerId && currentServerId !== data.server_id) {
            window.location.reload(); // 🔄 Rechargement automatique !
          }
          currentServerId = data.server_id; // Sauvegarde l'ID
        } else if (data.type === "heartbeat") {
          if (currentServerId && data.server_id !== currentServerId) {
            window.location.reload(); // 🔄 Rechargement automatique !
          }
        }
      };

      ws.onclose = () => {
        setIsConnected(false); // ❌ Backend déconnecté
        reconnectTimeout = setTimeout(connect, 1000);
        // Si le backend tombe, le frontend retente automatiquement la connexion
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
      // Quand le composant React se démonte, ferme proprement la connexion.
    };
  }, []);

  return (
    <BackendContext.Provider value={{ isConnected }}>
      {children}
    </BackendContext.Provider>
  );
};
