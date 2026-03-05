import { motion } from "framer-motion";

export default function AIRoadmap({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-5">
        AI Learning Roadmap
      </h3>

      <div className="relative pl-6 border-l border-cyan-400/30 space-y-6">

        {roadmap.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* timeline dot */}
            <div className="
              absolute -left-[10px] top-2
              w-4 h-4 rounded-full
              bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]
            " />

            <div className="
              bg-[#020617]/80 border border-white/10
              rounded-xl p-4 backdrop-blur
            ">

              {/* phase title */}
              <p className="text-sm font-semibold text-cyan-400 mb-2">
                Phase {index + 1}: {phase.phase}
              </p>

              {/* skills */}
              <div className="flex flex-wrap gap-2">
                {phase.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="
                      px-3 py-1 text-xs rounded-full
                      bg-white/5 border border-white/10
                      text-slate-300
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
}