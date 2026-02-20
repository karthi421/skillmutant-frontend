import { useState } from "react";

export default function CollaborativeLearningRooms() {
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CREATE ROOM =================
  const createRoom = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:8000/rooms/create", {
        method: "POST",
      });
      const data = await res.json();

      if (!data.room_id) {
        setStatus("Failed to create room");
        return;
      }

      // 🔥 OPEN ROOM IN NEW TAB
      window.open(`/room/${data.room_id}`, "_blank");
      logProgress(
  "learning_room",
  "Created a collaborative learning room",
  { roomId: data.room_id }
);

    } catch (err) {
      setStatus("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // ================= JOIN ROOM =================
  const joinRoom = async () => {
    if (!roomId.trim()) {
      setStatus("Please enter a room code");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:8000/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          user_id: "student_1",
        }),
      });

      const data = await res.json();

      if (data.detail) {
        setStatus(data.detail);
      } else {
        // 🔥 OPEN ROOM IN NEW TAB
        window.open(`/room/${roomId}`, "_blank");
        logProgress(
  "learning_room",
  "Joined a collaborative learning room",
  { roomId }
);

      }
    } catch (err) {
      setStatus("Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 
                    bg-[#020617] p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Collaborative Learning Rooms
        </h2>
        <p className="mt-1 text-sm text-slate-400 max-w-xl">
          Join focused peer learning rooms with live audio & video.
          Limited to <span className="text-slate-200">8 members</span>.
        </p>
      </div>

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CREATE ROOM */}
        <div className="rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Create a Room
          </h3>

          <p className="text-sm text-slate-400 mb-6">
            Start a new learning session and invite peers.
          </p>

          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full rounded-lg bg-slate-200 py-3 font-semibold text-black
                       hover:bg-white disabled:opacity-50">
            {loading ? "Creating..." : "Create Learning Room"}
          </button>
        </div>

        {/* JOIN ROOM */}
        <div className="rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Join Existing Room
          </h3>

          <p className="text-sm text-slate-400 mb-4">
            Enter the room code shared by your peer.
          </p>

          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room code"
            className="w-full mb-4 rounded-lg bg-black border border-slate-600
                       px-4 py-2.5 text-white placeholder-slate-500
                       focus:outline-none focus:border-slate-400"
          />

          <button
            onClick={joinRoom}
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-black
                       hover:bg-emerald-400 disabled:opacity-50">
            {loading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>

      {/* STATUS MESSAGE */}
      {status && (
        <p className="mt-6 text-sm text-red-400">
          {status}
        </p>
      )}
    </div>
  );
}
