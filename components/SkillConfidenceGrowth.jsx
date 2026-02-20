import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

export default function SkillConfidenceGrowth() {
  const history =
    JSON.parse(localStorage.getItem("resumeHistory")) || [];

  // Need at least two resumes
  if (!Array.isArray(history) || history.length < 2) {
    return (
      <div className="glass-card text-slate-400">
        Upload multiple resume versions to see skill confidence growth.
      </div>
    );
  }

  const before = history[history.length - 2];
  const after = history[history.length - 1];

  if (
    !before ||
    !after ||
    typeof before.confidence !== "object" ||
    typeof after.confidence !== "object"
  ) {
    return (
      <div className="glass-card text-slate-400">
        Skill confidence data not available for comparison.
      </div>
    );
  }

  const skills = Object.keys(after.confidence || {});

  const growthData = skills
    .map((skill) => {
      const prev = before.confidence?.[skill] || 0;
      const curr = after.confidence?.[skill] || 0;
      return {
        skill,
        prev,
        curr,
        diff: curr - prev,
      };
    })
    .filter((s) => s.diff !== 0);

  if (growthData.length === 0) {
    return (
      <div className="glass-card text-slate-400">
        No confidence changes detected yet.
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        Skill Confidence Growth
      </h3>

      <p className="text-sm text-slate-400 mb-6">
        Confidence levels are estimated from resume strength,
        keyword relevance, and project clarity — similar to how
        ATS systems interpret skill signals.
      </p>

      <div className="space-y-4">
        {growthData.map(({ skill, prev, curr, diff }) => (
          <div key={skill}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{skill}</span>
              <span
                className={
                  diff > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {prev}% → {curr}%{" "}
                {diff > 0 ? `▲ +${diff}%` : `▼ ${diff}%`}
              </span>
            </div>

            <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
              {/* BEFORE */}
              <div
                className="absolute left-0 top-0 h-2 bg-slate-500/40"
                style={{ width: `${prev}%` }}
              />

              {/* AFTER */}
              <motion.div
                initial={{ width: `${prev}%` }}
                animate={{ width: `${curr}%` }}
                transition={{ duration: 0.6 }}
                className="absolute left-0 top-0 h-2 bg-cyan-400"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
