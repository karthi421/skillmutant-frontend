import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] text-white flex justify-center">
      
      <div className="w-[90%] max-w-6xl py-20 space-y-24">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-wide">
            Skill<span className="text-cyan-400">Mutant</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
            AI Skill Intelligence & Career Evolution Platform
          </p>
        </div>

        {/* ================= ROLE SELECTION ================= */}
        <div className="flex justify-center gap-8">

          {/* Student */}
          <button
            onClick={() => router.push("/student")}
            className="glass-card w-72 text-left hover:border-cyan-400"
          >
            <h3 className="text-2xl font-bold mb-2">👨‍🎓 Student</h3>
            <p className="card-text">
              Upload resume, analyze skills, get learning paths and career insights.
            </p>
          </button>

          {/* HR */}
          <button
            onClick={() => router.push("/hr")}
            className="glass-card w-72 text-left hover:border-purple-400"
          >
            <h3 className="text-2xl font-bold mb-2">🧑‍💼 HR</h3>
            <p className="card-text">
              Analyze talent, skill gaps, ATS scores, and workforce intelligence.
            </p>
          </button>

        </div>

        {/* ================= FEATURE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="glass-card">
            <h3 className="card-title">Skill Analysis</h3>
            <p className="card-text">
              Resume-based skill extraction, grading, and intelligent visualization
              to help users understand their true technical standing.
            </p>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Learning Intelligence</h3>
            <p className="card-text">
              AI-powered learning paths with curated courses, certifications,
              and future-ready skill recommendations.
            </p>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Career Matching</h3>
            <p className="card-text">
              Smart job discovery aligned with your skills using real-time
              data from global hiring platforms.
            </p>
          </div>

          <div className="glass-card md:col-span-3">
            <h3 className="card-title">Future Workspace</h3>
            <p className="card-text">
              Collaborative learning rooms, HR analytics dashboards, ATS scoring,
              resume optimization, and enterprise-level workforce insights.
            </p>
          </div>

        </div>

        {/* ================= USER GUIDE ================= */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            How to Use SkillMutant
          </h2>

          <p className="text-slate-300 leading-relaxed text-[15px]">
            SkillMutant is designed to evolve your career intelligently.  
            Start by navigating to the Student or HR workspace depending on your role.
            Students can upload resumes to unlock AI-powered skill analysis, personalized
            learning paths, certification recommendations, job matches, and ATS scoring.
            HR professionals can analyze employee skill distributions, identify gaps,
            monitor growth, and make data-driven upskilling decisions.
            <br /><br />
            This platform is not limited to resume analysis—it is a complete learning
            and career intelligence ecosystem. Users will soon be able to collaborate
            in learning rooms, track progress over time, and adapt dynamically to
            future industry demands with AI guidance.
          </p>
        </div>

        {/* ================= SPECIAL FEATURE ================= */}
        <div className="glass-card max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3 text-cyan-400">
            What Makes SkillMutant Different?
          </h3>
          <p className="text-slate-300 leading-relaxed">
            SkillMutant is not just a resume analyzer—it is a career evolution engine.
            By combining AI-driven insights, real-world hiring data, collaborative learning,
            and enterprise HR intelligence, SkillMutant adapts with you as technology evolves.
          </p>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-white/10 pt-10 text-center">
          <p className="text-slate-400 text-sm">
            Developed by <span className="text-cyan-400 font-semibold">Kandelli Karthik</span>
          </p>
          <p className="text-slate-500 text-xs mt-2">
            SkillMutant © 2025 · AI + Web Startup Project
          </p>
        </div>

      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 40px 100px rgba(56, 189, 248, 0.15);
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .card-text {
          color: #cbd5f5;
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>

    </div>
  );
}
