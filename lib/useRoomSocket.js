import { useEffect, useRef } from "react";

export default function useRoomSocket(roomId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/rooms/${roomId}`);
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
