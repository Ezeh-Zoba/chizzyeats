import Image from "next/image";
import type { ContentBlock } from "@/lib/blog-data";
import { InsightCallout } from "@/components/blog/InsightCallout";
import { RatingBlock } from "@/components/blog/RatingBlock";

export function BlogPostContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="leading-relaxed text-base" style={{ color: "var(--ce-text)", marginBottom: "1rem" }}>
                {block.text}
              </p>
            );

          case "heading":
            return block.level === 2 ? (
              <h2 key={i} className="font-bold mt-8 mb-3"
                style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(22px, 3vw, 28px)", color: "var(--ce-text)" }}>
                {block.text}
              </h2>
            ) : (
              <h3 key={i} className="font-bold mt-6 mb-2"
                style={{ fontSize: "18px", color: "var(--ce-text)" }}>
                {block.text}
              </h3>
            );

          case "image":
            return (
              <figure key={i} className="my-8">
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image src={block.url} alt={block.caption ?? "Blog image"} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-xs mt-2" style={{ color: "var(--ce-text-muted)" }}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote key={i} className="my-6 pl-5 py-1"
                style={{ borderLeft: "4px solid #FFC72C" }}>
                <p className="text-base italic leading-relaxed" style={{ color: "var(--ce-text)" }}>
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.attribution && (
                  <cite className="block text-sm mt-1 not-italic" style={{ color: "var(--ce-text-muted)" }}>
                    — {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case "insight":
            return <InsightCallout key={i} block={block} />;

          case "rating":
            return <RatingBlock key={i} block={block} />;

          case "link-card":
            return (
              <a key={i} href={block.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl p-4 my-6 transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", textDecoration: "none", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "var(--ce-text)" }}>{block.title}</p>
                  {block.description && (
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--ce-text-muted)" }}>{block.description}</p>
                  )}
                  <p className="text-xs mt-1 truncate" style={{ color: "#FF8C42" }}>{block.url}</p>
                </div>
                <span style={{ color: "var(--ce-text-muted)", fontSize: "18px", flexShrink: 0 }}>↗</span>
              </a>
            );

          case "divider":
            return (
              <div key={i} className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
                <span style={{ color: "#FFC72C", fontSize: "18px" }}>✦</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
