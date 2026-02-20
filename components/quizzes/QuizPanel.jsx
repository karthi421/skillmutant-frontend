"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import QuizRunner from "./QuizRunner";
import QuizResults from "./QuizResults";

export default function QuizPanel({ onClose }) {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [mode, setMode] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setQuestions([]);
    setMode("idle");

    try {
      const res = await fetch("http://127.0.0.1:8000/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: 5 }),
      });

      const data = await res.json();

      if (!Array.isArray(data.questions) || data.questions.length < 5) {
        return;
      }

      setQuestions(data.questions);
      setMode("quiz");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        exit={{ x: 500 }}
        transition={{ duration: 0.2 }}
        className="fixed right-0 top-0 z-50 h-screen w-[480px] bg-slate-950 border-l border-slate-800 flex flex-col"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-100">
            Assessment
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* TOPIC SECTION */}
        <div className="px-6 py-5 border-b border-slate-800 space-y-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., Java, React)"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 text-sm focus:outline-none focus:border-slate-500"
          />

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="w-full py-2 bg-slate-200 text-slate-900 text-sm font-medium rounded-md hover:bg-white transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="px-6 pt-4 border-b border-slate-800">
          <div className="flex gap-5 text-sm">
            <button
              onClick={() => setMode("quiz")}
              disabled={mode === "idle"}
              className={`pb-2 border-b-2 transition ${
                mode === "quiz"
                  ? "border-slate-300 text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Quiz
            </button>

            <button
              onClick={() => setMode("results")}
              className={`pb-2 border-b-2 transition ${
                mode === "results"
                  ? "border-slate-300 text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Results
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {mode === "quiz" && (
            <QuizRunner
              topic={topic}
              questions={questions}
              onFinish={(score) => {
                const result = {
                  topic,
                  score,
                  total: questions.length,
                  date: Date.now(),
                };
                setResultData(result);
                setMode("results");
              }}
            />
          )}

          {mode === "results" && (
            <QuizResults
              result={resultData}
              onRetry={generateQuiz}
            />
          )}

          {mode === "idle" && (
            <p className="text-sm text-slate-500">
              Generate a quiz to begin.
            </p>
          )}
        </div>
      </motion.aside>
    </>
  );
}
