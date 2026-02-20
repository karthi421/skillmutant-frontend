import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp } from "../lib/motion";

/**
 * JobMatches
 * Pure AI-driven job matching UI
 */
export default function JobMatches({
  skills = [],
  targetRole = "",
}) {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(skills) || skills.length === 0) return;

    const controller = new AbortController();

    async function fetchJobs() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/recommend-jobs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              skills,
              target_role: targetRole,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch job matches");
        }

        const data = await res.json();
        console.log("JOB API RESPONSE:", data);

        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Unable to load job matches right now.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
    return () => controller.abort();
  }, [skills, targetRole]);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-card md:col-span-2 p-6"
    >
      <h3 className="text-lg font-semibold mb-2">
        AI Job Matches
      </h3>

      <p className="text-slate-400 text-sm mb-4">
        Roles ranked by AI based on your resume skills and role alignment.
      </p>

      {/* Loading */}
      {loading && (
        <p className="text-slate-400 animate-pulse">
          Matching jobs to your profile…
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-slate-400 text-sm">
          No strong job matches found yet. Improving skill evidence will help.
        </p>
      )}

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.15 }}
            className="border border-white/10 rounded-lg p-4"
          >
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <h4 className="font-medium text-cyan-400">
                  {job.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {job.company || "Hiring company"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-cyan-400 font-bold">
                  {job.match}%</p>
                <p className="text-xs text-slate-400">
                  Match
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${job.match ?? 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-cyan-400 h-2"
              />
            </div>

           <p className="text-sm text-slate-300">
  {job.reason ??
   `Matched based on ${job.match ?? 0}% skill overlap with your resume.`}
</p>


            {Array.isArray(job.missing_skills) &&
              job.missing_skills.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  Missing skills: {job.missing_skills.join(", ")}
                </p>
              )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
