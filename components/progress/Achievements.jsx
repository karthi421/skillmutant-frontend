"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
export default function Achievements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     apiFetch("/api/achievements",  {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));

    const seen = JSON.parse(
  localStorage.getItem("seenAchievements") || "[]"
);

const newlyUnlocked = data.find(
  a => a.unlocked && !seen.includes(a.id)
);

if (newlyUnlocked) {
  setPopupAchievement(newlyUnlocked);
  localStorage.setItem(
    "seenAchievements",
    JSON.stringify([...seen, newlyUnlocked.id])
  );
}
  
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading achievements…</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map(a => (
        <div
          key={a.id}
          className={`rounded-xl p-4 text-center border
            ${
              a.unlocked
                ? "bg-cyan-500/10 border-cyan-400"
                : "bg-black/40 border-white/10 opacity-40"
            }`}
        >
          <div className="text-3xl mb-2">{a.icon}</div>
          <p className="text-sm font-semibold">{a.title}</p>
          <p className="text-xs text-slate-400 mt-1">
            {a.description}
          </p>
        </div>
      ))}
    </div>
  );
}
