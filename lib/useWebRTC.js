import { useEffect, useRef, useState } from "react";
import useRoomSocket from "./useRoomSocket";

export default function useWebRTC(roomId, localStream) {
  const peersRef = useRef({});
  const [peers, setPeers] = useState([]);
  const { send } = useRoomSocket(roomId, handleSignal);

  function handleSignal(signal) {
    // SDP / ICE handling (later)
  }

  const closeConnections = () => {
    Object.values(peersRef.current).forEach(pc => pc.close());
    peersRef.current = {};
    setPeers([]);
  };

  useEffect(() => {
    return () => {
      closeConnections(); // 🔥 auto cleanup
    };
  }, []);

  return { peers, closeConnections };
}
