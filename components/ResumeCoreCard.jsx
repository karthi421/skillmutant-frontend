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

      const res = await fetch(`${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/analyze-resume`, {
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
  <div className="flex flex-col items-center mt-20 px-6">

    {/* HERO */}
    <div className="text-center max-w-2xl">
      <h1 className="text-5xl font-bold tracking-tight">
        SkillMutant
      </h1>

      <p className="mt-6 text-lg text-slate-400 leading-relaxed">
        Upload your resume and discover your current skills and future skill
        recommendations using AI-powered analysis.
      </p>
    </div>

    {/* CARD */}
    <div className="mt-14 w-full max-w-2xl 
                    bg-[#0B1220] border border-white/10 
                    rounded-2xl p-10 shadow-2xl backdrop-blur-xl">

      <p className="text-xs tracking-[0.3em] text-cyan-400 mb-8">
        RESUME UPLOAD
      </p>

      {/* FILE SELECTOR */}
      <div className="flex items-center gap-4 mb-10">
        <label className="
          bg-cyan-500 hover:bg-cyan-400 
          text-black font-medium px-6 py-2 
          rounded-full cursor-pointer transition
        ">
          Choose File
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <span className="text-slate-400 text-sm truncate">
          {file ? file.name : "No file chosen"}
        </span>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          w-full py-4 rounded-full
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
          font-semibold text-black text-lg
          transition-all duration-300
          hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]
          disabled:opacity-50
        "
      >
        {loading ? "Analyzing Resume..." : "Upload & Analyze"}
      </button>

    </div>
  </div>
);

}
