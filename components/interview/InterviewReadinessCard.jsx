export default function InterviewReadinessCard() {
  if (typeof window === "undefined") return null;

  const data = JSON.parse(
    sessionStorage.getItem("interviewReadiness") || "null"
  );

  if (!data) return null;

  const { score, breakdown, verdict } = data;

  return (
    <div className="glass-card p-6 border border-cyan-400/20">
      <h2 className="text-xl font-semibold mb-2">
        Interview Readiness Score
      </h2>

      <div className="flex items-center gap-6 mb-4">
        <div className="text-5xl font-bold text-cyan-400">
          {score}%
        </div>
        <p className="text-slate-300 max-w-md">
          {verdict}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        {Object.entries(breakdown).map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between mb-1 capitalize">
              <span>{k.replace("_", " ")}</span>
              <span>{v}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded">
              <div
                className="h-2 bg-cyan-500 rounded"
                style={{ width: `${v}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
