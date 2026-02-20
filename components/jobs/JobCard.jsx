export default function JobCard({ job, onSave, saved }) {

  const handleApply = (e) => {
  e.stopPropagation();

  const link = job.url || job.link || job.apply_url;

  if (!link) {
    alert("Application link not available");
    return;
  }

  window.open(link, "_blank", "noopener,noreferrer");
};

  return (
    <div
      className="glass-card p-4 min-w-[260px] border border-white/10 hover:border-cyan-400/40 transition"
    >
      {/* TITLE */}
      <h3 className="text-sm font-semibold mb-1">
        {job.title}
      </h3>

      {/* COMPANY */}
      <p className="text-xs text-slate-400 mb-1">
        {job.company}
      </p>

      {/* PLATFORM BADGE */}
      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 mb-2 inline-block">
        {job.platform}
      </span>

      {/* RELEVANCE */}
      <div className="text-xs text-green-400 mb-1">
        🔥 {job.relevance}% match
      </div>

      {/* AI REASON */}
      <p className="text-xs text-slate-400 mb-3">
        {job.reason}
      </p>

      {/* ACTIONS */}
      <div className="flex justify-between items-center gap-3">
        <button
          onClick={handleApply}
          className="text-xs px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
        >
          Apply
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(job);
          }}
          className="text-xs text-slate-300 hover:text-yellow-400"
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}
