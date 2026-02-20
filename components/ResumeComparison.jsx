import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

export default function ResumeComparison() {
  const history =
    JSON.parse(localStorage.getItem("resumeHistory")) || [];

  if (!Array.isArray(history) || history.length < 2) {
    return (
      <div className="glass-card text-slate-400">
        Upload at least two resume versions to see comparison.
      </div>
    );
  }

  const before = history[history.length - 2];
  const after = history[history.length - 1];

  if (!before?.ats_score || !after?.ats_score) {
    return (
      <div className="glass-card text-slate-400">
        Resume data incomplete for comparison.
      </div>
    );
  }

  const scoreDiff = after.ats_score - before.ats_score;

  const beforeSkills = before.skills || [];
  const afterSkills = after.skills || [];

  const addedSkills = afterSkills.filter(
    (s) => !beforeSkills.includes(s)
  );

  const fixedIssues =
    before.ats_checklist?.filter(
      (issue) =>
        !issue.status &&
        after.ats_checklist?.some(
          (i) => i.item === issue.item && i.status
        )
    ) || [];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-6">
        Resume Comparison (Before vs After)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===== BEFORE ===== */}
        <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-400 mb-3">
            ❌ Before (Previous Version)
          </h4>

          <p className="text-sm mb-2">
            ATS Score:{" "}
            <span className="font-bold text-red-400">
              {before.ats_score}%
            </span>
          </p>

          <h5 className="text-xs text-slate-400 mb-1">
            ATS Issues
          </h5>

          <ul className="text-sm space-y-1">
            {before.ats_checklist
              ?.filter((i) => !i.status)
              .map((i) => (
                <li key={i.item} className="text-red-400">
                  ✘ {i.item}
                </li>
              ))}
          </ul>
        </div>

        {/* ===== AFTER ===== */}
        <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-3">
            ✅ After (Improved Version)
          </h4>

          <p className="text-sm mb-2">
            ATS Score:{" "}
            <span className="font-bold text-green-400">
              {after.ats_score}%
            </span>
          </p>

          <p
            className={`text-xs mb-3 ${
              scoreDiff >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {scoreDiff >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(scoreDiff)}% change
          </p>

          <h5 className="text-xs text-slate-400 mb-1">
            Improvements Applied
          </h5>

          {fixedIssues.length === 0 ? (
            <p className="text-sm text-slate-400">
              No ATS fixes applied yet.
            </p>
          ) : (
            <ul className="text-sm space-y-1">
              {fixedIssues.map((i) => (
                <li key={i.item} className="text-green-400">
                  ✔ {i.item}
                </li>
              ))}
            </ul>
          )}

          {addedSkills.length > 0 && (
            <>
              <h5 className="text-xs text-slate-400 mt-3 mb-1">
                Skills Added
              </h5>

              <div className="flex flex-wrap gap-2">
                {addedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-full bg-green-500/10 border border-green-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </motion.section>
  );
}
