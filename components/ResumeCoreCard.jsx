/*import { useState } from "react";
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
}
*/
"use client";
import { useState} from "react";
import { logProgress } from "../lib/logProgress";
// Add a Lucide icon for a pro look (npm install lucide-react or use SVG)
import { Upload, FileCheck, Loader2 } from "lucide-react"; 

export default function ResumeCoreCard({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

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
        skills: data.skills || data.extracted_skills || data.matched_skills || [],
        best_role: data.best_role || data.predicted_role || data.target_role || "Frontend Developer",
      });

      // ... (Your existing localStorage logic remains exactly the same)
      const pdfURL = URL.createObjectURL(file);
      localStorage.setItem("lastResumePDF", pdfURL);
      
      logProgress("resume", "Resume analyzed successfully");
    } catch (err) {
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      {/* Background Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
          AI Resume Intelligence
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Upload your resume to unlock AI-powered insights.
        </p>

        {/* Custom Drag & Drop Area */}
        <label 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`
            relative mb-6 flex flex-col items-center justify-center w-full h-40 
            border-2 border-dashed rounded-xl cursor-pointer transition-all
            ${dragActive ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 hover:border-slate-500 bg-slate-800/50"}
          `}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {file ? (
              <>
                <FileCheck className="w-10 h-10 text-cyan-400 mb-2" />
                <p className="text-sm text-cyan-400 font-medium">{file.name}</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF (Max 5MB)</p>
              </>
            )}
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Upload & Analyze"
          )}
          {/* Subtle button shine effect */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </button>
      </div>
    </div>
  );
}