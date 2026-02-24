import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">

      {/* ===== Subtle Grid Background ===== */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

      {/* ===== NAVBAR ===== */}
      <div className="relative max-w-7xl mx-auto px-10 py-8 flex justify-between items-center">

        <h1 className="text-xl tracking-widest font-semibold">
          Skill<span className="text-cyan-400">Mutant</span>
        </h1>

        <div className="hidden md:flex gap-10 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#platform" className="hover:text-white transition">Platform</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 rounded-md border border-white/20
                     hover:border-cyan-400 hover:text-cyan-400
                     transition-all duration-300"
        >
          Login
        </button>
      </div>

      {/* ===== HERO ===== */}
      <div className="relative max-w-7xl mx-auto px-10 mt-24 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <div>

          <p className="text-cyan-400 text-sm tracking-wider uppercase">
            AI Career Intelligence Platform
          </p>

          <h2 className="text-6xl md:text-7xl font-black mt-6 leading-tight tracking-tight">
            Transform Skills
            <br />
            Into Strategic Advantage.
          </h2>

          <p className="text-slate-400 mt-8 text-lg leading-relaxed max-w-xl">
            SkillMutant analyzes resumes, maps skill gaps, predicts career
            trajectories, and delivers AI-driven learning intelligence —
            built for the future workforce.
          </p>

          <div className="mt-10 flex gap-6">

            <button
              onClick={() => router.push("/login")}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400
                         text-black font-semibold rounded-md
                         transition-all duration-300 hover:scale-105"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("/student")}
              className="px-8 py-4 border border-white/20
                         hover:border-cyan-400
                         rounded-md transition-all duration-300"
            >
              Explore Platform
            </button>

          </div>

        </div>

        {/* Right Visual Panel */}
        <div className="relative">

          <div className="bg-white/5 border border-white/10
                          backdrop-blur-xl rounded-xl p-10
                          shadow-[0_0_60px_rgba(0,255,255,0.08)]">

            <h3 className="text-xl font-semibold mb-6">
              Live Intelligence Snapshot
            </h3>

            <div className="space-y-4 text-slate-400 text-sm">

              <div className="flex justify-between">
                <span>Skill Match Score</span>
                <span className="text-cyan-400 font-medium">87%</span>
              </div>

              <div className="flex justify-between">
                <span>Market Demand Index</span>
                <span className="text-cyan-400 font-medium">High</span>
              </div>

              <div className="flex justify-between">
                <span>Learning Optimization</span>
                <span className="text-cyan-400 font-medium">Active</span>
              </div>

              <div className="flex justify-between">
                <span>Career Projection</span>
                <span className="text-cyan-400 font-medium">Upward</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ===== FEATURES ===== */}
      <div id="features" className="relative max-w-7xl mx-auto px-10 mt-40">

        <h3 className="text-3xl font-bold mb-12">
          Core Intelligence Modules
        </h3>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "Skill Mapping Engine",
              desc: "Extract and visualize technical competencies with AI precision."
            },
            {
              title: "Adaptive Learning System",
              desc: "Personalized pathways aligned with global market trends."
            },
            {
              title: "Predictive Career Analytics",
              desc: "AI forecasting for role alignment and workforce readiness."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="border border-white/10 rounded-xl p-8
                         hover:border-cyan-400
                         transition-all duration-300"
            >
              <h4 className="text-lg font-semibold mb-4">
                {item.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-40 border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        SkillMutant © 2025 · Built by Kandelli Karthik
      </div>

    </div>
  );
}