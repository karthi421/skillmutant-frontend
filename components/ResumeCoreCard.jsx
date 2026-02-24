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
    <div className="max-w-2xl mx-auto mt-20 px-8 py-12
                    rounded-2xl
                    bg-[#1c1c1c]
                    border border-neutral-800
                    shadow-xl text-center">

      {/* TITLE */}
      <h2 className="text-3xl font-semibold mb-4">
        Resume Intelligence Engine
      </h2>

      <p className="text-neutral-400 text-sm max-w-md mx-auto mb-10">
        Upload your resume to generate structured AI insights,
        skill mapping, ATS scoring, and predictive role alignment.
      </p>

      {/* FILE DROP ZONE */}
      <label className="block cursor-pointer">
        <div className="border-2 border-dashed border-neutral-700
                        rounded-xl py-10 px-6
                        transition-colors duration-300
                        hover:border-white">

          <p className="text-neutral-400 text-sm">
            {file ? (
              <span className="text-white font-medium">
                {file.name}
              </span>
            ) : (
              "Drag & drop your PDF resume here or click to browse"
            )}
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      </label>

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-10 w-full py-3 rounded-full
                   bg-white text-black font-medium
                   transition-all duration-200
                   hover:-translate-y-[1px]
                   hover:shadow-md
                   disabled:opacity-50"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

    </div>
  );
}