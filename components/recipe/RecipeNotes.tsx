import { NotebookPen } from "lucide-react";

interface RecipeNotesProps {
  notes: string[];
}

export function RecipeNotes({ notes }: RecipeNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: "#FFF8E7", border: "1.5px solid rgba(255,199,44,0.3)" }}>
      <h2
        className="mb-4 flex items-center gap-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#5C4033", fontWeight: 700 }}
      >
        <NotebookPen size={20} style={{ color: "#FF8C42" }} />
        Chizzy's Notes
      </h2>
      <ul className="space-y-2.5">
        {notes.map((note, i) => (
          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#5C4033" }}>
            <span style={{ color: "#FFC72C", fontWeight: 800, flexShrink: 0 }}>•</span>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
