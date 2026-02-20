"use client";
import { useEffect, useState } from "react";
import { logProgress } from "../../lib/logProgress";
import { apiFetch } from "../lib/api";
// after API success

export default function DailyCodingGoal() {
  const [goals, setGoals] = useState([]);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);
   const [loadingId, setLoadingId] = useState(null);  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch("/api/daily-goals", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setGoals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

const markDone = async (problemId) => {
  console.log("CLICKED MARK DONE", problemId);

  await fetch(
    `/api/daily-goals/${problemId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const res = await apiFetch("/api/daily-goals", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  await logProgress(
  "daily_goal",
  "Solved daily coding problem"
);

  const data = await res.json();
  setGoals(data);
};


  return (
    <div className="bg-[#020617]/80 border border-white/10 rounded-xl p-5 mb-10">
      <h3 className="text-base font-semibold text-slate-200 mb-4">
        🎯 Daily Coding Challenges
      </h3>

      <div className="space-y-3">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="flex items-center justify-between gap-4 bg-black/30 border border-white/5 rounded-lg px-4 py-3"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="bg-white rounded p-1 shrink-0">
                <img
                  src={
                    goal.platform === "codechef"
                      ? "/platforms/codechef.svg"
                      : `/platforms/${goal.platform}.png`
                  }
                  alt={goal.platform}
                  className="w-5 h-5 object-contain"
                />
              </div>

              <span className="text-sm font-medium text-slate-200">
                {goal.platform}
              </span>

              <span className="text-slate-600">|</span>

              <p className="text-sm text-white truncate max-w-[220px]">
                {goal.title}
              </p>

              <span className="text-slate-600">|</span>

              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  goal.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-400"
                    : goal.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {goal.difficulty}
              </span>
            </div>

            {/* RIGHT */}
            

 <div className="flex items-center gap-2 shrink-0">
  {!goal.completed ? (
    <>
      <a
        href={goal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-xs font-medium bg-cyan-500 rounded-lg hover:bg-cyan-400"
      >
        Start
      </a>

      <button
        onClick={() => markDone(goal.id)}
        className="px-3 py-1.5 text-xs border border-white/20 rounded-lg hover:bg-white/5"
      >
        Mark as Solved
      </button>
    </>
  ) : (
    <>
      <span className="text-xs text-green-400 font-medium">
        ✓ Completed
      </span>

      <a
        href={goal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-xs border border-white/20 rounded-lg hover:bg-white/5"
      >
        Try Again
      </a>
    </>
  )}


            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
