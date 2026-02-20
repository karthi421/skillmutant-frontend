import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../lib/api";
const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export default function ProgressNotifications({ open, onClose, onUnreadChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    apiFetch("/api/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
  const todayItems = (data || []).filter(n =>
    isToday(n.created_at || n.createdAt)
  );

  setItems(todayItems);

  const unread = todayItems.filter(n => !n.is_read).length;
  onUnreadChange?.(unread);

  // ✅ MARK AS READ
  apiFetch("/api/notifications/mark-read", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => {
    onUnreadChange?.(0);
  });
})

      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          <motion.div
            className="absolute right-0 mt-2 w-96 bg-[#020617]
              border border-white/10 rounded-xl z-50 p-4"
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">🔔 Today</h3>
              <button onClick={onClose}>✕</button>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-400">
                No notifications for today.
              </p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {items.map(n => (
                  <li
                    key={n.id}
                    className="bg-white/5 rounded-lg p-3 text-sm"
                  >
                    <p>{n.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(n.created_at || n.createdAt).toLocaleTimeString()
}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
