import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden">

      {/* ===== Animated Background Light ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/10 rounded-full blur-[180px] animate-pulseSlow" />
      </motion.div>

      {/* ===== NAVBAR ===== */}
      <div className="relative max-w-7xl mx-auto px-10 py-8 flex justify-between items-center z-10">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl tracking-widest font-light"
        >
          Skill<span className="text-cyan-400 font-medium">Mutant</span>
        </motion.h1>

        <div className="flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#about" className="hover:text-white transition">About</a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/login")}
            className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-cyan-400 transition-all"
          >
            Login
          </motion.button>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 mt-32 z-10">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight"
        >
          Intelligence for the
          <br />
          <span className="text-cyan-400">Future Workforce.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-slate-400 mt-8 text-lg max-w-2xl leading-relaxed"
        >
          SkillMutant transforms resumes into predictive career intelligence,
          adaptive learning systems, and AI-powered workforce insights.
        </motion.p>

        {/* Premium Floating CTA */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/login")}
          className="mt-12 px-12 py-4 rounded-full text-lg font-semibold
                     bg-gradient-to-r from-cyan-500 to-blue-500
                     shadow-[0_0_50px_rgba(56,189,248,0.5)]
                     transition-all duration-300"
        >
          Get Started
        </motion.button>

      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div id="features" className="relative max-w-6xl mx-auto mt-48 px-6 grid md:grid-cols-3 gap-12 z-10">

        {[
          {
            title: "AI Skill Mapping",
            desc: "Deep resume intelligence with predictive gap analysis."
          },
          {
            title: "Adaptive Learning Engine",
            desc: "Dynamic career pathways aligned with market demand."
          },
          {
            title: "Predictive Career Analytics",
            desc: "Future role alignment powered by AI modeling."
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/5 backdrop-blur-md
                       border border-white/10
                       hover:border-cyan-400
                       transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-4">
              {item.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* ===== FOOTER ===== */}
      <div className="mt-40 border-t border-white/10 py-8 text-center text-slate-500 text-sm">
        SkillMutant © 2025 · Built by Kandelli Karthik
      </div>

      {/* ===== EXTRA ANIMATION ===== */}
      <style jsx>{`
        @keyframes pulseSlow {
          0% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 20px) scale(1.05); }
          100% { transform: translate(-50%, 0) scale(1); }
        }

        .animate-pulseSlow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}