
import { motion, AnimatePresence } from "framer-motion";



import StudentHeader from "../components/StudentHeader";
/*RESUME */
import ResumeCoreCard from "../components/ResumeCoreCard";
import ResumeAnalysis from "../components/ResumeAnalysis";
import ResumeInsights from "../components/ResumeInsights";
import SkillConfidenceGrowth from "../components/SkillConfidenceGrowth"; 
import ResumeComparison from "../components/ResumeComparison";
import ResumePDFPreview from "../components/ResumePDFPreview";

import SkillVisualization from "../components/SkillVisualization";
import SkillGraph from "../components/SkillGraph";
import SkillGraphAnalysis from "../components/SkillGapAnalysis";
import ProjectIntelligence from "../components/ProjectIntelligence";
import ATSScore from "../components/ATSScore";
import LearningPath from "../components/LearningPath";
import { logProgress } from "../lib/logProgress";



import AISkillAcceleration from "../components/learning/AISkillAcceleration";
import AIJobRecommendations from "../components/jobs/AIJobRecommendations";
import AIMockInterview from "../components/interview/AIMockInterview";
import InterviewReadinessCard from "../components/interview/InterviewReadinessCard";
import InterviewRoadmap from "../components/interview/InterviewRoadmap";
import CollaborativeLearningRooms from "../components/learning-room/CollaborativeLearningRooms";
/* ✅ SIDEBAR + ACCOUNT */
import StudentSidebar from "../components/student-dashboard/StudentSidebar";
import StudentAccountPanel from "../components/student-dashboard/StudentAccountPanel";
import JobsPanel from "../components/jobs/JobsPanel";
import NotesPanel from "../components/notes/NotesPanel";
import QuizPanel from "../components/quizzes/QuizPanel";
import { useState, useEffect, useRef } from "react";

/* ===== SCROLL ANIMATION ===== */
const scrollAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.25 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export default function StudentPage() {
  // 🔹 ALL HOOKS FIRST — NO EXCEPTIONS
  const learningRef = useRef(null);
  const skillAccelerationRef = useRef(null);

  const [analysis, setAnalysis] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesMode, setNotesMode] = useState("all");
  const [quizzesOpen, setQuizzesOpen] = useState(false);

  const [learningRecommendations, setLearningRecommendations] = useState(null);
  const [learningLoading, setLearningLoading] = useState(false);
  const [showSkillDetails, setShowSkillDetails] = useState(false);
  const [interviewCount, setInterviewCount] = useState(0);

  // ✅ AFTER ALL HOOKS — logic & functions



  
  const getSkillQuality = (analysis) => {
  if (
  !analysis?.current_skills ||
  !analysis?.categories ||
  !analysis?.confidence
)
 {
    return [];
  }

  const atsWeight = (analysis.ats_score || 70) / 100;
  const skillLevels = [];
  for (const skill of analysis.skills) {
    let categoryConfidence = 0;

    for (const [category, skills] of Object.entries(analysis.categories)) {
      if (skills.includes(skill)) {
        categoryConfidence = analysis.confidence?.[category] || 50;
        break;
      }
    }

    const score = categoryConfidence * atsWeight;

    let level = "weak";
    if (score >= 50) level = "strong";
    else if (score >= 30) level = "average";

    skillLevels.push({
      name: skill,
      score: Math.round(score),
      level
    });
  }

  return skillLevels;
};

const [activePhase, setActivePhase] = useState(0);



const phaseRefs = [
  useRef(null),
  useRef(null),
  useRef(null),
  useRef(null),
];

