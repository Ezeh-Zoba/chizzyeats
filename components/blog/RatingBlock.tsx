import type { ContentBlock } from "@/lib/blog-data";
import { RATING_TYPE_LABELS } from "@/lib/blog-data";

type RatingBlockData = Extract<ContentBlock, { type: "rating" }>;

export function RatingBlock({ block }: { block: RatingBlockData }) {
  return (
    <div
      className="rounded-2xl p-5 my-6"
      style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", boxShadow: "0 2px 12px var(--ce-shadow)" }}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>{block.name}</p>
          <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{RATING_TYPE_LABELS[block.ratingType]}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="text-lg" style={{ color: n <= block.rating ? "#FFC72C" : "var(--ce-border-strong)" }}>
              ★
            </span>
          ))}
          <span className="ml-1 text-sm font-bold" style={{ color: "var(--ce-text)" }}>{block.rating}/5</span>
        </div>
      </div>
      {block.notes && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--ce-text-muted)" }}>{block.notes}</p>
      )}
    </div>
  );
}
