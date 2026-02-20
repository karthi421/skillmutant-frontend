import { motion } from "framer-motion";

/* ================= HELPERS ================= */

function daysBetween(a, b) {
  const diff = a.setHours(0,0,0,0) - b.setHours(0,0,0,0);
  return Math.round(diff / 86400000);
}

function generatePredictiveInsights({
  analytics,
  streak = 0,
  lastLoginDate,
}) {
  const insights = [];
  const today = new Date();

  /* 🔥 STREAK RISK */
  if (streak > 0 && lastLoginDate) {
    const last = new Date(lastLoginDate);
    const gap = daysBetween(today, last);

    if (gap === 1) {
      insights.push({
        type: "warning",
        message: `Your ${streak}-day streak will break tomorrow if you stay inactive.`,
      });
    }
  }

  /* 🚀 MOMENTUM PUSH */
  if (
    analytics?.total_activities &&
    analytics?.previous_total_activities
  ) {
    const diff =
      analytics.previous_total_activities -
      analytics.total_activities;

    if (diff > 0 && diff <= 3) {
      insights.push({
        type: "opportunity",
        message: `You are just ${diff} activities away from beating last month.`,
      });
    }
  }

  /* 🎯 DEFAULT ACTION */
  if (insights.length === 0) {
    insights.push({
      type: "suggestion",
      message:
        "A small activity today will help you maintain consistency.",
    });
  }

  return insights;
}

/* ================= COMPONENT ================= */

export default function MonthlyInsights({
  analytics = null,
  streak = 0,
  lastLoginDate = null,
  title = "📈 Monthly Insights",
  periodLabel = "Last 30 days",
}) {
  const hasData = analytics && typeof analytics === "object";

  const predictiveInsights = hasData
    ? generatePredictiveInsights({
        analytics,
        streak,
        lastLoginDate,
      })
    : [];

  return (
    <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6 mb-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {title}
        </h3>
        <span className="text-xs text-slate-500">
          {periodLabel}
        </span>
      </div>

      {/* KPIs */}
      {!hasData ? (
        <div className="text-sm text-slate-400 flex flex-col items-center py-10">
          <span className="text-2xl mb-2">📊</span>
          Analytics not available yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InsightStat
            icon="🔥"
            label="Login Days"
            value={analytics.total_login_days}
            hint="Days active this month"
          />
          <InsightStat
            icon="⚡"
            label="Total Activities"
            value={analytics.total_activities}
            hint="All learning actions"
          />
          <InsightStat
            icon="📆"
            label="Most Active Week"
            value={
              analytics.most_active_week
                ? `Week ${analytics.most_active_week}`
                : "—"
            }
            hint="Peak productivity"
          />
        </div>
      )}

      {/* 🔮 PREDICTIVE INSIGHTS */}
      {predictiveInsights.length > 0 && (
        <div className="space-y-3">
          {predictiveInsights.map((i, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-4 border ${
                i.type === "warning"
                  ? "bg-red-500/10 border-red-400/20 text-red-300"
                  : i.type === "opportunity"
                  ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
                  : "bg-cyan-500/10 border-cyan-400/20 text-cyan-300"
              }`}
            >
              <p className="text-sm">
                {i.message}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SMALL ================= */

function InsightStat({ icon, label, value, hint }) {
  const safe =
    value === null || value === undefined ? "—" : value;

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-400">
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>

      <p className="text-3xl font-bold text-cyan-400">
        {safe}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        {hint}
      </p>
    </div>
  );
}
