import { useState } from "react";
import { useRouter } from "next/router";

export default function JoinLearningRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    if (!roomId.trim()) return;
    router.push(`/learning-room?room=${roomId}`);
  };

  return (
    <div className="p-4 bg-[#020617] rounded border border-slate-700">
      <h3 className="font-semibold mb-2">Join Learning Room</h3>
      <input
        className="w-full p-2 mb-3 bg-black border border-slate-600 rounded"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        onClick={joinRoom}
        className="w-full bg-green-500 py-2 rounded"
      >
        Join Room
      </button>
    </div>
  );
}
