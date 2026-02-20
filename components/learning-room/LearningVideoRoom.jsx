import { useEffect } from "react";
import LearningVideoTile from "./LearningVideoTile";
import LearningRoomControls from "./LearningRoomControls";
import useWebRTC from "@/lib/useWebRTC";

export default function LearningVideoRoom({ roomId }) {
  const { localStream, peers } = useWebRTC(roomId);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 p-4">
        {localStream && (
          <LearningVideoTile stream={localStream} isLocal />
        )}
        {peers.map((peer) => (
          <LearningVideoTile key={peer.id} stream={peer.stream} />
        ))}
      </div>
      <LearningRoomControls />
    </div>
  );
}
