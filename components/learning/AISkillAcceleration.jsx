import { useEffect, useState } from "react";
import CourseCarousel from "./CourseCarousel";
import { logProgress } from "../../lib/logProgress";
import { apiFetch } from "../../lib/api";
const PLATFORMS = [
  "All",
  "freeCodeCamp",
  "MIT OpenCourseWare",
  "Coursera",
  "edX",
  "YouTube",
];

export default function AISkillAcceleration({ analysis }) {
  const [query, setQuery] = useState("DSA");
  const [courses, setCourses] = useState([]);
  const [platform, setPlatform] = useState("All");
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (skill) => {
    if (!skill) return;

    setLoading(true);
    try {
      const res = await fetch( `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/recommend-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: skill, // 🔥 ABSOLUTE PRIORITY
          current_skills: analysis?.current_skills || [],
          target_role: "Software Developer",
          readiness: analysis?.ats_score || 60,
        }),
      });

      const data = await res.json();
      const flat =
        data?.recommendations?.flatMap((r) => r.courses) || [];

      setCourses(flat);
    } catch (e) {
      console.error("❌ Course fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load once resume analysis completes
  useEffect(() => {
    fetchCourses(query);
  }, [analysis]);

  // 🔒 HARD FRONTEND FILTER (ACCURACY)
  const filteredCourses = courses.filter((c) => {
    if (platform !== "All" && c.platform !== platform) return false;

    const title = (c.title || "").toLowerCase();
    const q = query.toLowerCase();

    // Strict relevance check
    return (
      title.includes(q) ||
      (q === "dsa" &&
        (title.includes("data structure") ||
          title.includes("algorithm") ||
          title.includes("dsa")))
    );
  });
const markCourseCompleted = async (courseId) => {
  try {
    await apiFetch("/api/course-results/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ courseId }),
    });
  } catch (err) {
    console.error("❌ Failed to mark course completed:", err);
  }
};

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        AI Skill Acceleration
      </h2>

      <p className="text-sm text-slate-400 mb-4">
        Search what you want to learn. Results are strictly based on your query.
      </p>

      {/* SEARCH */}
      <div className="flex gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="DSA, React, Machine Learning..."
          className="flex-1 px-4 py-2 rounded-md bg-black/40 border border-white/10"
        />
        <button
          onClick={() => fetchCourses(query)}
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md"
        >
          Search
        </button>
      </div>

      {/* PLATFORM FILTER */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`text-xs px-3 py-1 rounded-full border
              ${
                platform === p
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                  : "border-white/10 text-slate-400"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* COURSES */}
      {loading ? (
        <p className="text-slate-400 text-sm">
          Loading curated courses…
        </p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No high-quality courses found for this search.
        </p>
      ) : (
       <CourseCarousel
  courses={filteredCourses}
  onComplete={markCourseCompleted}
/>

      )}
    </div>
  );
}
