import { motion } from "framer-motion";

/**
 * SkillGraph
 * @param {Object} props
 * @param {number} props.score - overall skill strength (0–100)
 * @param {string} props.label - what this score represents
 */
export default function SkillGraph({
  score = 0,
  label = "Overall Skill Strength"
}) {
  const safeScore = Math.max(0, Math.min(score, 100));

  const getColor = () => {
    if (safeScore >= 70) return "bg-green-500";
    if (safeScore >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMessage = () => {
    if (safeScore >= 70)
      return "Strong evidence across multiple resume sections.";
    if (safeScore >= 40)
      return "Moderate evidence. Strengthen key skills for better impact.";
    return "Weak resume evidence. Add projects or experience to improve.";
  };

  return (
   <div className="glass-card p-5 text-center">


      <h3 className="text-lg font-semibold mb-3">
        {label}
      </h3>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-4 ${getColor()}`}
        />
      </div>

      {/* Score */}
      <p className="mt-3 text-xl font-bold text-cyan-400">
        {safeScore}%
      </p>

      {/* AI Explanation */}
      <p className="mt-2 text-sm text-slate-400">
        {getMessage()}
      </p>

      {/* Hint */}
     
    </div>
  );
}
