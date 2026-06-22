"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/components/RecipeCard";
import { SORT_OPTIONS, type SortOption } from "@/lib/category-data";

interface CategoryResultsProps {
  recipes: Recipe[];
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CategoryResults({
  recipes,
  filteredCount,
  search,
  onSearchChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  sidebarOpen,
  onToggleSidebar,
  page,
  totalPages,
  onPageChange,
}: CategoryResultsProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "#8B6F47" }}>
          <span style={{ color: "#5C4033", fontWeight: 600 }}>{filteredCount}</span> recipes found
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
            style={{ backgroundColor: sidebarOpen ? "#FFC72C" : "#FFF8E7", color: sidebarOpen ? "#5C4033" : "#FF8C42", fontWeight: 600 }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: "#fff", border: "1px solid rgba(92,64,51,0.1)" }}>
            <button
              onClick={() => onViewModeChange("grid")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: viewMode === "grid" ? "#FFF8E7" : "transparent", color: viewMode === "grid" ? "#FF8C42" : "#8B6F47" }}
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: viewMode === "list" ? "#FFF8E7" : "transparent", color: viewMode === "list" ? "#FF8C42" : "#8B6F47" }}
            >
              <List size={15} />
            </button>
          </div>

          <div className="relative hidden sm:block">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-2 rounded-full text-sm outline-none cursor-pointer"
              style={{ backgroundColor: "#fff", color: "#5C4033", border: "1px solid rgba(92,64,51,0.12)", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8B6F47" }} />
          </div>
        </div>
      </div>

      <div className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl mb-6" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.1)" }}>
        <Search size={16} style={{ color: "#8B6F47" }} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search recipes…"
          className="bg-transparent outline-none text-sm flex-1"
          style={{ color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      {recipes.length === 0 ? (
        <p className="text-center py-16 text-sm" style={{ color: "#8B6F47" }}>
          No recipes match your filters — try a different search or difficulty.
        </p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipe/${recipe.id}`}
              className="flex gap-5 p-4 rounded-2xl transition-all duration-200 group"
              style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(92,64,51,0.12)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(92,64,51,0.06)")}
            >
              <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={recipe.image} alt={recipe.title} fill sizes="112px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}>
                    {recipe.category}
                  </span>
                  <span className="text-xs" style={{ color: "#8B6F47" }}>{recipe.time}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f0fdf4", color: "#22c55e", fontWeight: 600 }}>
                    {recipe.difficulty}
                  </span>
                </div>
                <h3 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", color: "#5C4033", fontWeight: 600 }}>
                  {recipe.title}
                </h3>
                <p className="text-sm line-clamp-2" style={{ color: "#8B6F47" }}>{recipe.excerpt}</p>
              </div>
              <div className="hidden sm:flex items-center" style={{ color: "#FF8C42", fontWeight: 600, fontSize: "13px" }}>
                View →
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className="w-9 h-9 rounded-full text-sm transition-colors"
              style={{
                backgroundColor: page === p ? "#FFC72C" : "#fff",
                color: page === p ? "#5C4033" : "#8B6F47",
                fontWeight: page === p ? 700 : 400,
                boxShadow: "0 1px 6px rgba(92,64,51,0.07)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
