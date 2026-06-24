"use client";

import Link from "next/link";
import { CATEGORY_META } from "@/lib/category-data";
import type { IconType } from "react-icons";

const CATEGORY_ORDER = ["nigerian", "african", "asian", "european", "american", "desserts", "drinks", "budget", "quick"];

export function CategoryNavStrip({ currentSlug }: { currentSlug: string }) {
  return (
    <div
      style={{ backgroundColor: "var(--ce-bg-card)", borderBottom: "1px solid var(--ce-border)" }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORY_ORDER.map((slug) => {
            const meta = CATEGORY_META[slug];
            if (!meta) return null;
            const isActive = slug === currentSlug;
            const Icon = typeof meta.icon !== "string" ? (meta.icon as IconType) : null;

            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "#FFC72C" : "var(--ce-bg-surface)",
                  color: isActive ? "#5C4033" : "var(--ce-text-muted)",
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive ? "0 2px 12px rgba(255,199,44,0.35)" : "0 1px 4px var(--ce-shadow)",
                  textDecoration: "none",
                }}
              >
                {typeof meta.icon === "string" ? (
                  <span style={{ fontSize: "15px", lineHeight: 1 }}>{meta.icon}</span>
                ) : Icon ? (
                  <Icon size={15} />
                ) : null}
                {meta.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
