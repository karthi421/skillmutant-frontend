import { useEffect, useRef } from "react";

export default function useRoomSocket(roomId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const baseUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL;

    // Convert https -> wss
    const wsUrl = baseUrl
      .replace("https://", "wss://")
      .replace("http://", "ws://");

    const ws = new WebSocket(`${wsUrl}/ws/rooms/${roomId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => ws.close();
  }, [roomId]);

  const send = (data) => {
    socketRef.current?.send(JSON.stringify(data));
  };

  return { send };
}