import { useEffect, useState } from "react";
import { logProgress } from "../../lib/logProgress";

export default function CourseCard({ course, onComplete }) {
  const [completed, setCompleted] = useState(false);

  // Load completion state on mount
  useEffect(() => {
    const completedCourses =
      JSON.parse(localStorage.getItem("completed_courses")) || [];

    if (completedCourses.includes(course.id)) {
      setCompleted(true);
    }
  }, [course.id]);

  const markCompleted = (e) => {
    e.stopPropagation();

    if (completed) return;

    // 1️⃣ Log completion (backend → achievements)
    logProgress("course", "Completed course", {
      courseId: course.id,
      skill: course.title,
      platform: course.platform,
    });

    // 2️⃣ Update UI state
    setCompleted(true);

    // 3️⃣ Persist locally (instant UX)
    const completedCourses =
      JSON.parse(localStorage.getItem("completed_courses")) || [];

    localStorage.setItem(
      "completed_courses",
      JSON.stringify([...new Set([...completedCourses, course.id])])
    );

    // 4️⃣ Optional callback (parent refresh)
    if (onComplete) onComplete(course);
  };

  return (
    <div
      className="min-w-[260px] rounded-xl bg-black/40 
                 border border-white/10 hover:border-cyan-400/40 
                 transition-all duration-200 p-4"
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-36 w-full object-contain bg-black rounded-md mb-3"
        loading="lazy"
      />

      <h4 className="text-sm font-semibold line-clamp-2">
        {course.title}
      </h4>

      <p className="text-xs text-slate-400 mt-1">
        {course.creator || course.platform}
      </p>

      <span className="inline-block mt-2 text-[11px] px-2 py-0.5 
                       rounded-full bg-cyan-500/10 text-cyan-400">
        {course.platform}
      </span>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        {/* START COURSE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(course.url, "_blank");
          }}
          className="flex-1 text-xs py-1.5 rounded 
                     bg-cyan-500 text-black hover:bg-cyan-400"
        >
          Start
        </button>

        {/* MARK COMPLETED */}
        <button
          disabled={completed}
          onClick={markCompleted}
          className={`flex-1 text-xs py-1.5 rounded 
            ${
              completed
                ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                : "border border-white/20 text-slate-300 hover:bg-white/5"
            }`}
        >
          {completed ? "Completed ✅" : "Mark Completed"}
        </button>
      </div>
    </div>
  );
}
