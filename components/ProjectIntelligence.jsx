import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectIntelligence({ projects = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold mb-6">
        Project Intelligence
      </h2>

      {projects.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No projects detected in your resume.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-xl p-5 bg-black/30"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setOpenIndex(
                    openIndex === index ? null : index
                  )
                }
              >
                <div>
                  <p className="font-semibold text-lg">
                    Project {index + 1}
                  </p>
                  <p className="text-xs text-slate-400">
                    Recruiter-Level Evaluation
                  </p>
                </div>

                <span className="text-cyan-400 font-bold">
                  {project.hire_score}%
                </span>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >

                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        Project Description
                      </p>
                      <p className="text-sm text-slate-300">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-cyan-400 mb-2">
                        Interview Questions (AI-Generated)
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {(project.interview_questions || []).map(
                          (q, i) => (
                            <li key={i}>{q}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-cyan-400 mb-2">
                        AI Project Improvements
                      </p>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {(project.ai_improvements || []).map(
                          (tip, i) => (
                            <li key={i}>{tip}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
