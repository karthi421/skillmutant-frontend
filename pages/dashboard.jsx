import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-black to-black"></div>

      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[160px]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[160px]"></div>

      {/* ================= NAVBAR ================= */}
      <div className="relative flex justify-between items-center px-12 py-8 max-w-7xl mx-auto">

        {/* Logo */}
        <h1 className="text-xl font-light tracking-widest text-slate-300">
          Skill<span className="text-cyan-400 font-medium">Mutant</span>
        </h1>

        {/* Center Pill Nav */}
        <div className="hidden md:flex gap-8 items-center bg-white/5 px-10 py-3 rounded-full backdrop-blur-xl border border-white/10">

          {["home", "features", "how", "contact"].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative px-3 py-1 text-sm font-medium text-slate-300
                         hover:text-cyan-400 transition-all duration-300"
            >
              {id === "how" ? "How it works" : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}

        </div>

        {/* Animated Login Button */}
        <button
          onClick={() => router.push("/login")}
          className="relative px-6 py-2 rounded-full font-medium
                     border border-white/20 bg-white/5 backdrop-blur-xl
                     hover:scale-105 transition-all duration-300
                     shadow-[0_0_25px_rgba(56,189,248,0.4)]"
        >
          <span className="relative z-10">Login</span>
          <span className="absolute inset-0 rounded-full animate-pulseGlow"></span>
        </button>

      </div>

      {/* ================= HERO ================= */}
      <div id="home" className="relative text-center mt-32 px-6 max-w-5xl mx-auto">

        <h2 className="text-6xl md:text-7xl font-extrabold leading-tight">
          SkillMutant
        </h2>

        <h3 className="text-4xl md:text-5xl font-bold text-slate-300 mt-6">
          Evolve Your Skills. Accelerate Your Career.
        </h3>

        <p className="text-slate-400 mt-8 text-lg leading-relaxed max-w-3xl mx-auto">
          AI-powered skill intelligence, resume analysis, learning paths,
          ATS scoring, and workforce analytics — all in one intelligent platform.
        </p>

        {/* Animated Get Started Button */}
        <button
          onClick={() => router.push("/login")}
          className="mt-12 px-12 py-4 rounded-full
                     bg-gradient-to-r from-cyan-500 to-blue-500
                     text-white font-semibold text-lg
                     hover:scale-105 transition-all duration-300
                     shadow-[0_0_40px_rgba(56,189,248,0.6)]
                     animate-gradientMove"
        >
          Get Started →
        </button>

      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div id="features" className="relative mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "Skill Intelligence",
            desc: "AI resume-based skill extraction and intelligent grading."
          },
          {
            title: "Learning Evolution",
            desc: "Personalized AI learning paths with certifications."
          },
          {
            title: "Career Matching",
            desc: "Smart job alignment powered by real-time hiring data."
          }
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl
                       border border-white/10
                       hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]
                       hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}

      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-40 border-t border-white/10 py-10 text-center text-slate-400 text-sm">
        SkillMutant © 2025 · Developed by Kandelli Karthik
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(56,189,248,0.0); }
          50% { box-shadow: 0 0 25px rgba(56,189,248,0.6); }
          100% { box-shadow: 0 0 0 rgba(56,189,248,0.0); }
        }

        .animate-pulseGlow {
          animation: pulseGlow 3s infinite;
        }
      `}</style>

    </div>
  );
}