import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logActivity} from "../../lib/logActivity";
import { apiFetch } from "../lib/api";
export default function QuizRunner({ topic, questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!questions || questions.length === 0) return null;

  const question = questions[current];

  const handleSelect = (option) => {
    if (locked) return;

    setSelected(option);
    setLocked(true);

    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const submitQuizToBackend = async (finalScore) => {
    try {
      setSubmitting(true);

       await apiFetch("/api/quiz-results/submit", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          topic,
          score: finalScore,
          total: questions.length,
        }),
      });
    } catch (err) {
      console.error("Failed to save quiz result:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setLocked(false);
    } else {
      await submitQuizToBackend(score);
      logActivity("quiz", "Completed Quiz");
      onFinish(score);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-8">

      {/* HEADER */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-500">
          <span className="uppercase tracking-wide">{topic}</span>
          <span>
            Question {current + 1} of {questions.length}
          </span>
        </div>

        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-300"
            animate={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-8"
          >
            <h2 className="text-xl font-semibold leading-relaxed mb-8 text-slate-100">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt) => {
                const isCorrect = opt === question.answer;
                const isSelected = opt === selected;

                let style =
                  "bg-slate-800 border-slate-700 hover:bg-slate-700";

                if (locked) {
                  if (isCorrect)
                    style = "bg-green-900/40 border-green-600 text-green-300";
                  else if (isSelected)
                    style = "bg-red-900/40 border-red-600 text-red-300";
                  else
                    style = "bg-slate-800 border-slate-700 opacity-70";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-3 rounded-md border transition-colors duration-150 ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* EXPLANATION */}
            {locked && (
              <div className="mt-6 text-sm border-t border-slate-700 pt-4 text-slate-400">
                {selected === question.answer ? (
                  <p className="text-green-400">
                    Correct. {question.explanation}
                  </p>
                ) : (
                 <p className="text-red-400">
                    Incorrect.
                    {question.explanation
                      ? ` ${question.explanation}`
                      : " Review this concept and try again."}
                  </p>

                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ACTION BUTTON */}
      {locked && (
        <button
          onClick={handleNext}
          disabled={submitting}
          className="w-full py-3 rounded-md bg-slate-200 text-slate-900 font-medium hover:bg-white transition disabled:opacity-50"
        >
          {submitting
            ? "Saving result..."
            : current + 1 === questions.length
            ? "Submit Quiz"
            : "Next Question"}
        </button>
      )}
    </div>
  );
}
