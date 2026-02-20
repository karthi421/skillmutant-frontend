import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

/**
 * SkillGraphAnalysis
 * Explains AI skill & role evaluation in human language
 */
export default function SkillGraphAnalysis({
  roleMatch = null,
  skillQuality = [],
  atsScore = 0
}) {
  if (!roleMatch || skillQuality.length === 0) {
    return null;
  }

  const strong = skillQuality.filter(s => s.level === "strong");
  const average = skillQuality.filter(s => s.level === "average");
  const weak = skillQuality.filter(s => s.level === "weak");

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-card p-5 text-sm"


    >
     <h3 className="text-sm font-semibold mb-2 text-slate-400">


        AI Skill Interpretation
      </h3>

      {/* Summary */}
      <p className="text-slate-300 mb-4">
        Based on your resume, the AI evaluated your skill evidence and estimated a{" "}
        <span className="text-cyan-400 font-semibold">
          {roleMatch.match}% alignment
        </span>{" "}
        with the <span className="font-semibold">{roleMatch.role}</span> role.
      </p>

      {/* Breakdown */}
      <div className="space-y-3 text-sm">
        {strong.length > 0 && (
          <p className="text-green-400">
            ✔ Strong evidence found for {strong.length} skill(s). These are clearly
            demonstrated in your resume.
          </p>
        )}

        {average.length > 0 && (
          <p className="text-yellow-400">
            ◐ Moderate evidence for {average.length} skill(s). Adding project impact
            or metrics can strengthen these.
          </p>
        )}

        {weak.length > 0 && (
          <p className="text-red-400">
            ✘ Weak or minimal evidence for {weak.length} skill(s). These skills
            require better representation or learning.
          </p>
        )}
      </div>

      {/* ATS Context */}
      <div className="mt-4 text-xs text-slate-500">
        ATS Score: {atsScore}% — This reflects how well your resume matches
        automated screening systems, not your actual ability.
      </div>
    </motion.div>
  );
}
