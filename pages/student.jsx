
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
  <div className="min-h-screen bg-[#111111] text-white">
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#181818] via-[#111111] to-[#1c1c1c]" />

    {/* ===== HEADER ===== */}
    <StudentHeader />

    {/* ===== SIDEBAR ===== */}
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
        onOpenQuizzes={() => setQuizzesOpen(true)}
      />
    )}

    <StudentAccountPanel
      open={accountOpen}
      onClose={() => setAccountOpen(false)}
    />

    {jobsOpen && <JobsPanel onClose={() => setJobsOpen(false)} />}
    {notesOpen && (
      <NotesPanel mode={notesMode} onClose={() => setNotesOpen(false)} />
    )}
    {quizzesOpen && <QuizPanel onClose={() => setQuizzesOpen(false)} />}

    {/* ===== MENU BUTTON ===== */}
    <button
      onClick={() => setSidebarOpen(true)}
      className="fixed top-20 left-6 z-40
                 bg-[#1c1c1c] border border-neutral-700
                 px-4 py-2 rounded-lg text-sm
                 hover:border-white transition-all duration-200"
    >
      MENU ☰
    </button>

    {/* ===== MAIN CONTENT ===== */}
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">

      {/* ===== RESUME UPLOAD ===== */}
      {!analysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ResumeCoreCard onAnalyze={setAnalysis} />
        </motion.div>
      )}

      {/* ===== ANALYSIS CONTENT ===== */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-24"
        >

          {/* ===== CINEMATIC HERO SUMMARY ===== */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl
                       bg-gradient-to-br from-[#1a1a1a] to-[#111111]
                       border border-neutral-800
                       p-16"
          >
            <div className="absolute inset-0
                            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%)]" />

            <div className="relative z-10">
              <p className="text-sm tracking-widest text-neutral-500 mb-4">
                RESUME INTELLIGENCE ACTIVATED
              </p>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {analysis.best_role}
              </h1>

              <div className="flex flex-wrap gap-16 mt-6">
                <div>
                  <p className="text-neutral-500 text-sm mb-2">
                    ATS SCORE
                  </p>
                  <p className="text-4xl font-bold">
                    {analysis.ats_score}%
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 text-sm mb-2">
                    ROLE MATCH
                  </p>
                  <p className="text-4xl font-bold">
                    {roleMatch?.match || 0}%
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ===== SKILL ANALYSIS ===== */}
          <motion.section {...scrollAnim}>
            <ResumeAnalysis
              skills={analysis.skills || analysis.extracted_skills || []}
              skillQuality={skillQuality}
              loading={false}
            />
          </motion.section>

          {/* ===== INSIGHTS ===== */}
          <motion.section {...scrollAnim}>
            <ResumeInsights
              roleMatch={roleMatch}
              loading={false}
              onStartLearning={() =>
                skillAccelerationRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            />
          </motion.section>

          {/* ===== SKILL GRAPH GRID ===== */}
          <motion.section {...scrollAnim}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkillGraph score={analysis.ats_score} />
              <SkillGraphAnalysis
                roleMatch={roleMatch}
                skillQuality={skillQuality}
                atsScore={analysis.ats_score}
              />
            </div>
          </motion.section>

          {/* ===== SKILL DETAILS TOGGLE ===== */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowSkillDetails(!showSkillDetails)}
              className="text-sm px-4 py-2 rounded-lg
                         bg-[#1c1c1c] border border-neutral-700
                         hover:border-white transition-all duration-200"
            >
              {showSkillDetails
                ? "Hide Skill Details"
                : "Explore Skill Details"}
            </button>
          </div>

          <AnimatePresence>
            {showSkillDetails && (
              <motion.div
                key="skill-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SkillVisualization
                  categories={analysis.categories}
                  confidence={analysis.confidence}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== LEARNING ===== */}
          <motion.section {...scrollAnim}>
            <LearningPath
              currentSkills={analysis.current_skills}
              targetRole={analysis.target_role}
            />
          </motion.section>

          {/* ===== ATS SECTION (CLEANED) ===== */}
          <motion.section
            {...scrollAnim}
            className="p-10 rounded-3xl bg-[#1c1c1c] border border-neutral-800"
          >
            <h2 className="text-2xl font-semibold mb-6">
              ATS Compatibility Report
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ResumePDFPreview
                  title="Uploaded Resume"
                  accent="red"
                  mode="before"
                  checklist={analysis.ats_checklist}
                  description="ATS-detected structural and keyword issues."
                />
              </div>

              <div>
                <ResumePDFPreview
                  title="Optimized Resume View"
                  accent="green"
                  mode="after"
                  checklist={analysis.ats_checklist}
                  description="How your resume should align with ATS systems."
                />
              </div>
            </div>
          </motion.section>

          {/* ===== REMAINING COMPONENTS ===== */}
          <motion.section {...scrollAnim}>
            <ResumeComparison />
          </motion.section>

          <motion.section {...scrollAnim}>
            <SkillConfidenceGrowth />
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

        </motion.div>
      )}
    </div>
  </div>
);}