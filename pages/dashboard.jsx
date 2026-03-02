import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("home");
 
  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "workflow", label: "Workflow" },
    { id: "contact", label: "Contact" },
  ];

return (
  <div className="min-h-screen bg-gradient-to-br from-[#0b1220] to-[#0f172a] text-white">

    <div className="max-w-7xl mx-auto px-6 py-24">

      {/* HERO */}
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight">
          <span className="italic text-slate-400">Skill</span>
          <span className="font-semibold text-white">Mutant</span>
        </h1>

        <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
          AI-driven career intelligence platform designed to analyze,
          optimize, and accelerate professional growth.
        </p>
      </div>

      {/* ROLE SELECTION */}
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-28">

        <button
          onClick={() => router.push("/student")}
          className="group p-10 rounded-2xl border border-white/10
                     bg-[#0f172a]
                     hover:bg-[#1e293b]
                     transition-all duration-300 text-left"
        >
          <h3 className="text-2xl font-medium mb-4">Student Workspace</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload resumes, analyze skill depth, generate AI learning paths,
            improve ATS performance, and track growth metrics.
          </p>
        </button>

        <button
          onClick={() => router.push("/hr")}
          className="group p-10 rounded-2xl border border-white/10
                     bg-[#0f172a]
                     hover:bg-[#1e293b]
                     transition-all duration-300 text-left"
        >
          <h3 className="text-2xl font-medium mb-4">HR Intelligence</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Analyze workforce skill distribution, detect capability gaps,
            monitor talent performance, and optimize hiring strategies.
          </p>
        </button>

      </div>

      {/* FEATURE PREVIEW */}
      <div className="grid md:grid-cols-3 gap-8 mb-28">

        <div className="border border-white/10 rounded-xl p-8 bg-[#0f172a]">
          <h4 className="text-lg font-medium mb-3">Skill Analysis</h4>
          <p className="text-slate-400 text-sm">
            Resume parsing with structured competency scoring and AI evaluation.
          </p>
        </div>

        <div className="border border-white/10 rounded-xl p-8 bg-[#0f172a]">
          <h4 className="text-lg font-medium mb-3">Learning Intelligence</h4>
          <p className="text-slate-400 text-sm">
            Adaptive learning paths based on skill gaps and market demand.
          </p>
        </div>

        <div className="border border-white/10 rounded-xl p-8 bg-[#0f172a]">
          <h4 className="text-lg font-medium mb-3">Career Matching</h4>
          <p className="text-slate-400 text-sm">
            Role alignment driven by real-time job intelligence signals.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 pt-10 text-center">
        <p className="text-slate-500 text-sm">
          SkillMutant © 2025 · AI Intelligence Platform
        </p>
      </div>

    </div>
  </div>
);
}