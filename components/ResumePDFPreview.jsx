import { useState } from "react";

export default function ResumePDFPreview({
  title,
  accent,
  description,
  checklist = [],
  mode = "before", // "before" | "after"
}) {
  const [open, setOpen] = useState(false);
  const pdfURL = localStorage.getItem("lastResumePDF");

  if (!pdfURL) {
    return (
      <div className="text-slate-400">
        No resume uploaded yet.
      </div>
    );
  }

  // ❌ Issues for BEFORE | ✅ All passed for AFTER
  const overlays =
    mode === "before"
      ? checklist.filter((i) => !i.status)
      : checklist.map((i) => ({ ...i, status: true }));

  return (
    <>
      {/* ===== MEDIUM PREVIEW ===== */}
      <div
        onClick={() => setOpen(true)}
        className={`
          cursor-pointer relative rounded-lg p-3
          border border-${accent}-500/30
          bg-${accent}-500/5
          h-[260px] overflow-hidden
        `}
      >
        <h4 className={`text-sm font-semibold text-${accent}-400 mb-2`}>
          {title}
        </h4>

        {/* PDF */}
        <object
          data={pdfURL}
          type="application/pdf"
          className="w-full h-full rounded-md pointer-events-none"
        />

        {/* OVERLAY TAGS */}
        <div className="absolute top-12 left-3 right-3 space-y-2">
          {overlays.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className={`
                text-xs px-2 py-1 rounded
                ${
                  mode === "before"
                    ? "bg-red-500/90 text-white"
                    : "bg-green-500/90 text-white"
                }
              `}
            >
              {mode === "before" ? "❌" : "✅"} {item.item}
            </div>
          ))}
        </div>

        <p className="absolute bottom-2 right-2 text-xs text-slate-400">
          Click to expand
        </p>
      </div>

      {/* ===== FULLSCREEN MODAL ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#020617] w-[90%] max-w-5xl h-[85vh] rounded-xl p-4 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className={`text-lg font-semibold text-${accent}-400 mb-2`}>
              {title}
            </h3>

            {description && (
              <p className="text-xs text-slate-400 mb-3">
                {description}
              </p>
            )}

            <div className="relative h-full">
              <object
                data={pdfURL}
                type="application/pdf"
                className="w-full h-full rounded-md"
              />

              {/* BIG OVERLAYS */}
              <div className="absolute top-6 left-6 space-y-2 max-w-xs">
                {overlays.map((item, i) => (
                  <div
                    key={i}
                    className={`
                      text-xs px-3 py-2 rounded shadow
                      ${
                        mode === "before"
                          ? "bg-red-500/90 text-white"
                          : "bg-green-500/90 text-white"
                      }
                    `}
                  >
                    {mode === "before" ? "❌ Issue:" : "✅ Fixed:"}{" "}
                    {item.item}
                    {mode === "before" && item.fix && (
                      <div className="mt-1 text-[10px] opacity-90">
                        Fix: {item.fix}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
