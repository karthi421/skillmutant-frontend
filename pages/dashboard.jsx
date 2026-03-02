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
  <div className="min-h-screen bg-[#0b1220] text-white flex flex-col">

    {/* ===== NAVBAR ===== */}
    <div className="w-full px-12 py-8 flex items-center justify-between">

      <h1 className="text-[22px] font-light tracking-[0.5px]">
        <span className="italic text-slate-400">Skill</span>
        <span className="font-semibold text-white">Mutant</span>
      </h1>

      <div className="hidden md:flex gap-10 text-sm">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={`transition ${
              active === item.id
                ? "text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>

    {/* ===== HERO ===== */}
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6">

      <h2 className="text-5xl md:text-7xl font-semibold leading-tight tracking-tight max-w-4xl">
        Intelligent Career
        <br />
        Infrastructure.
      </h2>

      <p className="mt-8 text-slate-400 max-w-2xl text-lg leading-relaxed">
        SkillMutant transforms resumes into structured intelligence.
        Analyze skill depth, predict market alignment, and build
        future-ready career pathways powered by AI.
      </p>

      <button
        onClick={() => router.push("/student")}
        className="mt-12 px-10 py-4 rounded-full
                   bg-white text-black
                   hover:bg-slate-200
                   transition font-medium"
      >
        Enter Platform
      </button>

    </section>

    {/* ===== FEATURE SECTION ===== */}
    <section className="py-32 border-t border-white/5">

      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-20 text-center">
          <h3 className="text-3xl font-semibold">
            Structured Intelligence Engine
          </h3>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Designed as a modular AI system — not a resume checker.
            Each component operates as part of a unified intelligence framework.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">

          <div>
            <h4 className="text-lg font-medium mb-4">
              Resume Signal Extraction
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Extracts structured competency signals, evaluates
              skill maturity, and aligns them against real-time
              hiring intelligence data.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">
              Predictive Role Modeling
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Forecasts career alignment by combining ATS readiness,
              skill depth mapping, and market demand trends.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">
              Adaptive Learning System
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Generates personalized acceleration paths to
              strengthen capability gaps and maximize
              long-term professional leverage.
            </p>
          </div>

        </div>
      </div>

    </section>

    {/* ===== INTELLIGENCE MODEL ===== */}
    <section className="py-32 border-t border-white/5">

      <div className="max-w-4xl mx-auto text-center px-6">
        <h3 className="text-3xl font-semibold mb-8">
          AI Intelligence Architecture
        </h3>

        <p className="text-slate-400 leading-relaxed">
          SkillMutant operates through a multi-layered evaluation engine.
          Resume parsing, contextual analysis, skill weighting, ATS
          simulation, and predictive modeling work together as
          a unified system — delivering insights beyond surface-level scoring.
        </p>
      </div>

    </section>

    {/* ===== FOOTER ===== */}
    <footer className="py-16 border-t border-white/5 text-center text-sm text-slate-500">
      SkillMutant © 2026 · AI Career Infrastructure
    </footer>

  </div>
);
}