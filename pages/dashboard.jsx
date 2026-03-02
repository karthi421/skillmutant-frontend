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
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-[#020617] via-[#020617] to-black text-white">

     <div className="absolute inset-0 -z-10 pointer-events-none
        bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.08),transparent_45%)]"
      />
      
  {/* ===== NAVBAR ===== */}
<div className="w-full px-12 py-8 flex items-center justify-between">

  {/* Left: Logo */}
  <h1 className="text-2xl italic tracking-widest -skew-x-6 font-light">
    Skill<span className="font-semibold">Mutant</span>
  </h1>

  {/* Right: Navigation */}
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

</div>
      {/* ===== HERO ===== */}
      <section id="home" className="text-center mt-32 px-6">

        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold
                       bg-clip-text text-transparent
                       bg-gradient-to-b from-neutral-50 to-neutral-400">
          AI Skill Intelligence
          <br />
          Reimagined.
        </h2>

        <p className="text-neutral-400 mt-8 text-lg max-w-2xl mx-auto leading-relaxed">
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
                     shadow-[0_6px_20px_rgba(0,0,0,0.2)]
                     transition-all duration-300 ease-out
                     hover:-translate-y-1
                     hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                     group"
        >
          Get Started
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="mt-40 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

        {[
          {
            title: "AI Resume Analysis",
            img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
          },
          {
            title: "Personalized Learning Paths",
            img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
          },
          {
            title: "Predictive Career Analytics",
            img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-[#1c1c1c]
                       border border-neutral-800
                       overflow-hidden
                       transition-all duration-300 hover:border-neutral-600"
          >
            <img
              src={item.img}
              alt={item.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-neutral-400 text-sm">
                Advanced intelligence module designed to enhance
                decision-making and future career alignment.
              </p>
            </div>
          </div>
        ))}

      </section>

      {/* ===== INTELLIGENCE WORKFLOW ===== */}
      <section id="workflow" className="mt-40 max-w-4xl mx-auto px-6 text-center">

        <h3 className="text-3xl font-semibold mb-8">
          Intelligence Workflow
        </h3>

        <p className="text-neutral-400 leading-relaxed mb-8">
          SkillMutant operates through a multi-layered AI pipeline that
          transforms static career data into actionable intelligence.
          Once a resume or workforce profile is uploaded, the system
          extracts structured competencies, evaluates market demand,
          identifies capability gaps, and aligns them with strategic
          growth pathways.
        </p>

        <p className="text-neutral-400 leading-relaxed">
          Through continuous analysis and data refinement, the platform
          adapts recommendations dynamically — ensuring that individuals
          and organizations remain aligned with evolving industry
          standards and emerging technological shifts.
        </p>

      </section>

      {/* ===== CONTACT ===== */}
<section id="contact" className="mt-40 pb-32 text-center">

  {/* Divider */}
  <div className="max-w-6xl mx-auto px-6 mb-20">
    <div className="h-px w-full bg-white/30" />
  </div>

  <h3 className="text-3xl font-semibold mb-8">Contact</h3>

  <div className="space-y-4 text-neutral-400">

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
     {/* Branding */}
  <div className="mt-12 text-xs text-slate-500">
    © {new Date().getFullYear()} SkillMutant · Engineered by{" "}
    <span className="text-slate-300 font-medium">
      Kandelli Karthik
    </span>
  </div>
  </div>

</section>

    </div>
  );
}