const scrollToPhase = (index) => {
  phaseRefs[index]?.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const progressPercent = Math.round((activePhase / 3) * 100);

// ===== AI LEARNING PATH FROM RESUME =====
const fetchLearningPath = async (skill = null) => {
  try {
    setLearningLoading(true);

    const res = await fetch( `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/ai/recommend-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        current_skills: analysis?.current_skills || [],

        target_role: analysis.best_role,
        readiness: analysis.ats_score,
        user_query: skill // optional: focus on clicked gap
      })
    });

    const data = await res.json();
    setLearningRecommendations(data.recommendations || []);
    setTimeout(() => {
  learningRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}, 200);

  } catch (err) {
    console.error("Learning path fetch failed", err);
  } finally {
    setLearningLoading(false);
  }
};


// ===== AI ROLE MATCH EVALUATION =====
const getRoleMatch = (analysis, skillQuality) => {
  if (!analysis || !skillQuality.length) {
    return null;
  }

  let score = 0;
  let maxScore = 0;

  const strengths = [];
  const gaps = [];

  for (const skill of skillQuality) {
    maxScore += 100;

    if (skill.level === "strong") {
      score += 80;
      strengths.push(skill.name);
    } else if (skill.level === "average") {
      score += 50;
      strengths.push(skill.name);
    } else {
      score += 10;
      gaps.push(skill.name);
    }
  }

  const matchPercent = Math.min(
    100,
    Math.round((score / maxScore) * 100)
  );

  return {
    role: analysis.best_role,
    match: matchPercent,
    strengths,
    gaps
  };
};

const insights =analysis?.resume_suggestions
  ? analysis.resume_suggestions.map((text) => {
      let level = "info";

      if (
        text.toLowerCase().includes("does not") ||
        text.toLowerCase().includes("missing") ||
        text.toLowerCase().includes("no projects")
      ) {
        level = "critical";
      } else if (
        text.toLowerCase().includes("add") ||
        text.toLowerCase().includes("improve")
      ) {
        level = "improve";
      }

      return { text, level };
    })
  : [];


// ===== COMPUTE AI SKILL QUALITY (SAFE LOCATION) =====
const skillQuality = analysis ? getSkillQuality(analysis) : [];
const roleMatch = analysis
  ? getRoleMatch(analysis, skillQuality)
  : null;

 useEffect(() => {
  if (typeof window !== "undefined") {
    const list = JSON.parse(
      localStorage.getItem("interviewFeedbacks") || "[]"
    );
    setInterviewCount(list.length);
  }
}, []);
useEffect(() => {
  const last = localStorage.getItem("dailyReminder");
  const today = new Date().toDateString();

  console.log("🧪 dailyReminder last:", last);
  console.log("🧪 today:", today);

  if (last !== today) {
    console.log("🚀 calling logProgress");
    logProgress(
      "daily_goal_reminder",
      "🌞 Good morning! Complete one task to keep your streak alive"
    );
    localStorage.setItem("dailyReminder", today);
  } else {
    console.log("⛔ reminder already sent today");
  }
}, []);


useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 200;

    phaseRefs.forEach((ref, index) => {
      if (!ref.current) return;

      const offsetTop = ref.current.offsetTop;
      const offsetHeight = ref.current.offsetHeight;

      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        setActivePhase(index);
      }
    });
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
 
 return (
  <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#020617] to-black text-white">

    {/* ===== HEADER ===== */}
    <StudentHeader />
     {/* ===== SIDEBAR (ONLY ONCE — FIXED) ===== */}
          {sidebarOpen && (
            <StudentSidebar
      onClose={() => setSidebarOpen(false)}
      onOpenAccount={() => {
        setAccountOpen(true);
        setSidebarOpen(false);
      }}
      onOpenJobs={() => {
        setJobsOpen(true);
        setSidebarOpen(false);
      }}
      interviewCount={interviewCount}
       onOpenNotes={(mode) => {
          setNotesMode(mode);     
          setNotesOpen(true);
          setSidebarOpen(false);
        }}
        onOpenQuizzes={() => {
          setQuizzesOpen(true);
        }}
      /> 
     )}
    
       {/* ===== SIDEBAR TOGGLE (AFTER RESUME ANALYSIS) ===== */}
         
            <button
      onClick={() => setSidebarOpen(true)}
      className="
        fixed top-20 left-4 z-40
        bg-slate-800/80 backdrop-blur
        px-3 py-2 rounded-md
        hover:bg-slate-700 transition
      "
    >
      MENU ☰
    </button>
          
          {/* ===== ACCOUNT PANEL ===== */}
    <StudentAccountPanel
      open={accountOpen}
      onClose={() => setAccountOpen(false)}
    />
    
    {/* ===== JOBS PANEL ===== */}
    {jobsOpen && (
      <JobsPanel
        onClose={() => setJobsOpen(false)}
      />
    )}
    {notesOpen && (
      <NotesPanel
        mode={notesMode}
        onClose={() => setNotesOpen(false)}
      />
    )}
    
    {quizzesOpen && (
      <QuizPanel onClose={() => setQuizzesOpen(false)} />
    )}
       
    
    {/* ===== AI PIPELINE HUD ===== */}
    {analysis && (
      <div className="sticky top-16 z-50 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-6 relative">

          <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              AI Career Transformation Pipeline
            </div>
            <div className="text-xs text-cyan-400 font-semibold">
              {progressPercent}% Complete
            </div>
          </div>

          <div className="relative h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-700 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between mt-6">

            {[
              "Resume Intelligence",
              "ATS Optimization",
              "Skill Acceleration",
              "Career Readiness",
            ].map((phase, i) => {

              const completed = activePhase > i;
              const active = activePhase === i;

              return (
                <button
                  key={phase}
                  onClick={() => scrollToPhase(i)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-500
                    ${
                      completed
                        ? "bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.9)]"
                        : active
                        ? "bg-cyan-400 text-black animate-pulse"
                        : "bg-slate-700 text-transparent"
                    }`}
                  >
                    {completed ? "✓" : ""}
                  </div>

                  <span
                    className={`text-xs md:text-sm transition-all duration-300
                    ${
                      active
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-white"
                    }`}
                  >
                    {phase}
                  </span>
                </button>
              );
            })}

          </div>
        </div>
      </div>
    )}

    {/* ===== MAIN CONTENT ===== */}
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">

      {/* ===== RESUME UPLOAD ===== */}
      {!analysis && (
        <ResumeCoreCard onAnalyze={setAnalysis} />
      )}

      {analysis && (
        <>
        {/* ================= PHASE 1 ================= */}
<section
  ref={phaseRefs[0]}
  className="bg-gradient-to-b from-white/5 to-white/[0.02]
             border border-white/10 rounded-2xl
             p-10 backdrop-blur-sm transition-all duration-500"
>

  {/* ===== TITLE ===== */}
  <div className="mb-10">
    <h2 className="text-2xl font-semibold text-cyan-400">
      Phase 1 — Resume Intelligence
    </h2>
    <p className="text-slate-400 text-sm mt-2">
      Structural skill extraction, competency evaluation, and role alignment analysis.
    </p>
  </div>

  {/* ===== CORE ANALYSIS ===== */}
  <div className="space-y-12">

    <ResumeAnalysis
      skills={analysis.skills || analysis.extracted_skills || []}
      skillQuality={skillQuality}
      loading={false}
    />

    <ResumeInsights
      roleMatch={roleMatch}
      loading={false}
      onStartLearning={() => {
        skillAccelerationRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }}
    />

    {/* ===== GRAPH SUMMARY ===== */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      <SkillGraph score={analysis.ats_score} />

      <SkillGraphAnalysis
        roleMatch={roleMatch}
        skillQuality={skillQuality}
        atsScore={analysis.ats_score}
      />

    </div>

    {/* ===== TOGGLE BUTTON ===== */}
    <div className="flex justify-end">
      <button
        onClick={() => setShowSkillDetails(!showSkillDetails)}
        className="text-sm px-4 py-2 rounded-md
                   bg-slate-800 border border-slate-600
                   hover:bg-slate-700 transition-all duration-300"
      >
        {showSkillDetails
          ? "Hide Skill Details"
          : "Explore Skill Details"}
      </button>
    </div>

    {/* ===== SKILL DETAILS ===== */}
    <AnimatePresence>
      {showSkillDetails && (
        <motion.div
          key="skill-details"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35 }}
          className="border border-white/10 rounded-xl p-6 bg-white/[0.02]"
        >
          <SkillVisualization
            categories={analysis.categories}
            confidence={analysis.confidence}
          />
        </motion.div>
      )}
    </AnimatePresence>

  </div>

</section>
{/* ================= PHASE 2 ================= */}
<section
  ref={phaseRefs[1]}
  className="bg-gradient-to-b from-white/5 to-white/[0.02]
             border border-white/10 rounded-2xl
             p-10 backdrop-blur-sm transition-all duration-500"
>

{/* ===== HEADER ===== */}
<div className="mb-10">
  <h2 className="text-2xl font-semibold text-cyan-400">
    Phase 2 — ATS Optimization
  </h2>

  <p className="text-slate-400 text-sm mt-2">
    Keyword compliance analysis, structural formatting review,
    and machine parsing evaluation.
  </p>
</div>


{/* ===== ATS SCORE PANEL ===== */}
<div className="mb-14">

  <div
    className="grid md:grid-cols-[180px_1fr] gap-8 items-center
               border border-cyan-500/20
               bg-cyan-500/5
               rounded-xl p-6
               transition-all duration-500
               hover:border-cyan-400/40"
  >

    {/* SCORE */}
    <div className="text-center md:text-left">
      <div className="text-6xl font-bold text-cyan-400 tracking-tight">
        {analysis.ats_score}%
      </div>

      <div className="text-xs text-slate-400 mt-2">
        ATS Compatibility
      </div>
    </div>

    {/* DESCRIPTION */}
    <div className="text-sm text-slate-300 leading-relaxed">

      <p className="text-slate-200">
        {analysis.ats_verdict}
      </p>

      <p className="mt-3 text-slate-400 text-xs">
        Applicant Tracking Systems evaluate resumes based on
        structural clarity, keyword alignment, semantic role matching,
        and machine-readable formatting rather than visual styling.
      </p>

    </div>

  </div>

</div>


{/* ===== AI RESUME OPTIMIZATION ANALYSIS ===== */}
<div className="mb-16">

  <div
    className="border border-emerald-500/20
               bg-gradient-to-b from-emerald-500/5 to-transparent
               rounded-xl p-8
               transition-all duration-500
               hover:border-emerald-400/40"
  >

    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">

      <div>
        <h3 className="text-sm font-semibold text-emerald-400">
          AI Resume Optimization Analysis
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Comparison between the previous resume structure
          and the optimized ATS-friendly projection.
        </p>
      </div>

      <div
        className="text-xs px-3 py-1 rounded-full
                   bg-emerald-500/10 border border-emerald-500/30
                   text-emerald-300"
      >
        AI Generated
      </div>

    </div>

    {/* COMPARISON */}
    <ResumeComparison />

  </div>

</div>


{/* ===== SKILL CONFIDENCE GROWTH ===== */}
<div>

  <h3 className="text-lg font-semibold mb-6">
    Skill Confidence Trajectory
  </h3>

  <div
    className="border border-white/10
               rounded-xl
               p-6
               bg-white/[0.02]
               transition-all duration-500
               hover:border-white/20"
  >
    <SkillConfidenceGrowth />
  </div>

</div>

</section>

       {/* ================= PHASE 3 ================= */}
<section
  ref={phaseRefs[2]}
  className="bg-gradient-to-b from-white/5 to-white/[0.02]
             border border-white/10 rounded-2xl
             p-10 backdrop-blur-sm transition-all duration-500"
>

  {/* ===== HEADER ===== */}
  <div className="mb-12">
    <h2 className="text-2xl font-semibold text-cyan-400">
      Phase 3 — Skill Acceleration Engine
    </h2>
    <p className="text-slate-400 text-sm mt-2 max-w-2xl">
      Strategic learning roadmap, AI-guided capability expansion,
      and project-level execution planning aligned with your
      target role: <span className="text-white font-medium">{analysis.target_role}</span>.
    </p>
  </div>

  {/* ===== LEARNING ROADMAP ===== */}
  <div className="mb-16">
    <h3 className="text-lg font-semibold mb-6">
      Personalized Learning Path
    </h3>

    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <LearningPath
        currentSkills={analysis.current_skills}
        targetRole={analysis.target_role}
      />
    </div>
  </div>

  {/* ===== AI SKILL ACCELERATION ===== */}
  <div className="mb-16">
    <h3 className="text-lg font-semibold mb-6">
      AI Skill Acceleration Model
    </h3>

    <div className="border border-cyan-400/20 rounded-xl p-6 bg-cyan-400/[0.03]">
      <AISkillAcceleration analysis={analysis} />
    </div>
  </div>

  {/* ===== PROJECT INTELLIGENCE ===== */}
  <div>
    <h3 className="text-lg font-semibold mb-6">
      Project Execution Intelligence
    </h3>

    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <ProjectIntelligence projects={analysis.projects} />
    </div>
  </div>

</section>

         {/* ================= PHASE 4 ================= */}
<section
  ref={phaseRefs[3]}
  className="bg-gradient-to-b from-white/5 to-white/[0.02]
             border border-white/10 rounded-2xl
             p-10 backdrop-blur-sm transition-all duration-500"
>

  {/* ===== HEADER ===== */}
  <div className="mb-12">
    <h2 className="text-2xl font-semibold text-cyan-400">
      Phase 4 — Career Readiness & Market Domination
    </h2>
    <p className="text-slate-400 text-sm mt-2 max-w-2xl">
      Interview preparation, recruiter alignment, job targeting,
      and real-world execution strategy — powered by AI.
    </p>
  </div>

  {/* ===== INTERVIEW READINESS BLOCK ===== */}
  <div className="mb-16">
    <h3 className="text-lg font-semibold mb-6">
      Interview Readiness Intelligence
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
        <InterviewReadinessCard analysis={analysis} />
      </div>

      <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
        <InterviewRoadmap analysis={analysis} />
      </div>

    </div>
  </div>

  {/* ===== JOB TARGETING ENGINE ===== */}
  <div className="mb-16">
    <h3 className="text-lg font-semibold mb-6">
      AI Job Targeting & Role Matching
    </h3>

    <div className="border border-cyan-400/20 rounded-xl p-6 bg-cyan-400/[0.03]">
      <AIJobRecommendations analysis={analysis} />
    </div>
  </div>

  {/* ===== MOCK INTERVIEW SYSTEM ===== */}
  <div className="mb-16">
    <h3 className="text-lg font-semibold mb-6">
      AI Mock Interview Simulator
    </h3>

    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <AIMockInterview analysis={analysis} />
    </div>
  </div>

  {/* ===== COLLABORATIVE ROOMS ===== */}
  <div>
    <h3 className="text-lg font-semibold mb-6">
      Collaborative Learning Rooms
    </h3>

    <div className="border border-white/10 rounded-xl p-6 bg-white/[0.02]">
      <CollaborativeLearningRooms />
    </div>
  </div>

</section>
        </>
      )}
    </div>
  </div>
);}