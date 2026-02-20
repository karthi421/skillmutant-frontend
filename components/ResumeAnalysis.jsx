import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

/**
 * ResumeAnalysis
 * @param {Object} props
 * @param {string[]} props.skills - extracted skills from resume
 * @param {boolean} props.loading - analysis loading state
 */
export default function ResumeAnalysis({ skills = [],  skillQuality = [],loading = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="bg-[#020617] border border-slate-700 rounded-xl p-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        AI Resume Analysis
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-slate-400 animate-pulse">
          Analyzing resume with AI...
        </p>
      )}

      {/* Empty State */}
      {!loading && skills.length === 0 && (
        <p className="text-slate-400">
          Upload a resume to extract skills.
        </p>
      )}

      {/* Skills */}
      {!loading && skills.length > 0 && (
        <>
          <p className="text-slate-400 mb-2">
            Extracted Skills
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
             Strong evidence
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Moderate evidence
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Weak evidence
            </span>
        </div>


          <div className="flex flex-wrap gap-2">
            {skillQuality.map((skill, index) => (
  <motion.span
    key={skill.name}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className={`
      px-3 py-1 rounded-full text-sm border
      ${
        skill.level === "strong"
          ? "bg-green-500/15 border-green-400 text-green-300"
          : skill.level === "average"
          ? "bg-yellow-500/15 border-yellow-400 text-yellow-300"
          : "bg-red-500/15 border-red-400 text-red-300"
      }
    `}
    title={`AI confidence score: ${skill.score}/100\nBased on resume evidence`}

  >
    {skill.name}
  </motion.span>
))}

          </div>
        </>
      )}
    </motion.div>
  );
}
