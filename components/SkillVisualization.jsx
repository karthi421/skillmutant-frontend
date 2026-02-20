import React, { useRef, useState } from "react";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MAX_SKILL_SCORE = 100;

function SkillVisualization({ categories = {}, confidence = {} }) {
  const chartRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const labels = Object.keys(categories || {});

  if (labels.length === 0) {
    return (
      <div className="glass-card md:col-span-2 text-slate-400">
        No skills detected yet.
      </div>
    );
  }

  /* ---------- CALCULATE REAL PERCENTAGES ---------- */
  const rawValues = labels.map((category) => {
    const skills = Array.isArray(categories?.[category])
      ? categories[category]
      : [];

    if (skills.length === 0) return 0;

    const obtained = skills.reduce((sum, skill) => {
  const skillName =
    typeof skill === "string" ? skill : skill.name;

  return sum + (confidence?.[skillName] ?? 0);
}, 0);

    const maxPossible = skills.length * MAX_SKILL_SCORE;

    return Math.round((obtained / maxPossible) * 100);
  });
   console.log("CONF:", confidence);
  console.log("SKILLS:", categories);

  /* ---------- ENSURE CHART RENDERS ---------- */
  const chartValues = rawValues.every((v) => v === 0)
    ? rawValues.map(() => 1)
    : rawValues.map((v) => (v === 0 ? 1 : v));

  const dominantIndex = rawValues.indexOf(Math.max(...rawValues));
  const dominantValue = rawValues[dominantIndex] || 0;

  /* ---------- CHART DATA ---------- */
  const data = {
    labels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: labels.map((label) =>
          label === activeCategory
            ? "rgba(34,211,238,0.95)"
            : "rgba(99,102,241,0.6)"
        ),
        hoverOffset: 22,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5f5",
          boxWidth: 14,
        },
      },
      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#38bdf8",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const category = ctx.label;
            const skills = Array.isArray(categories?.[category])
              ? categories[category]
              : [];
            return skills.length > 0
              ? skills.join(", ")
              : "No skills detected";
          },
        },
      },
    },
  };

  /* ---------- CLICK HANDLER ---------- */
  const handleChartClick = (event) => {
    if (!chartRef.current) return;
    const elements = getElementAtEvent(chartRef.current, event);
    if (elements.length > 0) {
      setActiveCategory(labels[elements[0].index]);
    }
  };

  return (
    <div className="glass-card md:col-span-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyan-400/10 blur-3xl rounded-full" />

      <h3 className="text-xl font-semibold mb-2 relative z-10">
        AI Skill Intelligence
      </h3>

      <p className="text-slate-400 text-sm mb-6 relative z-10">
        Skill strength derived from resume analysis
      </p>

      <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
        {/* ---------- CHART ---------- */}
        <div
          className="relative w-72 h-72 cursor-pointer"
          onClick={handleChartClick}
        >
          <Doughnut ref={chartRef} data={data} options={options} />

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <p className="text-xs text-slate-400">
              Resume Skill Index
            </p>
            <p className="text-4xl font-bold text-cyan-400">
              {dominantValue}%
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Strongest Category
            </p>
          </div>
        </div>

        {/* ---------- DETAILS ---------- */}
        <div className="flex-1 bg-black/30 border border-white/10 rounded-xl p-6 min-h-[180px]">
          {!activeCategory ? (
            <p className="text-slate-400 text-sm">
              Click a category to explore extracted skills.
            </p>
          ) : Array.isArray(categories?.[activeCategory]) &&
            categories[activeCategory].length > 0 ? (
            <>
              <h4 className="text-lg font-semibold mb-3 capitalize">
                {activeCategory.replace("_", " ")}
              </h4>

              <div className="space-y-4">
  {categories[activeCategory].map((skill, index) => {
    const skillName =
      typeof skill === "string" ? skill : skill.name;

    const skillDesc =
      typeof skill === "string"
        ? "Description will be added after AI analysis."
        : skill.description;

    return (
      <div
        key={index}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
      >
        <p className="font-medium text-sm text-cyan-400">
          {skillName}
        </p>

        <p className="mt-1 text-sm text-slate-400 leading-relaxed">
          {skillDesc}
        </p>
      </div>
    );
  })}
</div>

            </>
          ) : (
            <p className="text-slate-400 text-sm">
              No skills detected in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillVisualization;
