export default function InterviewReplay({ answers }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-lg font-semibold mb-3">
        Answer Replay
      </h3>

      <div className="space-y-4">
        {answers.map((a, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-md p-3"
          >
            <p className="text-sm font-medium mb-1">
              Q: {a.question}
            </p>

            <p className="text-sm text-slate-300 mb-2">
              A: {a.answer}
            </p>

            {a.audio && (
              <audio controls src={a.audio} className="w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
