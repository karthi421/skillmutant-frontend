
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0f172a] text-white">

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
      setNotesMode(mode);     // ✅ now defined
      setNotesOpen(true);
      setSidebarOpen(false);
    }}
    onOpenQuizzes={() => {
      setQuizzesOpen(true);
    }}
/>

    )}

      {/* ===== ACCOUNT PANEL ===== */}
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

   

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ===== RESUME UPLOAD ===== */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResumeCoreCard onAnalyze={setAnalysis} />
          </motion.div>
        )}
        
        
        {analysis && (
          <>
          {/* ===== AI RESUME ANALYSIS ===== */}
<motion.section {...scrollAnim}>
  <ResumeAnalysis
    skills={analysis.skills || analysis.extracted_skills || []}
    skillQuality={skillQuality}
    loading={false}
  />
</motion.section>

{/* ===== AI RESUME INSIGHTS ===== */}
<motion.section {...scrollAnim}>
 <ResumeInsights
  roleMatch={roleMatch}
  loading={false}
  onStartLearning={() => {
    skillAccelerationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
/>



</motion.section>
{/* ===== TOGGLE BUTTON ===== */}
<div className="flex justify-end mb-4">
  <button
    onClick={() => setShowSkillDetails(!showSkillDetails)}
    className="
      text-sm px-3 py-1 rounded-md
      bg-slate-800 border border-slate-600
      hover:bg-slate-700 transition
    "
  >
    {showSkillDetails ? "Hide Skill Details" : "Explore Skill Details"}
  </button>
</div>

<motion.section {...scrollAnim} className="space-y-6">
  {/* ===== SUMMARY ROW ===== */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SkillGraph score={analysis.ats_score} />

    <SkillGraphAnalysis
      roleMatch={roleMatch}
      skillQuality={skillQuality}
      atsScore={analysis.ats_score}
    />
  </div>

  {/* ===== TOGGLE ===== */}
  

  {/* ===== DETAILS (OPTIONAL) ===== */}
  <AnimatePresence>
  {showSkillDetails && (
    <motion.div
      key="skill-details"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <SkillVisualization
        categories={analysis.categories}
        confidence={analysis.confidence}
      />
    </motion.div>
  )}
</AnimatePresence>

</motion.section>


    <motion.section {...scrollAnim}>
        <LearningPath
          currentSkills={analysis.current_skills}
          targetRole={analysis.target_role}
        />
    </motion.section>

   
  
           
<motion.section
  {...scrollAnim}
  className="glass-card p-6 border border-cyan-400/15"
>
  {/* ===== HEADER ===== */}
  <h2 className="text-xl font-semibold mb-1">
    ATS Compatibility
  </h2>

  <p className="text-xs text-slate-400 mb-3">
    ATS systems analyze resume structure, keywords, and formatting — not visual design.
  </p>

  <div className="flex items-center gap-4 mb-6">
    <p className="text-4xl font-bold text-cyan-400">
      {analysis.ats_score}%
    </p>

    <p className="text-sm text-slate-400">
      {analysis.ats_verdict}
    </p>
  </div>

  {/* ===== BEFORE / AFTER GRID ===== */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* ❌ BEFORE — ATS ISSUES */}
    <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-red-400 mb-3">
        ❌ Uploaded Resume (ATS Issues)
      </h3>

      <ResumePDFPreview
        title="Uploaded Resume"
        accent="red"
        mode="before"
        checklist={analysis.ats_checklist}
        description="Red tags highlight ATS-detected issues such as missing keywords, weak structure, or formatting problems."
      />

      <ul className="space-y-2 text-sm mt-4">
        {analysis.ats_checklist.map((item, i) => (
          <li key={i} className="flex flex-col">
            <span
              className={
                item.status ? "text-slate-400" : "text-red-400"
              }
            >
              {item.status ? "✔" : "✘"} {item.item}
            </span>

            {!item.status && item.fix && (
              <span className="text-xs text-red-300 ml-4">
                Problem: {item.fix}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>

    {/* ✅ AFTER — ATS OPTIMIZED */}
    <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-green-400 mb-3">
        ✅ ATS-Optimized View (Recommended)
      </h3>

      <ResumePDFPreview
        title="ATS-Optimized Guidance"
        accent="green"
        mode="after"
        checklist={analysis.ats_checklist}
        description="Green tags represent how your resume aligns with ATS expectations after applying the recommended fixes."
      />

      <ul className="space-y-2 text-sm mt-4">
        {analysis.ats_checklist.map((item, i) => (
          <li key={i} className="text-green-400">
            ✔ {item.item}
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400 mt-3">
        Apply these fixes to improve keyword matching, section clarity, and ATS readability.
      </p>
    </div>

  </div>
</motion.section>

 
<motion.section {...scrollAnim}>
  <ResumeComparison />
</motion.section>

<motion.section {...scrollAnim}>
  <SkillConfidenceGrowth />
</motion.section>



            <motion.section {...scrollAnim} className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Project Intelligence</h2>
              <ProjectIntelligence projects={analysis.projects} />
            </motion.section>

            <motion.section {...scrollAnim} className="glass-card p-6">
  <h2 className="text-xl font-semibold mb-2">
    Resume Optimization Insights
  </h2>

  <p className="text-xs text-slate-400 mb-4">
    These insights are derived from ATS analysis, skill coverage,
    and recruiter expectations — not generic advice.
  </p>

  <div className="space-y-3">
    {insights.map((item, i) => (
      <div
        key={i}
        className={`
          flex gap-3 p-3 rounded-lg border
          ${
            item.level === "critical"
              ? "border-red-500/30 bg-red-500/5"
              : item.level === "improve"
              ? "border-yellow-400/30 bg-yellow-400/5"
              : "border-white/10 bg-white/5"
          }
        `}
      >
        <div className="text-lg">
          {item.level === "critical"
            ? "❌"
            : item.level === "improve"
            ? "⚠️"
            : "ℹ️"}
        </div>

        <div>
          <p className="text-sm leading-relaxed">
            {item.text}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {item.level === "critical"
              ? "This issue significantly reduces ATS and recruiter confidence."
              : item.level === "improve"
              ? "Fixing this can noticeably improve your resume strength."
              : "Optional optimization for stronger impact."}
          </p>
        </div>
      </div>
    ))}
  </div>
</motion.section>


            <motion.section {...scrollAnim} className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">
                AI-Generated Project Ideas
              </h2>
              {Object.entries(analysis.project_ideas).map(([level, ideas]) => (
                <div key={level} className="mb-3">
                  <p className="font-medium capitalize text-cyan-400 mb-1">
                    {level}
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {ideas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              ))}
            {learningLoading && (
            <motion.div
              {...scrollAnim}
                  className="glass-card p-6 border border-cyan-400/20"
            >
              <p className="text-cyan-300 animate-pulse">
                🤖 AI is generating your personalized learning path...
                </p>
            </motion.div>
        )}
 
            </motion.section>

         <motion.section {...scrollAnim}>
              <AISkillAcceleration analysis={analysis} />
        </motion.section>




            <motion.section {...scrollAnim}>
              <InterviewReadinessCard />
            </motion.section>

            <motion.section {...scrollAnim}>
              <InterviewRoadmap />
            </motion.section>

            <motion.section {...scrollAnim}>
              <AIJobRecommendations analysis={analysis} />
            </motion.section>

            <motion.section {...scrollAnim}>
              <AIMockInterview analysis={analysis} />
            </motion.section>

            <motion.section {...scrollAnim}>
              <CollaborativeLearningRooms />
            </motion.section>

            

          </>
  


        )}
      </div>
 
    </div>
  );

}