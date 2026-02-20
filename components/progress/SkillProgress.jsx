import { useMemo} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ================= CONFIG ================= */

const SKILL_THEME = {
  React: "from-cyan-400 to-blue-500",
  JavaScript: "from-yellow-400 to-amber-500",
  CSS: "from-pink-400 to-rose-500",
  Python: "from-green-400 to-emerald-500",
  Default: "from-indigo-500 to-cyan-400",
};

const TYPE_XP = {
  learning: 10,
  course: 25,
  quiz: 10,
  project: 40,
  interview: 50,
  mock: 50,
  daily_goal: 5,
};

const LEVELS = [
  { name: "Beginner", min: 0 },
  { name: "Intermediate", min: 60 },
  { name: "Advanced", min: 150 },
  { name: "Expert", min: 300 },
];

/* ================= HELPERS ================= */

function normalizeSkillName(raw) {
  if (!raw) return null;
  const s = raw.toString().toLowerCase();

  if (s.includes("react")) return "React";
  if (s.includes("javascript") || s === "js") return "JavaScript";
  if (s.includes("css")) return "CSS";
  if (s.includes("python")) return "Python";

  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function getSkillLevel(xp) {
  return (
    [...LEVELS].reverse().find(l => xp >= l.min) ||
    LEVELS[0]
  );
}

/* ================= COMPONENT ================= */

export default function SkillProgress({
  skills = null,
  activities = [],
  
  title = "Skill Progress",
  maxVisible = 6,
  onSkillDataChange,
}) {
  const [expandedSkill, setExpandedSkill] = useState(null);

  /* ================= DATA PROCESSING ================= */

  const skillData = useMemo(() => {
    const map = {};

    // Direct skills object (fallback support)
    if (skills && typeof skills === "object") {
      Object.entries(skills).forEach(([k, v]) => {
        const skill = normalizeSkillName(k);
        if (!skill) return;
        map[skill] = {
          xp: v,
          activities: [],
        };
      });
    }

    // Derive from activities
    activities.forEach(a => {
      const rawSkills =
        a?.meta?.skills ||
        a?.meta?.skill ||
        a?.skill ||
        a?.category;

      const skillList = Array.isArray(rawSkills)
        ? rawSkills
        : rawSkills
        ? [rawSkills]
        : [];

      skillList.forEach(raw => {
        const skill = normalizeSkillName(raw);
        if (!skill) return;

        const xp = TYPE_XP[a.type] || 5;

        if (!map[skill]) {
          map[skill] = {
            xp: 0,
            activities: [],
          };
        }

        map[skill].xp += xp;
        map[skill].activities.push(a);
      });
    });

    return Object.entries(map)
      .map(([skill, data]) => ({
        skill,
        xp: data.xp,
        level: getSkillLevel(data.xp),
        activities: data.activities,
      }))
      .sort((a, b) => b.xp - a.xp);
  }, [skills, activities]);

  /* ================= EMPTY STATE ================= */
   useEffect(() => {
  onSkillDataChange?.(skillData);
}, [skillData]);


  if (!skillData.length) {
    return (
      <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-400">
          No skill activity yet. Start learning, building projects,
          or taking quizzes to grow your skills.
        </p>
      </div>
    );
  }

  const maxXP = Math.max(...skillData.map(s => s.xp));

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#020617]/80 border border-white/10 rounded-2xl p-6 mb-10">
      <h3 className="font-semibold mb-6">
        🧠 {title}
      </h3>

      <div className="space-y-6">
        {skillData.slice(0, maxVisible).map(
          ({ skill, xp, level, activities }) => {
            const percent = Math.round(
              (xp / maxXP) * 100
            );

            const theme =
              SKILL_THEME[skill] || SKILL_THEME.Default;

            const expanded = expandedSkill === skill;

            return (
              <div key={skill}>
                {/* HEADER */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedSkill(
                      expanded ? null : skill
                    )
                  }
                >
                  <div>
                    <p className="font-medium">
                      {skill}
                    </p>
                    <p className="text-xs text-slate-400">
                      {level.name} • {xp} XP
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {percent}%
                  </span>
                </div>

                {/* BAR */}
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full bg-gradient-to-r ${theme}`}
                  />
                </div>

                {/* EXPANDED */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/30 rounded-xl p-4 mt-3"
                    >
                      <p className="text-xs font-semibold mb-2">
                        Related activity
                      </p>

                      <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {activities.slice(0, 20).map(
                          (a, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-300"
                            >
                              • {a.title || a.type}
                            </li>
                          )
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
        )}
      </div>

      {skillData.length > maxVisible && (
        <p className="text-xs text-slate-500 mt-4">
          Showing top {maxVisible} skills
        </p>
      )}
    </div>
  );
}
