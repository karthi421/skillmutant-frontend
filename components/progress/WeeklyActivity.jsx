import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= CONFIG ================= */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SKILL_COLORS = {
  React: "from-cyan-400 to-blue-500",
  JavaScript: "from-yellow-400 to-amber-500",
  CSS: "from-pink-400 to-rose-500",
  Python: "from-green-400 to-emerald-500",
  Default: "from-indigo-500 to-cyan-400",
};

function getWeekIndex(date) {
  return (date.getDay() + 6) % 7; // Monday = 0
}

function startOfWeek(date) {
  const d = new Date(date);
  const diff = d.getDate() - getWeekIndex(d);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ================= COMPONENT ================= */

export default function WeeklyActivity({
  activities = [],
  streak = 0,
  title = "📊 Activity",
}) {
  const [mode, setMode] = useState("week"); // week | month
  const [expandedDay, setExpandedDay] = useState(null);

  const todayIdx = getWeekIndex(new Date());
  const weekStart = startOfWeek(new Date());

  /* ================= DATA PROCESSING ================= */

  const data = useMemo(() => {
    const buckets =
      mode === "week"
        ? Array.from({ length: 7 }, () => [])
        : Array.from({ length: 5 }, () => []); // weeks in month

    activities.forEach(a => {
      if (!a?.timestamp) return;

      const d = new Date(a.timestamp);
      if (isNaN(d)) return;

      if (mode === "week") {
        if (d >= weekStart) {
          const idx = getWeekIndex(d);
          buckets[idx].push(a);
        }
      } else {
        const diff = Math.floor(
          (d - startOfWeek(new Date(d.getFullYear(), d.getMonth(), 1))) /
            (7 * 86400000)
        );
        if (diff >= 0 && diff < 5) {
          buckets[diff].push(a);
        }
      }
    });

    return buckets;
  }, [activities, mode]);

  const max = Math.max(1, ...data.map(d => d.length));

  /* ================= HELPERS ================= */

  function getBarColor(dayActivities) {
    const skills = [
      ...new Set(
        dayActivities.map(a => a.meta?.skill).filter(Boolean)
      ),
    ];

    if (skills.length === 1) {
      return (
        SKILL_COLORS[skills[0]] || SKILL_COLORS.Default
      );
    }

    return SKILL_COLORS.Default;
  }

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6 mb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">{title}</h3>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setMode("week")}
            className={`px-3 py-1 rounded ${
              mode === "week"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setMode("month")}
            className={`px-3 py-1 rounded ${
              mode === "month"
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* BARS */}
      <div className="flex items-end gap-4 h-36 mb-6">
        {data.map((dayActivities, i) => {
          const value = dayActivities.length;
          const height = Math.max(
            8,
            (value / max) * 120
          );

          const isToday =
            mode === "week" &&
            i === todayIdx &&
            streak > 0;

          return (
            <div
              key={i}
              className="flex flex-col items-center flex-1 cursor-pointer"
              onClick={() =>
                setExpandedDay(
                  expandedDay === i ? null : i
                )
              }
            >
              {/* STREAK CONNECTOR */}
              {isToday && (
                <div className="w-1 h-4 bg-cyan-400 rounded-full mb-1 animate-pulse" />
              )}

              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 0.4 }}
                className={`w-7 rounded-md bg-gradient-to-t ${getBarColor(
                  dayActivities
                )} ${
                  isToday
                    ? "ring-2 ring-cyan-400"
                    : ""
                }`}
              />

              <span className="text-xs mt-2 text-slate-400">
                {mode === "week"
                  ? DAYS[i]
                  : `W${i + 1}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* EXPANDED LIST (VIRTUALIZED FEEL) */}
      <AnimatePresence>
        {expandedDay !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/30 rounded-xl p-4 max-h-48 overflow-y-auto"
          >
            <p className="text-sm font-semibold mb-3">
              {mode === "week"
                ? DAYS[expandedDay]
                : `Week ${expandedDay + 1}`}{" "}
              details
            </p>

            {data[expandedDay].length === 0 ? (
              <p className="text-xs text-slate-400">
                No activity here
              </p>
            ) : (
              <ul className="space-y-2">
                {data[expandedDay]
                  .slice(0, 20)
                  .map((a, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-300 flex gap-2"
                    >
                      <span>•</span>
                      {a.title || a.type}
                    </li>
                  ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
