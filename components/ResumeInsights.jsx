import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

/**
 * ResumeInsights
 * @param {Object} props
 * @param {string} props.role - best fit role predicted by AI
 * @param {string[]} props.skills - extracted skills
 * @param {boolean} props.loading - analysis loading state
 */
export default function ResumeInsights({
  roleMatch = null,
  loading = false,
  onStartLearning = () => {}
}) {


 return (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className="bg-[#020617] border border-slate-700 rounded-xl p-6"
  >
    <h3 className="text-lg font-semibold mb-4">
      AI Career Insights
    </h3>

    {/* Loading */}
    {loading && (
      <p className="text-slate-400 animate-pulse">
        Generating career insights...
      </p>
    )}

    {/* Empty */}
    {!loading && !roleMatch && (
      <p className="text-slate-400">
        Upload a resume to get personalized career insights.
      </p>
    )}
    <div className="mb-4 p-3 rounded-md bg-slate-800/60 border border-slate-600 text-sm text-slate-300">
        This score reflects how strongly your <b>resume demonstrates</b> the role — 
        not your actual potential. Improving skill evidence will raise this score.
    </div>

    {/* ===== ROLE MATCH INSIGHTS ===== */}
    {!loading && roleMatch && (
      <>
        {/* Role + Match Percentage */}
        <div className="mb-4">
          <p className="text-lg font-semibold">
            {roleMatch.role}
            <span
              className="ml-2 text-cyan-400"
              title="AI-estimated role fit based on resume evidence, not experience level"
            >
              — {roleMatch.match}% Match
            </span>

          </p>
        </div>
        {roleMatch.match < 30 && (
  <p className="text-sm text-red-300 mb-3">
    Your resume currently shows limited evidence for this role.
    Focus on strengthening 2–3 core skills to see quick improvement.
  </p>
)}

{roleMatch.match >= 30 && roleMatch.match < 60 && (
  <p className="text-sm text-yellow-300 mb-3">
    You are on the right path. Enhancing a few weak areas will significantly
    improve your role fit.
  </p>
)}

{roleMatch.match >= 60 && (
  <p className="text-sm text-green-300 mb-3">
    Strong alignment detected. Continue refining your resume to maximize impact.
  </p>
)}


        {/* Strength Areas */}
        {roleMatch.strengths?.length > 0 && (
          <div className="mb-4">
            <p className="text-slate-400 mb-2">
              Strength Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {roleMatch.strengths.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="
                    px-3 py-1 rounded-full text-sm
                    bg-green-500/15 border border-green-400 text-green-300
                  "
                >
                  ✔ {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        {/* Skill Gaps */}
{roleMatch.gaps?.length > 0 && (
  <div>
    <p className="text-slate-400 mb-2">
        Skills to Strengthen
    </p>

    <div className="flex flex-wrap gap-3">
      {roleMatch.gaps.map((skill, index) => (
        <motion.div
          key={skill}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.04 }}
          className="
            flex items-center gap-2
            px-3 py-1 rounded-full text-sm
            bg-red-500/15 border border-red-400 text-red-300
          "
        >
          ✘ {skill}
         <button
          onClick={() => onStartLearning(skill)}
          title="Get AI-recommended courses and a learning plan for this skill"
          className="ml-2 px-2 py-0.5 text-xs rounded
             bg-cyan-500/20 text-cyan-300
             hover:bg-cyan-500/30 transition"
          >
            Start Learning
          </button>

        </motion.div>
      ))}
    </div>
  </div>
)}

      </>
    )}
  </motion.div>
);

}
