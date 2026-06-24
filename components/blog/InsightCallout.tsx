import type { ContentBlock, InsightIcon } from "@/lib/blog-data";
import { INSIGHT_ICONS } from "@/lib/blog-data";
import { Lightbulb } from "lucide-react";

type InsightBlock = Extract<ContentBlock, { type: "insight" }>;

export function InsightCallout({ block }: { block: InsightBlock }) {
  const InsightIcon = INSIGHT_ICONS[block.icon as InsightIcon] ?? Lightbulb;
  return (
    <div
      className="rounded-2xl p-5 my-6"
      style={{
        border: "2px solid var(--ce-overlay-gold-border)",
        backgroundColor: "var(--ce-overlay-gold)",
      }}
    >
      <div className="flex gap-3">
        <InsightIcon size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#FF8C42" }} />
        <p className="text-sm leading-relaxed" style={{ color: "var(--ce-text)" }}>
          {block.text}
        </p>
      </div>
      {block.sourceUrl ? (
        <a
          href={block.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 ml-9 text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#FF8C42" }}
        >
          Source: {block.source} ↗
        </a>
      ) : (
        block.source && (
          <p className="mt-3 ml-9 text-xs" style={{ color: "var(--ce-text-muted)" }}>
            Source: {block.source}
          </p>
        )
      )}
    </div>
  );
}
