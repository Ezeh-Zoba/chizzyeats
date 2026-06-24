"use client";

import { LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BLOG_POST_TYPES } from "@/lib/blog-data";
import type { BlogPostType } from "@/lib/blog-data";

interface BlogFiltersProps {
  activeType: BlogPostType | "all";
  activeTags: string[];
  allTags: string[];
  onTypeChange: (type: BlogPostType | "all") => void;
  onTagToggle: (tag: string) => void;
}

export function BlogFilters({ activeType, activeTags, allTags, onTypeChange, onTagToggle }: BlogFiltersProps) {
  const types: Array<{ key: BlogPostType | "all"; label: string; icon: LucideIcon }> = [
    { key: "all", label: "All Posts", icon: LayoutGrid },
    ...(Object.keys(BLOG_POST_TYPES) as BlogPostType[]).map((t) => ({
      key: t,
      label: BLOG_POST_TYPES[t].label,
      icon: BLOG_POST_TYPES[t].icon,
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map(({ key, label, icon: TypeIcon }) => {
          const isActive = activeType === key;
          const color = key === "all" ? "#FFC72C" : BLOG_POST_TYPES[key as BlogPostType]?.color ?? "#FFC72C";
          return (
            <button
              key={key}
              onClick={() => onTypeChange(key)}
              className="px-3 py-1.5 rounded-full text-sm transition-all duration-200 inline-flex items-center gap-1.5"
              style={{
                backgroundColor: isActive ? color : "var(--ce-bg-card)",
                color: isActive ? (key === "all" ? "#5C4033" : "#fff") : "var(--ce-text-muted)",
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? `0 2px 12px ${color}40` : "0 1px 6px var(--ce-shadow)",
              }}
            >
              <TypeIcon size={12} /> {label}
            </button>
          );
        })}
      </div>

      {/* Tag chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="px-2.5 py-1 rounded-full text-xs transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--ce-overlay-gold)" : "var(--ce-bg-surface)",
                  color: isActive ? "var(--ce-text)" : "var(--ce-text-muted)",
                  border: `1px solid ${isActive ? "var(--ce-overlay-gold-border)" : "transparent"}`,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
