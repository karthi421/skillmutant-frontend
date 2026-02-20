import { apiFetch } from "./api";

export async function logActivity(type, title) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await apiFetch("/api/activity/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, title }),
    });
  } catch (err) {
    console.error("Activity log failed:", err);
  }
}
