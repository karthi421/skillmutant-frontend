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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/analyze-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      onAnalyze({
        ...data,
        skills:
          data.skills ||
          data.extracted_skills ||
          data.matched_skills ||
          [],
        best_role:
          data.best_role ||
          data.predicted_role ||
          data.target_role ||
          "Frontend Developer",
      });

      logProgress("resume", "Resume analyzed successfully");

      const pdfURL = URL.createObjectURL(file);
      localStorage.setItem("lastResumePDF", pdfURL);

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
        JSON.stringify(history.slice(-5))
      );

      localStorage.setItem(
        "lastResumeText",
        data.resume_text || ""
      );

      logProgress("resume", "Analyzed resume using AI");

    } catch (err) {
      alert("Resume analysis failed");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="max-w-3xl mx-auto mt-20 px-10 py-12
                  rounded-2xl
                  bg-[#1c1c1c]
                  border border-neutral-800
                  shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

    {/* SMALL LABEL */}
    <p className="text-xs tracking-widest text-neutral-500 mb-4">
      RESUME UPLOAD
    </p>

    {/* FILE ROW */}
    <div className="flex items-center gap-6 mb-8">

      <label className="cursor-pointer">
        <div className="px-6 py-3
                        bg-[#111111]
                        border border-neutral-700
                        rounded-full
                        text-sm
                        transition-all duration-200
                        hover:border-white">
          Choose File
        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      <span className="text-neutral-400 text-sm truncate max-w-xs">
        {file ? file.name : "No file selected"}
      </span>

    </div>

    {/* ACTION BUTTON */}
    <button
      onClick={handleUpload}
      disabled={loading}
      className="w-full py-4
                 rounded-full
                 bg-white text-black
                 font-medium
                 transition-all duration-200
                 hover:-translate-y-[1px]
                 hover:shadow-md
                 disabled:opacity-50"
    >
      {loading ? "Analyzing Resume..." : "Upload & Analyze"}
    </button>

  </div>
);
}