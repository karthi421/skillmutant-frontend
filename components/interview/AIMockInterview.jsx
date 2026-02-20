import { useState } from "react";

import { logProgress } from "../../lib/logProgress";

export default function AIMockInterview({ analysis }) {
  const [jobRole, setJobRole] = useState("");
  const [company, setCompany] = useState("");

  const startInterview = () => {
    if (!jobRole || !company) {
      alert("Please enter job role and company name");
      return;
    }

    // ✅ Log ONLY after validation
    logProgress(
      "interview",
      "Started AI mock interview"
    );

    // ✅ Save interview context
    sessionStorage.setItem(
      "mockInterviewData",
      JSON.stringify({
        jobRole,
        company,
        skills: analysis?.current_skills || [],
      })
    );

    // ✅ Open interview room
    window.open("/mock-interview-room", "_blank");
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-2">
        AI Mock Interview
      </h2>

      <p className="text-sm text-slate-400 mb-4">
        Practice a real HR-style interview based on your resume and job goals.
      </p>

      <div className="space-y-4">
        <input
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="Job Role (e.g. Software Engineer)"
          className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10"
        />

        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name (e.g. Google)"
          className="w-full px-4 py-2 rounded-md bg-black/40 border border-white/10"
        />

        <button
          onClick={startInterview}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md font-medium"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
