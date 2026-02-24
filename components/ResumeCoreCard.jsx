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
  <div className="max-w-4xl mx-auto mt-24 px-10 py-12
                  bg-[#141414]
                  border border-neutral-800
                  shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

    {/* HEADER */}
    <div className="border-b border-neutral-800 pb-6 mb-10">
      <h2 className="text-2xl font-semibold tracking-wide">
        Resume Intelligence Core
      </h2>
      <p className="text-neutral-500 text-sm mt-2 max-w-lg">
        Submit your resume to activate AI-powered structural parsing,
        ATS diagnostics, and role prediction modeling.
      </p>
    </div>

    {/* UPLOAD SECTION */}
    <div className="flex flex-col md:flex-row items-center gap-6">

      {/* FILE INPUT */}
      <label className="flex-1 cursor-pointer">
        <div className="h-14 flex items-center px-5
                        border border-neutral-700
                        bg-[#0f0f0f]
                        transition-all duration-200
                        hover:border-white">

          <span className="text-sm text-neutral-400 truncate">
            {file ? file.name : "Select resume (PDF format only)"}
          </span>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      </label>

      {/* ANALYZE BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="h-14 px-8
                   bg-white text-black
                   font-medium
                   transition-all duration-200
                   hover:-translate-y-[1px]
                   hover:shadow-md
                   disabled:opacity-50"
      >
        {loading ? "Processing..." : "Run Analysis"}
      </button>

    </div>

  </div>
);
}