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
  <div className="relative min-h-screen w-full flex flex-col 
                  bg-gradient-to-b from-[#020617] via-[#020617] to-black 
                  text-white overflow-hidden">

    {/* ===== STRONGER RADIAL LIGHT ===== */}
    <div
      className="absolute inset-0 -z-10 pointer-events-none
      bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.15),transparent_55%)]"
    />

    {/* ===== NAVBAR ===== */}
    <div className="w-full px-12 py-8 flex items-center justify-between">

      <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
        Skill<span className="font-semibold">Mutant</span>
      </h1>

      <div className="hidden md:flex gap-10 text-sm relative">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={`relative transition-all duration-300 ${
              active === item.id
                ? "text-white"
                : "text-slate-400 hover:text-white"
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
    </div>

    {/* ===== HERO ===== */}
    <section id="home" className="text-center mt-32 px-6">

      <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold
                     bg-clip-text text-transparent
                     bg-gradient-to-b from-white to-slate-400">
        AI Skill Intelligence
        <br />
        Reimagined.
      </h2>

      <p className="text-slate-300 mt-8 text-lg max-w-2xl mx-auto leading-relaxed">
        SkillMutant transforms resumes into predictive career insights,
        structured learning pathways, advanced ATS intelligence,
        and long-term workforce positioning strategies.
      </p>

      <button
        onClick={() => router.push("/student")}
        className="relative mt-14 h-14 px-10
                   bg-white text-black
                   rounded-full
                   text-lg font-medium
                   flex items-center justify-center gap-3 mx-auto
                   shadow-[0_6px_20px_rgba(0,0,0,0.25)]
                   transition-all duration-300 ease-out
                   hover:-translate-y-1
                   hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      >
        Get Started →
      </button>
    </section>

    {/* ===== FEATURES ===== */}
    <section id="features" className="mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

      {[
        {
          title: "AI Resume Analysis",
          img: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
        },
        {
          title: "Personalized Learning Paths",
          img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
        },
        {
          title: "Predictive Career Analytics",
          img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="relative rounded-2xl
                     bg-gradient-to-b from-[#0f172a] to-[#0b1120]
                     border border-white/10
                     overflow-hidden
                     transition-all duration-500
                     hover:-translate-y-2
                     hover:border-cyan-400/30
                     hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        >

          {/* Image */}
          <img
            src={item.img}
            alt={item.title}
            className="h-48 w-full object-cover grayscale brightness-75"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />

          <div className="relative p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">
              {item.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Advanced intelligence module designed to enhance
              decision-making and future career alignment.
            </p>
          </div>
        </div>
      ))}
    </section>

    {/* ===== INTELLIGENCE WORKFLOW ===== */}
    <section id="workflow" className="mt-40 max-w-4xl mx-auto px-6 text-center">

      <h3 className="text-3xl font-semibold mb-8 text-white">
        Intelligence Workflow
      </h3>

     <p className="text-slate-300 leading-relaxed text-base mb-8">
  SkillMutant operates through a multi-layered AI intelligence architecture 
  designed to transform static career data into predictive, decision-ready 
  insights. When a resume or workforce profile is uploaded, the platform 
  performs deep semantic parsing, contextual skill extraction, and 
  real-time market demand evaluation. It identifies structural capability 
  gaps, maps competencies against evolving industry benchmarks, and 
  generates precision-aligned growth pathways tailored to individual and 
  organizational objectives.
</p>

<p className="text-slate-300 leading-relaxed text-base">
  Beyond simple analysis, SkillMutant continuously refines its intelligence 
  through adaptive modeling and dynamic data feedback loops. As industry 
  standards shift and emerging technologies reshape workforce demand, 
  the system recalibrates recommendations in real time — ensuring users 
  remain strategically positioned for long-term career acceleration and 
  sustainable professional growth.
</p>
    </section>

    {/* ===== CONTACT ===== */}
    <section id="contact" className="mt-40 pb-32 text-center">

      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="h-px w-full bg-white" />
      </div>

      <h3 className="text-3xl font-semibold mb-8 text-white">
        Contact
      </h3>

      <div className="space-y-4 text-slate-300">

        <p>
          Email:{" "}
          <a
            href="mailto:skillmutant.app@gmail.com"
            className="text-white hover:text-cyan-400 transition"
          >
            support@skillmutant.ai
          </a>
        </p>

        <p>
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/karthik-kandelli-9573712b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition"
          >
            Kandelli Karthik
          </a>
        </p>

        <div className="mt-12 text-xs text-slate-500">
          © {new Date().getFullYear()} SkillMutant · Engineered by{" "}
          <span className="text-slate-300 font-medium">
            Kandelli Karthik
          </span>
        </div>

      </div>
    </section>

  </div>
);}