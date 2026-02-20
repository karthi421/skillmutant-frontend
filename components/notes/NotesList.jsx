import NoteCard from "./NoteCard";

export default function NotesList({ notes = [], onDelete }) {
  return (
    <div className="space-y-6">
      {notes.map((note, i) => (
        <NoteCard
          key={i}
          note={note}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
