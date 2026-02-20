import { apiFetch } from "./api";

const NOTIFIABLE_TYPES = [
  "daily_goal_reminder",
  "daily_goal_completed",
  "achievement_unlocked",
  "streak_milestone",
];
export async function logProgress(type, message, meta = {}) {
  console.log("🔥 logProgress called:", type);

  const token = localStorage.getItem("token");
  console.log("🔐 token:", token);

  if (!token) {
    console.log("❌ NO TOKEN — aborting");
    return;
  }

  if (!NOTIFIABLE_TYPES.includes(type)) {
    console.log("❌ TYPE NOT ALLOWED:", type);
    return;
  }

  try {
    const res = await apiFetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        message,
        meta,
        timestamp: Date.now(),
      }),
    });

    console.log("✅ POST status:", res.status);
  } catch (e) {
    console.error("❌ Notification failed:", e);
  }
}
