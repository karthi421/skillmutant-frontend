import { motion, AnimatePresence } from "framer-motion";

export default function AchievementPopup({ achievement, onClose }) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 bg-black/90 border border-cyan-400/40 rounded-2xl p-5 shadow-xl w-[280px]"
      >
        <p className="text-sm text-slate-400 mb-1">
          🎉 Achievement Unlocked
        </p>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{achievement.icon}</span>
          <div>
            <p className="font-semibold text-cyan-400">
              {achievement.title}
            </p>
            <p className="text-xs text-slate-400">
              +{achievement.xp} XP earned
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
