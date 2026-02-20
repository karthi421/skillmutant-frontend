import { motion } from "framer-motion";

export default function AchievementGrid({ achievements = [] }) {
  if (!achievements.length) {
    return (
      <p className="text-sm text-slate-400">
        No achievements unlocked yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {achievements.map((a, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
        >
          <div className="text-3xl mb-2">{a.icon}</div>
          <p className="text-sm font-medium">{a.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
