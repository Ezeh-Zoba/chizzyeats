"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HOME_CATEGORIES } from "@/lib/home-data";

export function CategoryGrid() {
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
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#5C4033", fontWeight: 700 }}
            >
              What Are You Craving?
            </h2>
          </div>
          <Link
            href="/category/nigerian"
            className="hidden sm:flex items-center gap-1 text-sm transition-colors"
            style={{ color: "#FF8C42", fontWeight: 600 }}
          >
            All Recipes <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = cat.bg;
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(92,64,51,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#fff";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(92,64,51,0.06)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {typeof cat.icon === "string" ? (
                <span className="text-2xl">{cat.icon}</span>
              ) : (
                <cat.icon size={26} style={{ color: cat.color }} />
              )}
              <span className="text-xs text-center leading-tight" style={{ color: "#5C4033", fontWeight: 600 }}>
                {cat.label}
              </span>
              <span className="text-xs" style={{ color: "#8B6F47" }}>{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
