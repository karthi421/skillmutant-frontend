import { motion } from "framer-motion";

export default function AIRoadmapPanel({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="mb-8 bg-[#020617]/80 border border-white/10 rounded-2xl p-6">

      <h2 className="text-lg font-semibold mb-4 text-cyan-400">
        AI Career Roadmap
      </h2>

      <div className="space-y-4">

        {roadmap.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-xl p-4"
          >

            <p className="text-sm font-semibold text-white mb-2">
              Phase {index + 1}: {phase.phase}
            </p>

            <div className="flex flex-wrap gap-2">

              {phase.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full
                  bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                >
                  {skill}
                </span>
              ))}

            </div>

          </motion.div>
        ))}

      </div>

    </div>
  );
}