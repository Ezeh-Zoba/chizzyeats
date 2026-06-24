"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Zap } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";

interface QuickMealsStripProps {
  recipes: Recipe[];
}

export function QuickMealsStrip({ recipes }: QuickMealsStripProps) {
  return (
    <section className="py-12" style={{ backgroundColor: "#5C4033" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} style={{ color: "#FFC72C" }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: "#FFC72C", fontWeight: 600 }}>
                Quick & Easy
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "26px",
                color: "#FFF8E7",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Ready in Under 30 Minutes
            </h3>
            <Link
              href="/category/quick"
              className="inline-flex items-center gap-1 mt-4 text-sm"
              style={{ color: "#FFC72C", fontWeight: 600 }}
            >
              See all quick recipes <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recipes.map((r) => (
              <Link
                key={r.id}
                href={`/recipe/${r.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,199,44,0.12)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)")}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={r.image} alt={r.title} fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: "#FFC72C", fontWeight: 600 }}>{r.time}</div>
                  <div className="text-sm leading-snug" style={{ color: "#FFF8E7", fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}>
                    {r.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
