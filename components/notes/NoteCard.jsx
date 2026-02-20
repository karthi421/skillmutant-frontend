export default function NoteCard({ note, onDelete }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
      
      {/* DELETE BUTTON */}
      {onDelete && (
        <button
          onClick={() => onDelete(note)}
          className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      )}

      <h3 className="text-sm font-semibold mb-1">
        {note.title || "Untitled Note"}
      </h3>

      {note.room && (
        <p className="text-xs text-cyan-400 mb-1">
          📍 {note.room}
        </p>
      )}

      <p className="text-xs text-slate-300 whitespace-pre-wrap">
        {note.content}
      </p>

      <p className="text-[10px] text-slate-500 mt-2">
        {new Date(note.date).toLocaleString()}
      </p>
    </div>
  );
}
