"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function QuizResults({ result, onRetry }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/quiz-results/my-results",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setHistory(data.results || []);
    } catch (err) {
      console.error("Failed to fetch quiz history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= LATEST RESULT ================= */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-lg"
        >
          {(() => {
            const percentage = Math.round(
              (result.score / result.total) * 100
            );

            let performance = "💪 Keep Practicing!";
            let color = "text-yellow-400";

            if (percentage >= 80) {
              performance = "🔥 Excellent Performance!";
              color = "text-green-400";
            } else if (percentage >= 60) {
              performance = "👍 Good Job!";
              color = "text-cyan-400";
            }

            return (
              <>
                <h3 className={`text-xl font-bold ${color}`}>
                  {performance}
                </h3>

                <p className="text-4xl font-bold mt-3">
                  {result.score} / {result.total}
                </p>

                <p className="text-slate-400 mt-1">
                  {percentage}% Accuracy
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Topic:{" "}
                  <span className="text-cyan-400 font-medium">
                    {result.topic}
                  </span>
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {new Date(result.date).toLocaleString()}
                </p>
              </>
            );
          })()}
        </motion.div>
      )}

      {/* RETAKE BUTTON */}
      {result && (
        <button
          onClick={onRetry}
          className="w-full bg-cyan-500 text-black py-2 rounded-xl hover:bg-cyan-400 transition"
        >
          🔄 Retake Quiz
        </button>
      )}

      {/* ================= HISTORY SECTION ================= */}
      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-3">
          📜 Quiz History
        </h4>

        {loading ? (
          <p className="text-sm text-slate-500">
            Loading quiz history...
          </p>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500">
            No past attempts yet.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => {
              const percent = Math.round(
                (item.score / item.total) * 100
              );

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <p className="text-sm text-cyan-400 font-medium">
                    {item.topic}
                  </p>

                  <p className="text-sm text-slate-300">
                    Score: {item.score}/{item.total} ({percent}%)
                  </p>

                  <p className="text-xs text-slate-500">
                    {new Date(item.attempted_at).toLocaleString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
