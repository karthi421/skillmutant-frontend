"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NotesList from "./NotesList";

export default function NotesPanel({ onClose, mode = "all" }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("notes") || "[]"
    );
    setNotes(stored);
  }, []);

  const filtered =
    mode === "room"
      ? notes.filter(n => n.room)
      : notes;
  const saveNote = () => {
  if (!content.trim()) return;

  const newNote = {
    title: title || "Untitled Note",
    content,
    date: Date.now(),
  };

  const updated = [newNote, ...notes];
  setNotes(updated);
  localStorage.setItem("notes", JSON.stringify(updated));

  setTitle("");
  setContent("");
};
const deleteNote = (noteToDelete) => {
  const updated = notes.filter(
    n => n.date !== noteToDelete.date
  );

  setNotes(updated);
  localStorage.setItem("notes", JSON.stringify(updated));
};

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* PANEL */}
      <motion.aside
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        className="fixed right-0 top-0 z-50 h-screen w-[420px] bg-[#020617] p-6 overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          📝 {mode === "room" ? "Room-wise Notes" : "All Notes"}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400">
            No notes yet
          </p>
        ) : (
         <NotesList
  notes={filtered}
  onDelete={deleteNote}
/>

        )}
        {mode === "all" && (
  <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Note title (optional)"
      className="w-full mb-2 bg-transparent border-b border-white/20 text-sm outline-none pb-1"
    />

    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Write your note here..."
      rows={4}
      className="w-full bg-transparent text-sm outline-none resize-none"
    />

    <button
      onClick={saveNote}
      className="mt-3 text-xs px-3 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
    >
      Save Note
    </button>
  </div>
)}

      </motion.aside>
    </>
  );
}
