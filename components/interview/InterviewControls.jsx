import { useState } from "react";

export default function InterviewControls({
  transcript,
  onSubmitAnswer,
  onEndInterview,
  disabled,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!transcript || transcript.trim().length < 5) {
      alert("Please answer properly before submitting.");
      return;
    }

    setSubmitting(true);
    await onSubmitAnswer(transcript);
    setSubmitting(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-white/10 px-6 py-4 flex items-center justify-between z-50">

      {/* Transcript Preview */}
      <div className="flex-1 pr-6">
        <p className="text-xs text-slate-400 mb-1">
          Your Answer (live transcript)
        </p>
        <p className="text-sm text-white line-clamp-2">
          {transcript || "Listening..."}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={disabled || submitting}
          className="px-5 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50"
        >
          {submitting ? "Evaluating..." : "Submit Answer"}
        </button>

        <button
          onClick={onEndInterview}
          className="px-5 py-2 rounded-md bg-red-500/20 border border-red-400 text-red-400 hover:bg-red-500/30"
        >
          End Interview
        </button>
      </div>
    </div>
  );
}
