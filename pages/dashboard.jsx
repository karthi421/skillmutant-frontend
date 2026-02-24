import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("home");

  const navItems = ["Home", "Features", "How it works", "Contact"];

  return (
    <div className="relative min-h-screen bg-[#07070d] text-white overflow-x-hidden">

      {/* ===== BACKGROUND BLUR LAYERS ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a14] to-black" />
      <div className="absolute top-[-200px] right-[-200px] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[200px]" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[700px] h-[700px] bg-purple-500/20 rounded-full blur-[200px]" />

      {/* ===== NAVBAR ===== */}
      <div className="relative z-20 max-w-7xl mx-auto px-10 py-8 flex justify-between items-center">

        {/* Stylish Slanted Logo */}
        <h1 className="text-2xl italic tracking-widest font-light transform -skew-x-6">
          Skill<span className="text-cyan-400 font-semibold">Mutant</span>
        </h1>

        {/* Center Nav */}
        <div className="hidden md:flex gap-10 text-sm">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setActive(item)}
              className={`relative cursor-pointer transition-all duration-300 ${
                active === item
                  ? "text-cyan-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item === "how"
                ? "How it Works"
                : item.charAt(0).toUpperCase() + item.slice(1)}

              {active === item && (
                <motion.div
                  layoutId="navHighlight"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-cyan-400"
                />
              )}
            </a>
          ))}
        </div>

        {/* 3D Login Button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/login")}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500
                     shadow-[0_10px_30px_rgba(56,189,248,0.4)]
                     hover:shadow-[0_15px_40px_rgba(56,189,248,0.6)]
                     transition-all duration-300"
        >
          Login
        </motion.button>

      </div>

      {/* ===== HERO ===== */}
      <section id="home" className="relative z-10 text-center mt-28 px-6">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-extrabold leading-tight"
        >
          AI Skill Intelligence
          <br />
          <span className="text-cyan-400">Reimagined.</span>
        </motion.h2>

        <p className="text-slate-400 mt-8 text-lg max-w-2xl mx-auto leading-relaxed">
          SkillMutant transforms resumes into predictive career insights,
          learning paths, ATS scoring and workforce analytics.
        </p>

        {/* 3D Get Started */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/login")}
          className="mt-12 px-12 py-4 text-lg rounded-xl
                     bg-gradient-to-r from-purple-500 to-cyan-500
                     shadow-[0_15px_50px_rgba(168,85,247,0.4)]
                     hover:shadow-[0_20px_60px_rgba(56,189,248,0.6)]
                     transition-all duration-300"
        >
          Get Started
        </motion.button>

      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {[
          "AI Resume Analysis",
          "Personalized Learning Paths",
          "Predictive Career Analytics"
        ].map((title, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl
                       border border-white/10 hover:border-cyan-400
                       transition-all duration-300"
          >
            <div className="h-48 bg-gradient-to-br from-cyan-500/30 to-purple-500/30" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-slate-400 text-sm">
                Intelligent AI-powered module designed for future workforce readiness.
              </p>
            </div>
          </motion.div>
        ))}

      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="relative z-10 mt-40 max-w-4xl mx-auto px-6 text-center">

        <h3 className="text-3xl font-bold mb-10">How It Works</h3>

        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>1. Upload your resume or workforce data.</p>
          <p>2. AI analyzes skill gaps and market demand.</p>
          <p>3. Get personalized learning and career projections.</p>
          <p>4. Track progress with predictive analytics dashboard.</p>
        </div>

      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative z-10 mt-40 mb-20 text-center">

        <h3 className="text-3xl font-bold mb-6">Contact</h3>
        <p className="text-slate-400">Email: support@skillmutant.ai</p>
        <p className="text-slate-400">LinkedIn: Kandelli Karthik</p>

      </section>

    </div>
  );
}