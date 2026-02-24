import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="relative min-h-screen bg-[#111111] text-white overflow-x-hidden">

      {/* ===== Softer Blurred Background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#18181B] via-[#111111] to-[#18181B]" />
      <div className="absolute top-[-150px] left-[-150px] w-[600px] h-[600px] bg-white/5 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-white/5 rounded-full blur-[160px]" />

      {/* ===== NAVBAR ===== */}
      <div className="relative z-20 max-w-7xl mx-auto px-10 py-8 flex justify-between items-center">

        {/* Slanted Logo */}
        <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
          Skill<span className="font-semibold">Mutant</span>
        </h1>

        {/* Center Navigation */}
        <div className="hidden md:flex gap-10 text-sm relative">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActive(item.id)}
              className={`relative transition-all duration-300 ${
                active === item.id
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {item.label}

              {active === item.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white"
                />
              )}
            </a>
          ))}
        </div>

        {/* Clean Login Button */}
        <button
          onClick={() => router.push("/login")}
          className="font-medium text-sm bg-white rounded-full
                     h-11 w-28 text-black
                     hover:bg-black hover:text-white
                     hover:border hover:border-white
                     transition-colors duration-300"
        >
          Login
        </button>
      </div>

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="relative z-10 text-center mt-32 px-6">

        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center
                       bg-clip-text text-transparent
                       bg-gradient-to-b from-neutral-50 to-neutral-400">
          AI Skill Intelligence
          <br />
          Reimagined.
        </h2>

        <p className="text-neutral-400 mt-8 text-lg max-w-2xl mx-auto leading-relaxed">
          SkillMutant transforms resumes into predictive career insights,
          structured learning paths, ATS scoring intelligence,
          and long-term workforce analytics.
        </p>

        {/* Premium Elevated Button (No Glow) */}
        <button
          onClick={() => router.push("/login")}
          className="relative mt-14 h-14 px-10
                     bg-white text-black
                     rounded-full
                     text-lg font-medium
                     flex items-center justify-center gap-3 mx-auto
                     shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                     transition-all duration-300 ease-out
                     hover:-translate-y-1
                     hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]
                     group"
        >
          Get Started
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {[
          "AI Resume Analysis",
          "Personalized Learning Paths",
          "Predictive Career Analytics",
        ].map((title) => (
          <div
            key={title}
            className="rounded-2xl bg-[#1A1A1A]
                       border border-neutral-800
                       p-8 hover:border-neutral-600
                       transition-all duration-300"
          >
            <div className="h-40 bg-neutral-800 rounded-lg mb-6" />
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-neutral-400 text-sm">
              Intelligent AI-powered module designed to enhance
              career positioning and workforce readiness.
            </p>
          </div>
        ))}

      </section>

      {/* ===== INTELLIGENCE WORKFLOW ===== */}
      <section id="workflow" className="relative z-10 mt-40 max-w-4xl mx-auto px-6 text-center">

        <h3 className="text-3xl font-semibold mb-8">
          Intelligence Workflow
        </h3>

        <p className="text-neutral-400 leading-relaxed mb-12">
          SkillMutant operates through a structured AI pipeline
          that converts raw career data into strategic,
          market-aligned insight.
        </p>

        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <p><strong className="text-white">01.</strong> Resume and workforce data ingestion.</p>
          <p><strong className="text-white">02.</strong> AI-driven skill mapping and market alignment.</p>
          <p><strong className="text-white">03.</strong> Personalized learning pathway generation.</p>
          <p><strong className="text-white">04.</strong> Predictive analytics for long-term growth.</p>
        </div>

      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative z-10 mt-40 mb-20 text-center">

        <h3 className="text-3xl font-semibold mb-6">Contact</h3>
        <p className="text-neutral-400">Email: support@skillmutant.ai</p>
        <p className="text-neutral-400">LinkedIn: Kandelli Karthik</p>

      </section>

    </div>
  );
}