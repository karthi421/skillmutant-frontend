export default function AIRoadmapPanel({ roadmap }) {

  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-black/40 border border-white/10 rounded-xl">

      <h3 className="text-cyan-400 text-sm font-semibold mb-3">
        AI Career Roadmap
      </h3>

      <div className="space-y-3">

        {roadmap.map((phase, index) => (
          <div
            key={index}
            className="bg-white/5 p-3 rounded-lg"
          >
            <p className="text-sm font-medium text-white">
              Phase {index + 1}: {phase.phase}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {phase.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}