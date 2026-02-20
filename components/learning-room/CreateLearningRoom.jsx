import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateLearningRoom() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const createRoom = () => {
    if (!roomName.trim()) return;

    const roomId = Math.random().toString(36).substring(2, 8);
    router.push(`/learning-room?room=${roomId}&host=true`);
  };

  return (
    <div className="p-4 bg-[#020617] rounded border border-slate-700">
      <h3 className="font-semibold mb-2">Create Learning Room</h3>
      <input
        className="w-full p-2 mb-3 bg-black border border-slate-600 rounded"
        placeholder="Room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button
        onClick={createRoom}
        className="w-full bg-cyan-500 py-2 rounded"
      >
        Create Room
      </button>
    </div>
  );
}
