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
  <div className="max-w-xl mx-auto">

    <div className="relative bg-gradient-to-b from-[#0f172a] to-[#0b1120]
                    border border-white/10 rounded-2xl
                    backdrop-blur-xl p-8 text-center
                    shadow-[0_0_40px_rgba(0,0,0,0.4)]">

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-3 text-white">
        AI Resume Intelligence
      </h2>

      <p className="text-slate-300 text-sm mb-8">
        Upload your resume to unlock deep semantic analysis,
        skill-gap detection, and AI-powered career insights.
      </p>

      {/* Custom Upload Area */}
      <label className="cursor-pointer block">

        <div className="border border-white/15 rounded-xl
                        bg-white/5 hover:bg-white/10
                        transition-all duration-300
                        py-8 px-6 text-center">

          <p className="text-slate-300 text-sm">
            {file ? file.name : "Click to upload PDF resume"}
          </p>

          <p className="text-slate-500 text-xs mt-2">
            Supported format: .pdf
          </p>

        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      {/* CTA Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-8 w-full py-3 rounded-xl
                   bg-gradient-to-r from-cyan-500 to-cyan-600
                   hover:from-cyan-400 hover:to-cyan-500
                   text-white font-medium
                   transition-all duration-300
                   shadow-[0_0_30px_rgba(34,211,238,0.25)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing Resume..." : "Upload & Analyze"}
      </button>

    </div>
  </div>
);
}
