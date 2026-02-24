import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("home");

  const navItems = ["home", "features", "how", "contact"];

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* ===== Subtle Blur Background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />

      {/* ===== NAVBAR ===== */}
      <div className="relative z-20 max-w-7xl mx-auto px-10 py-8 flex justify-between items-center">

        {/* Stylish Slanted Logo */}
        <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
          Skill<span className="font-semibold">Mutant</span>
        </h1>

        {/* Center Nav */}
        <div className="hidden md:flex gap-10 text-sm relative">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setActive(item)}
              className={`relative transition-all duration-300 ${
                active === item
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {item === "how"
                ? "How it Works"
                : item.charAt(0).toUpperCase() + item.slice(1)}

              {active === item && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white"
                />
              )}
            </a>
          ))}
        </div>

        {/* Clean Login Button (No Glow) */}
        <button
          onClick={() => router.push("/login")}
          className="font-normal text-lg bg-white rounded-full
                     h-12 w-36 text-black
                     hover:bg-[#0A0A0A] hover:text-white
                     hover:border hover:border-white
                     transition-colors duration-300 ease-in-out"
        >
          Login
        </button>

      </div>

      {/* ===== HERO ===== */}
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
          learning paths, ATS scoring and workforce analytics.
        </p>

        {/* Clean 3D Button (No Glow) */}
        <button
          onClick={() => router.push("/login")}
          className="font-normal text-xl text-center bg-white rounded-full
                     h-14 w-48 text-black px-4 py-3
                     hover:bg-[#0A0A0A] hover:text-white
                     hover:border hover:border-white
                     flex items-center justify-center
                     transition-colors duration-300 ease-in-out
                     group mt-12"
        >
          Get Started
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5 ml-2 transition-transform duration-500 ease-out group-hover:rotate-45"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </button>

      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {[
          "AI Resume Analysis",
          "Personalized Learning Paths",
          "Predictive Career Analytics"
        ].map((title) => (
          <div
            key={title}
            className="rounded-2xl bg-[#111111]
                       border border-neutral-800
                       p-8 hover:border-neutral-600
                       transition-all duration-300"
          >
            <div className="h-40 bg-neutral-800 rounded-lg mb-6" />
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-neutral-400 text-sm">
              Intelligent AI-powered module designed for workforce readiness.
            </p>
          </div>
        ))}

      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative z-10 mt-40 max-w-4xl mx-auto px-6 text-center">

        <h3 className="text-3xl font-bold mb-10">How It Works</h3>

        <div className="space-y-6 text-neutral-400 leading-relaxed">
          <p>1. Upload your resume or workforce data.</p>
          <p>2. AI analyzes skill gaps and market demand.</p>
          <p>3. Get personalized learning and career projections.</p>
          <p>4. Track progress with predictive analytics dashboard.</p>
        </div>

      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative z-10 mt-40 mb-20 text-center">

        <h3 className="text-3xl font-bold mb-6">Contact</h3>
        <p className="text-neutral-400">Email: support@skillmutant.ai</p>
        <p className="text-neutral-400">LinkedIn: Kandelli Karthik</p>

      </section>

    </div>
  );
}