import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

/* --------------------------------------------
   Animated count-up number (isolated & reusable)
--------------------------------------------- */
function CountUp({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate(v) {
        ref.current.textContent = Math.round(v);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>0</span>;
}

/* --------------------------------------------
   ATS Score Component
--------------------------------------------- */
export default function ATSScore({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(score, 100));

  const getStatus = () => {
    if (safeScore >= 80)
      return {
        label: "Excellent ATS compatibility",
        color: "text-green-400",
        bar: "bg-green-500",
      };
    if (safeScore >= 60)
      return {
        label: "Good, but improvable",
        color: "text-yellow-400",
        bar: "bg-yellow-500",
      };
    return {
      label: "Low ATS compatibility",
      color: "text-red-400",
      bar: "bg-red-500",
    };
  };

  const status = getStatus();

  return (
    <div className="mb-4">
      {/* SCORE ROW */}
      <div className="flex items-center gap-5 mb-3">
        <div className={`text-4xl font-bold ${status.color}`}>
          <CountUp value={safeScore} />%
        </div>

        <div className="text-sm">
          <p className={`font-medium ${status.color}`}>
            {status.label}
          </p>
          <p className="text-slate-400 text-xs">
            ATS score reflects resume structure & keyword match
          </p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-2 ${status.bar}`}
        />
      </div>
    </div>
  );
}
