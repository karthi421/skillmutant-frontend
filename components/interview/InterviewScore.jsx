export default function InterviewScore({ score }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-lg font-semibold mb-3">
        Interview Scorecard
      </h3>

      <div className="space-y-3">
        {Object.entries(score).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm">
              <span className="capitalize">{key}</span>
              <span className="text-cyan-400">{value}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded">
              <div
                className="h-2 rounded bg-cyan-500"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
