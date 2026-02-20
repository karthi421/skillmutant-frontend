import { useEffect, useState } from "react";

export default function InterviewRoadmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("interviewReadiness");
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) return null;

  const { breakdown, score, verdict } = data;

  const buildSteps = (key, value) => {
    if (value >= 80) return null;

    const map = {
      communication: {
        title: "Improve Communication",
        steps: [
          "Answer in structured format (STAR method)",
          "Avoid fillers (uh, um, basically)",
          "Practice speaking for 60–90 seconds per answer",
        ],
      },
      confidence: {
        title: "Build Confidence",
        steps: [
          "Maintain eye contact with camera",
          "Speak slightly slower",
          "Pause before answering questions",
        ],
      },
      clarity: {
        title: "Improve Clarity",
        steps: [
          "Start with a direct answer",
          "Avoid over-explaining",
          "Use examples only when needed",
        ],
      },
      technical: {
        title: "Strengthen Technical Relevance",
        steps: [
          "Revise core concepts from resume",
          "Prepare 2 strong project explanations",
          "Link answers to real-world impact",
        ],
      },
    };

    return map[key];
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        Interview Improvement Roadmap
      </h2>

      <p className="text-sm text-slate-400 mb-4">
        Personalized steps based on your latest mock interview.
      </p>

      <div className="mb-4">
        <span className="text-cyan-400 font-semibold">
          Readiness Score: {score}%
        </span>
        <p className="text-sm text-slate-400 mt-1">
          {verdict}
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(breakdown).map(([key, value]) => {
          const block = buildSteps(key, value);
          if (!block) return null;

          return (
            <div
              key={key}
              className="border border-white/10 rounded-md p-4"
            >
              <h3 className="font-medium text-cyan-300 mb-2">
                {block.title}
              </h3>

              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                {block.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <p className="text-xs text-slate-400 mt-2">
                Current score: {value}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
