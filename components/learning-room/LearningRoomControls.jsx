export default function LearningRoomControls() {
  return (
    <div className="p-4 bg-[#020617] flex justify-center gap-4">
      <button className="px-4 py-2 bg-slate-700 rounded">Mic</button>
      <button className="px-4 py-2 bg-slate-700 rounded">Cam</button>
      <button
        onClick={() => window.location.href = "/dashboard"}
        className="px-4 py-2 bg-red-500 rounded"
      >
        Leave
      </button>
    </div>
  );
}
