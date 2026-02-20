import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp } from "../lib/motion";
import { logProgress } from "../lib/logProgress";


/**
 * LearningPath
 * Pure AI-driven learning roadmap
 * No hardcoding, no assumptions
 */
export default function LearningPath({
  currentSkills = [],
  targetRole = "",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (!Array.isArray(currentSkills) || currentSkills.length === 0) return;

    const controller = new AbortController();

    async function fetchLearningPath() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
           `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/recommend-courses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify({
              current_skills: currentSkills,
              target_role: targetRole,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch learning path");
        }

        const data = await res.json();
        setSteps(Array.isArray(data.recommendations) ? data.recommendations : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Unable to generate learning path right now.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLearningPath();
    return () => controller.abort();
  }, [currentSkills, targetRole]);
const openCourseSearch = (skill, topic = "") => {
  const query = encodeURIComponent(
    `${skill} ${topic || "course"}`
  );

  const platforms = {
    youtube: `https://www.youtube.com/results?search_query=${query}`,
    coursera: `https://www.coursera.org/search?query=${query}`,
    udemy: `https://www.udemy.com/courses/search/?q=${query}`,
  };

  return platforms;
};

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="glass-card md:col-span-2 p-6"
    >
      <h3 className="text-lg font-semibold mb-2">
        AI Learning Path
      </h3>

      <p className="text-slate-400 text-sm mb-4">
        AI-generated roadmap based on your resume and target role.
      </p>

      {/* Loading */}
      {loading && (
        <p className="text-slate-400 animate-pulse">
          Analyzing skill gaps and building your roadmap…
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && steps.length === 0 && (
        <p className="text-green-400 text-sm">
          🎉 Your current skills already align well with the target role.
        </p>
      )}

      {/* Learning Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
  <div
    key={`${step.skill}-${index}`}
    className="border border-white/10 rounded-lg p-4"
  >
    <div className="flex justify-between items-start gap-4 mb-2">
      <h4 className="font-medium text-cyan-400">
        Step {index + 1}: {step.skill}
      </h4>

      <span className="text-xs text-slate-400">
        {step.priority_reason}
      </span>
    </div>

    {Array.isArray(step.courses) && step.courses.length > 0 ? (
      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
        {step.courses.slice(0, 3).map((course, i) => (
          <li key={i}>
            {course.title || "Recommended learning resource"}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-slate-500 text-sm">
        No specific courses available — focus on hands-on practice.
      </p>
    )}
<div className="flex gap-2 mt-2 text-xs">
  {["coursera", "udemy", "youtube"].map((p) => (
    <button
      key={p}
      onClick={() => {
        const platforms = openCourseSearch(
          step.skill,
          step.resources?.[0]
        );
        window.open(platforms[p], "_blank");
      }}
      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600"
    >
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </button>
  ))}
</div>

    {/* ✅ ADD BUTTON HERE */}




  </div>
))}

      </div>
    </motion.div>
  );
 

}
