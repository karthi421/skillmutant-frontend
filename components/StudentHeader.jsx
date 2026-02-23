/*import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
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
*/

// ... (keep your imports same)

function StudentHeader() {
  // ... (keep your state and useEffect same)

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-slate-800 pb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-1 bg-cyan-500 rounded-full"></div> {/* Accent line */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Student Dashboard
          </h1>
        </div>
        <p className="text-slate-400 text-sm font-medium">
          Personalized <span className="text-cyan-400">AI Intelligence</span> & Skill Gap Analysis
        </p>
      </div>

      <div className="relative group">
        <button
          onClick={() => setShowNotifications(true)}
          className="flex items-center gap-3 px-5 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-lg">🎓</span>
          <span>Student Profile</span>

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                {unreadCount}
              </span>
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