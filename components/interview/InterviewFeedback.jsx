export default function InterviewFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="glass-card p-6 space-y-5">
      <h3 className="text-lg font-semibold">
        HR Feedback Summary
      </h3>

      <div>
        <p className="text-sm font-medium text-emerald-400 mb-2">
          Strengths
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {feedback.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-medium text-red-400 mb-2">
          Areas to Improve
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {feedback.weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-medium text-cyan-400 mb-2">
          Actionable Advice
        </p>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          {feedback.advice.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
