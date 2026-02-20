import { useState } from "react";

export default function ResumePreview({ type, title, accent }) {
  const [open, setOpen] = useState(false);
  const text = localStorage.getItem("lastResumeText") || "";

  return (
    <>
      {/* PREVIEW BOX */}
      <div
        onClick={() => setOpen(true)}
        className={`
          cursor-pointer rounded-lg p-4
          border border-${accent}-500/30
          bg-${accent}-500/5
          h-[260px] overflow-hidden relative
        `}
      >
        <h4 className={`text-sm font-semibold text-${accent}-400 mb-2`}>
          {type === "before" ? "❌" : "✅"} {title}
        </h4>

        <div className="text-xs text-slate-300 whitespace-pre-wrap overflow-hidden h-full">
          {text.slice(0, 900)}
          <span className="block mt-2 text-slate-400">
            Click to expand…
          </span>
        </div>
      </div>

      {/* EXPANDED MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#020617] w-[90%] max-w-4xl h-[80vh] rounded-xl p-6 overflow-y-auto relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className={`text-lg font-semibold text-${accent}-400 mb-4`}>
              {title}
            </h3>

            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {text}
            </pre>

          </div>
        </div>
      )}
    </>
  );
}
