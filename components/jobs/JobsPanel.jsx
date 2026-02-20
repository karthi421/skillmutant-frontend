import { motion, AnimatePresence } from "framer-motion";
import JobCarousel from "./JobCarousel";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
export default function JobsPanel({ onClose }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!token) return;

    apiFetch("/api/jobs/saved", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setSavedJobs);

    apiFetch("/api/jobs/interviews/feedbacks", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setInterviews);
    }, [token]);

  /* ================= ACTIONS ================= */

  const removeJob = async (job) => {
    await fetch(
       `/api/jobs/saved/${job.job_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setSavedJobs(prev =>
      prev.filter(j => j.job_id !== job.job_id)
    );
  };

  const openFeedback = async (item) => {
    setActiveFeedback(item);

    if (!item.is_read) {
      await fetch(
        `/api/jobs/interviews/feedbacks/${item.id}/read`,
        { 
           method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setInterviews(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, is_read: true } : i
        )
      );
    }
  };
const saveJob = async (job) => {
  const jobId = job.id || `${job.platform}-${job.title}`;
  const exists = savedJobs.some(j => j.job_id === jobId);

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    if (exists) {
      await fetch(
        `/api/jobs/saved/${jobId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      await fetch(
        "/api/jobs/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_id: jobId,
            platform: job.platform,
            title: job.title,
            company: job.company,
            data: job,
          }),
        }
      );
    }
  } catch (e) {
    console.error(e);
  }

  // refresh saved jobs from backend
  const res = await apiFetch("/api/jobs/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  setSavedJobs(data);
};

  /* ================= UI ================= */
return (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* PANEL */}
    <motion.aside
      initial={{ x: 420 }}
      animate={{ x: 0 }}
      exit={{ x: 420 }}
      className="fixed right-0 top-0 z-50 h-screen w-[420px] bg-[#020617] p-6 overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-6">💼 Jobs</h2>

      {/* ===== SAVED JOBS ===== */}
      <div>
        <h3 className="text-lg font-semibold mb-3">⭐ Saved Jobs</h3>

        {savedJobs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No saved jobs yet
          </p>
        ) : (
          <JobCarousel
            jobs={savedJobs}
            onSave={removeJob}
          />

        )}
      </div>

      {/* ===== INTERVIEW FEEDBACK ===== */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">
          🧠 Interview Feedback
        </h3>

        {interviews.length === 0 ? (
          <p className="text-sm text-slate-400">
            No interviews completed yet
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {interviews.map((item) => (
              <div
                key={item.id}
                onClick={() => openFeedback(item)}
                className={`
                  min-w-[280px] p-4 rounded-xl border cursor-pointer
                  transition hover:scale-[1.02]
                  ${
                    item.is_read
                      ? "border-white/10 bg-white/5"
                      : "border-cyan-400/40 bg-cyan-400/5"
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm">
                      {item.company}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.role}
                    </p>
                  </div>

                  <span className="text-cyan-400 font-bold text-sm">
                    {item.score}%
                  </span>
                </div>

                {!item.is_read && (
                  <span className="text-[10px] text-cyan-300">
                    ● New feedback
                  </span>
                )}

                <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                  {item.feedback?.advice?.[0] ||
                    "Click to view detailed feedback"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== FEEDBACK OVERLAY ===== */}
      <AnimatePresence>
        {activeFeedback && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-[90]"
              onClick={() => setActiveFeedback(null)}
            />

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="fixed top-20 left-20 z-[100] w-[420px] max-h-[80vh] overflow-y-auto bg-[#020617] border border-cyan-400/40 rounded-xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold">
                {activeFeedback.company}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {activeFeedback.role}
              </p>

              <p className="text-cyan-400 font-bold mb-4">
                Score: {activeFeedback.score}%
              </p>

              {/* Strengths */}
              <div className="mb-4">
                <p className="font-medium mb-1">Strengths</p>
                <ul className="list-disc list-inside text-sm text-slate-300">
                  {activeFeedback.feedback?.strengths?.map(
                    (s, i) => (
                      <li key={i}>{s}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="mb-4">
                <p className="font-medium mb-1">Weaknesses</p>
                <ul className="list-disc list-inside text-sm text-slate-300">
                  {activeFeedback.feedback?.weaknesses?.map(
                    (w, i) => (
                      <li key={i}>{w}</li>
                    )
                  )}
                </ul>
              </div>

              {/* Advice */}
              <div>
                <p className="font-medium mb-1">Advice</p>
                <ul className="list-disc list-inside text-sm text-slate-300">
                  {activeFeedback.feedback?.advice?.map(
                    (a, i) => (
                      <li key={i}>{a}</li>
                    )
                  )}
                </ul>
              </div>

              <button
                onClick={() => setActiveFeedback(null)}
                className="mt-6 w-full py-2 bg-cyan-500 text-black rounded-md"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.aside>
  </>
);
}