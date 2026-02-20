import { useState } from "react";

import { logProgress } from "../lib/logProgress";

export default function ResumeCoreCard({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("target_role", "Frontend Developer");

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
     onAnalyze({
  ...data,

  // ✅ normalize skills
  skills:
    data.skills ||
    data.extracted_skills ||
    data.matched_skills ||
    [],

  // ✅ normalize role
  best_role:
    data.best_role ||
    data.predicted_role ||
    data.target_role ||
    "Frontend Developer",
});
logProgress(
  "resume",
  "Resume analyzed successfully"
);

// ✅ Store actual uploaded resume PDF
const pdfURL = URL.createObjectURL(file);
localStorage.setItem("lastResumePDF", pdfURL);

// 🔹 Save resume version for comparison
const history =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("resumeHistory")) || []
    : [];

history.push({
  timestamp: Date.now(),
  ats_score: data.ats_score,
  ats_checklist: data.ats_checklist,
  skills: data.current_skills || [],
  confidence: data.confidence,
  categories: data.categories || {},
  
});

localStorage.setItem(
  "resumeHistory",
  JSON.stringify(history.slice(-5)) // keep last 5
);
localStorage.setItem(
  "lastResumeText",
  data.resume_text || ""
);


logProgress(
  "resume",
  "Analyzed resume using AI"
);


    } catch (err) {
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-xl mx-auto text-center p-6">
      <h2 className="text-2xl font-bold mb-3">
        AI Resume Intelligence
      </h2>

      <p className="text-slate-400 text-sm mb-6">
        Upload your resume to unlock AI-powered insights.
      </p>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block mx-auto text-sm"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-medium disabled:opacity-60"
      >
        {loading ? "Analyzing Resume..." : "Upload & Analyze"}
      </button>
    </div>
  );

  console.log("ANALYSIS RESPONSE:", data);
console.log("CONFIDENCE:", data.confidence);

}
