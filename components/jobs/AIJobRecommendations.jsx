import { useEffect, useState } from "react";
import JobCarousel from "./JobCarousel";
import { apiFetch } from "../../lib/api";
export default function AIJobRecommendations({ analysis }) {
  const [jobs, setJobs] = useState([]);
 const [savedJobs, setSavedJobs] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [resolvedAnalysis, setResolvedAnalysis] = useState(analysis || null);


  useEffect(() => {
  if (typeof window !== "undefined") {
    const stored = JSON.parse(
      localStorage.getItem("savedJobs") || "[]"
    );
    setSavedJobs(stored);
  }
}, []);
useEffect(() => {
  if (analysis) {
    setResolvedAnalysis(analysis);
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) return;

apiFetch("/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(user => {
    setResolvedAnalysis({
      current_skills: user.skills || [],
    });
  })
  .catch(() => {});
}, [analysis]);


  /* ================= FETCH AI JOBS (UNCHANGED) ================= */
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(  `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/recommend-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: analysis.current_skills || [],
          skills: resolvedAnalysis?.current_skills || [],

          target_role: "Software Engineer",
        }),
      });

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= NEW: LOAD SAVED JOBS FROM BACKEND ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

   apiFetch("/api/jobs/saved", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(data => {
        if (Array.isArray(data)) {
          setSavedJobs(data);
          localStorage.setItem("savedJobs", JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
  if (resolvedAnalysis) fetchJobs();
}, [resolvedAnalysis]);

  /* ================= UPDATED: SAVE JOB (BACKEND + LOCAL) ================= */
  const saveJob = async (job) => {
  const jobId = job.id || `${job.platform}-${job.title}`;
  const exists = savedJobs.some(j => j.job_id === jobId);

  const updated = exists
  ? savedJobs.filter(j => j.job_id !== jobId)
  : [...savedJobs, { ...job, job_id: jobId }];


  // 🔁 Update UI + localStorage
  setSavedJobs(updated);
  localStorage.setItem("savedJobs", JSON.stringify(updated));

  const token = localStorage.getItem("token");
  if (!token) return;

  // 🔁 Backend sync
  try {
   await fetch(
  exists
     ? `/api/jobs/saved/${jobId}`
    : "/api/jobs/save",
  {
    method: exists ? "DELETE" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: exists
      ? undefined
      : JSON.stringify({
          job_id: jobId,
          platform: job.platform,
          title: job.title,
          company: job.company,
          data: job,
        }),
  }
);

  } catch (e) {
    console.error(e);
  }
};

  /* ================= EFFECT (UNCHANGED) ================= */
  useEffect(() => {
    if (analysis) fetchJobs();
  }, [analysis]);

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        AI Job Recommendations
      </h2>

      <p className="text-sm text-slate-400 mb-4">
        Jobs ranked using your resume & market relevance.
      </p>

      {loading ? (
        <p className="text-sm text-slate-400">Loading jobs…</p>
      ) : (
        <JobCarousel
          jobs={jobs}
          onSave={saveJob}
          savedJobs={savedJobs}
        />
      )}
    </div>
  );
}
