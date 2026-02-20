import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import ProgressNotifications from "./progress/ProgressNotifications";

function StudentHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  apiFetch("/api/notifications/unread-count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(data => {
      setUnreadCount(data.count || 0);
    })
    .catch(err => {
      console.error("Failed to fetch unread count:", err);
    });
}, []);
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-slate-400 text-sm">
          AI Resume Intelligence & Skill Analysis
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowNotifications(true)}
          className="relative px-4 py-2 bg-slate-800
            border border-slate-700 rounded-lg text-sm"
        >
          👨‍🎓 Student

          {/* ✅ ONLY SHOW WHEN ACTUALLY UNREAD */}
          {unreadCount > 0 && (
            <span
              className="
                absolute -top-1 -right-1
                bg-red-500 text-white
                text-[10px] font-bold
                w-5 h-5 rounded-full
                flex items-center justify-center
              "
            >
              {unreadCount}
            </span>
          )}
        </button>
          
        <ProgressNotifications
          open={showNotifications}
          onClose={() => setShowNotifications(false)}
          onUnreadChange={setUnreadCount}
        />
      </div>
    </div>
  );
}

export default StudentHeader;


//👨‍🎓 Student
