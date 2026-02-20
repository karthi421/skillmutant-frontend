export default function InterviewAvatar({ speaking = false }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-32 h-32 rounded-full
        bg-gradient-to-br from-cyan-400 to-indigo-500
        flex items-center justify-center
        text-black text-4xl font-bold
        transition-all
        ${speaking ? "animate-pulse" : ""}`}
      >
        AI
      </div>

      <p className="mt-3 text-sm text-slate-300">
        Interviewer
      </p>
    </div>
  );
}
