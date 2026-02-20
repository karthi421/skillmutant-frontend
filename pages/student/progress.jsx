"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import MiniCalendar from "../../components/progress/MiniCalendar.jsx";
import StudentSidebar from "../../components/student-dashboard/StudentSidebar";
import AchievementPopup from "../../components/progress/AchievementPopup";
import WeeklyActivity from "../../components/progress/WeeklyActivity";
import Achievements from "../../components/progress/Achievements";
import SkillProgress from "../../components/progress/SkillProgress";
import ProgressSkeleton from "../../components/progress/ProgressSkeleton";
import ProgressEmptyState from "../../components/progress/ProgressEmptyState";
import DailyCodingGoal from "../../components/progress/DailyCodingGoal";
import MonthlyInsights from "../../components/progress/MonthlyInsights";
import ChatWidget from "../../components/chat/ChatWidget";

/* ================= HELPERS ================= */

function normalizeDatesLocal(dates = []) {
  return dates.map(d => {
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
}

function calculateStreak(dates = []) {
  if (!dates.length) return 0;

  const set = new Set(dates);
  let streak = 0;

  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;

    if (set.has(key)) streak++;
    else break;
  }

  return streak;
}

/* ================= COUNT UP ================= */

function CountUp({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{display}</span>;
}

/* ================= ACHIEVEMENTS ================= */

function calculateAchievements(activities = [], streak = 0) {
  const unlocked = [];

  if (activities.filter(a => a.type === "daily_goal").length >= 50)
    unlocked.push("solve_50");

  if (activities.some(a => a.type === "course"))
    unlocked.push("course_completed");

  if (activities.filter(a => a.type === "quiz").length >= 5)
    unlocked.push("quiz_master");

  if (activities.some(a => a.type === "interview"))
    unlocked.push("mock_cracker");

  if (streak >= 30)
    unlocked.push("streak_30");

  return unlocked;
}

/* ================= XP + LEVEL ================= */

const XP_RULES = {
  resume: 50,
  course: 20,
  learning: 20,
  project: 40,
  mock: 60,
  interview: 60,
  login: 5,
  quiz: 15,
  daily_goal: 10,
};

const XP_PER_LEVEL = 200;

function calculateXP(activities = []) {
  return activities.reduce((sum, a) => {
    return sum + (XP_RULES[a.type] || 0);
  }, 0);
}

function calculateLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function xpToNextLevel(xp) {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

/* ================= PAGE ================= */

export default function ProgressPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [weeklyActivities, setWeeklyActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [popupAchievement, setPopupAchievement] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);

 
  /* ================= DERIVED ================= */

  const streak = useMemo(
    () => calculateStreak(user?.login_dates || []),
    [user?.login_dates]
  );

  const totalXP = useMemo(
    () => calculateXP(allActivities),
    [allActivities]
  );

  const level = useMemo(
    () => calculateLevel(totalXP),
    [totalXP]
  );

  const nextLevelXP = useMemo(
    () => xpToNextLevel(totalXP),
    [totalXP]
  );


  /* ================= FETCH USER ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUser({
          ...data,
          login_dates: normalizeDatesLocal(data.login_dates || []),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("http://localhost:5000/api/progress/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAnalytics(data || null))
      .catch(() => {});
  }, []);

/* ================= FETCH ACTIVITIES (FROM activity_log) ================= */

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:5000/api/activity/all", {

    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      const activities = data.map(a => ({
        type: a.type,
        title: a.title,
        timestamp: a.created_at,
        meta: typeof a.meta === "string"
          ? JSON.parse(a.meta)
          : a.meta || {},
 // optional future expansion
      }));

      const sorted = [...activities].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setWeeklyActivities(
        sorted.filter(a =>
          new Date(a.timestamp) >= new Date(Date.now() - 7 * 86400000)
        )
      );

      setAllActivities(sorted);
      setActivitiesLoaded(true);
    })
    .catch(() => setActivitiesLoaded(true));
}, []);

  /* ================= ACHIEVEMENT POPUP ================= */

  useEffect(() => {
    if (!allActivities.length) return;

    const unlocked = calculateAchievements(allActivities, streak);
    const last = unlocked[unlocked.length - 1];

    if (last && popupAchievement !== last) {
      setPopupAchievement(last);
    }
  }, [allActivities, streak]);

  /* ================= GUARDS ================= */

  if (loading) return <ProgressSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load progress
      </div>
    );
  }

  if (activitiesLoaded && allActivities.length === 0) {
    return <ProgressEmptyState />;
  }

  const lastActivity = weeklyActivities[0];
  const unlockedAchievements = calculateAchievements(allActivities, streak);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white py-12 flex justify-center">
      {isSidebarOpen && (
        <StudentSidebar onClose={() => setIsSidebarOpen(false)} />
      )}

      <div className="w-full max-w-4xl px-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 hover:text-cyan-400 mb-6"
        >
          ← Back
        </button>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-10"
        >
          Progress
        </motion.h1>

        {lastActivity && (
          <div className="mb-10 bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-4">
            <p className="text-sm text-slate-300">🎯 Next recommended action</p>
            <p className="font-semibold text-cyan-400 mt-1">
              Continue from: {lastActivity.title}
            </p>
          </div>
        )}

        {/* LEVEL + XP */}
        <div className="mb-10 bg-[#020617]/80 border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-slate-400">Your Level</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-emerald-400">
              Level {level}
            </p>
            <p className="text-sm text-slate-400">
              {nextLevelXP} XP to next level
            </p>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP % XP_PER_LEVEL) / 2}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-emerald-400"
            />
          </div>
        </div>

        <DailyCodingGoal />

        {/* CALENDAR + STREAK */}
        <div className="flex flex-wrap gap-10 mb-12">
          <MiniCalendar activeDates={user.login_dates} />

          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6 max-w-[320px]"
          >
            <p className="text-sm text-slate-400">Current Streak</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl font-bold text-cyan-400">
                <CountUp value={streak} />
              </span>
              <span className="text-base text-slate-300">days</span>
              <span className="text-2xl">🔥</span>
            </div>
          </motion.div>
        </div>

<SkillProgress
  activities={allActivities}
  onSkillSelect={setActiveSkill}
  
/>

<WeeklyActivity
  activities={weeklyActivities}
  activeSkill={activeSkill}
  streak={streak}
/>


       <MonthlyInsights
  analytics={analytics}
  streak={streak}
  lastLoginDate={user?.login_dates?.slice(-1)[0]}
/>

        {/* ACHIEVEMENTS */}
        <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">🏅 Achievements</h3>

          <AchievementPopup
            achievement={popupAchievement}
            onClose={() => setPopupAchievement(null)}
          />

          <Achievements
            user={user}
            streak={streak}
            unlocked={unlockedAchievements}
          />
        </div>

       
        <ChatWidget
  streak={streak}
  weeklyActivities={weeklyActivities}
  skills={allActivities
    .filter(a => a.meta?.skill)
    .map(a => ({ skill: a.meta.skill }))}
 />


      </div>
    </div>
  );
}

/* ================= SMALL ================= */

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-cyan-400">
        <CountUp value={value ?? 0} />
      </p>
    </div>
  );
}
