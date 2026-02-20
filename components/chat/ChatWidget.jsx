import { useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget({
  streak,
  weeklyActivities,
  skills,
}) {

  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
  <ChatPanel
    onClose={() => setOpen(false)}
    streak={streak}
    weeklyActivities={weeklyActivities}
    skills={skills}
  />
)}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12
                   rounded-full bg-cyan-500 text-black
                   shadow-lg text-xl"
      >
        🤖
      </button>
    </>
  );
}
