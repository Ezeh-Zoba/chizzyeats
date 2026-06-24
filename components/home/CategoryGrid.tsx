"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HOME_CATEGORIES } from "@/lib/home-data";
import { useRecipes } from "@/hooks/useRecipes";

function parseMinutes(time: string): number {
  const hours = time.match(/(\d+)\s*hr/);
  const minutes = time.match(/(\d+)\s*min/);
  return (hours ? parseInt(hours[1], 10) * 60 : 0) + (minutes ? parseInt(minutes[1], 10) : 0);
}

export function CategoryGrid() {
  const { recipes } = useRecipes();

  const categories = useMemo(() => {
    return HOME_CATEGORIES.map((cat) => {
      const slug = cat.href.split("/").pop();
      const count = slug === "quick"
        ? recipes.filter((r) => parseMinutes(r.time) <= 30).length
        : recipes.filter((r) => r.categorySlug === slug).length;
      return { ...cat, count };
    });
  }, [recipes]);

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "#FF8C42", fontWeight: 600 }}>
              Browse by Category
            </p>
            <h2
              className="leading-tight"
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--ce-text)", fontWeight: 700 }}
            >
              What Are You Craving?
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1 text-sm transition-colors"
            style={{ color: "#FF8C42", fontWeight: 600 }}
          >
            All Recipes <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = cat.bg;
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px var(--ce-shadow-elevated)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-card)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px var(--ce-shadow)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {typeof cat.icon === "string" ? (
                <span className="text-2xl">{cat.icon}</span>
              ) : (
                <cat.icon size={26} style={{ color: cat.color }} />
              )}
              <span className="text-xs text-center leading-tight" style={{ color: "var(--ce-text)", fontWeight: 600 }}>
                {cat.label}
              </span>
              <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
