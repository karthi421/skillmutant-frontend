"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ===== SIDEBAR ANIMATION ===== */
const sidebarAnim = {
  hidden: { x: -360, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ===== ITEM APPEAR ===== */
const itemAnim = {
  hidden: { opacity: 0, y: 8 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.035 * i, duration: 0.3 },
  }),
};

export default function StudentSidebar({ onClose=null, onOpenAccount ,onOpenJobs ,onOpenNotes,onOpenQuizzes,interviewCount = 0}) 
 {
  const router =useRouter();
  const closeSidebar = () => {
  if (onClose) onClose();
};
 const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();

  document.cookie
    .split(";")
    .forEach(c => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

  if (onClose) onClose();
  router.replace("/");
};

  return (
    <>
      {/* ===== BACKDROP ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* ===== SIDEBAR ===== */}
      <motion.aside
        variants={sidebarAnim}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="
          fixed top-0 left-0 z-50
          h-screen w-80
          bg-gradient-to-b from-[#020617] via-[#020617] to-black
          shadow-[0_0_80px_rgba(34,211,238,0.22)]
          flex flex-col
        "
      >
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 flex justify-between items-center">
          <h1 className="text-xl font-extrabold tracking-wide">
            Skill<span className="text-cyan-400">Mutant</span>
          </h1>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <div
          className="
            flex-1 overflow-y-auto
            px-5 py-6 space-y-10 text-sm
            no-scrollbar
          "
        >
          <Section title="Account">
           <GlowItem i={0} onClick={onOpenAccount}>
  <div className="flex items-center gap-3">
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
      👤
    </div>
    <div>
      <p className="font-semibold">Account</p>
      <p className="text-xs text-slate-400">Profile & settings</p>
    </div>
  </div>
</GlowItem>

          </Section>

<Section title="Progress">
  <Link
    href="/student/progress"
    className="block"
    onClick={closeSidebar}
  >
    <GlowItem i={1}>
      📊 Progress Overview
    </GlowItem>
  </Link>
</Section>

<Section title="Jobs">
  <GlowItem i={2} onClick={onOpenJobs}>
    <div className="flex justify-between items-center w-full">
      <span>💼 Jobs Hub</span>

      {interviewCount > 0 && (
        <span
          className="
            text-xs px-2 py-0.5 rounded-full
            bg-cyan-500/20 text-cyan-400
            font-medium
          "
        >
          {interviewCount}
        </span>
      )}
    </div>
  </GlowItem>
</Section>


        

  <Section title="Notes">
  <GlowItem
    i={3}
    onClick={() => onOpenNotes("all")}
  >
    📝 All Notes
  </GlowItem>

  <GlowItem
    i={10}
    onClick={() => onOpenNotes("room")}
  >
    🏫 Room-wise Notes
  </GlowItem>
</Section>



          <Section title="Quizzes">
            <GlowItem
                    i={4}
                  onClick={() => {
                    onOpenQuizzes();
                    closeSidebar();
                  }}
            >
    🧪 Auto-generated Quizzes
  </GlowItem>
            
          </Section>
        </div>

        {/* ===== LOGOUT ===== */}
        <div className="px-6 py-5">
          <motion.button
  onClick={handleLogout}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  className="
    w-full py-2.5 rounded-xl
    text-red-400 font-medium
    bg-red-500/10
    border border-red-500/30
    hover:bg-red-500/20
    hover:text-red-300
    transition
    shadow-[0_0_25px_rgba(239,68,68,0.35)]
  "
>
  ⏻ Logout → Main Dashboard
</motion.button>

        </div>
      </motion.aside>
    </>
  );
}

/* ===== SECTION ===== */
function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ===== MAGNETIC GLOW ITEM ===== */
function GlowItem({ children, i, onClick }) {

  const ref = useRef(null);

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.04}px, ${y * 0.04}px)`;
  };

  const reset = () => {
    ref.current.style.transform = "translate(0,0)";
  };

  return (
    <motion.div
  onClick={onClick}
  custom={i}
  variants={itemAnim}
  initial="hidden"
  animate="visible"
  whileHover={{
    scale: 1.02,
    boxShadow: "0 0 20px rgba(34,211,238,0.35)",
  }}
  className="
    px-4 py-2.5 rounded-xl
    bg-white/5
    border border-white/10
    cursor-pointer
    transition
  "
>

      {children}
    </motion.div>
  );
}
