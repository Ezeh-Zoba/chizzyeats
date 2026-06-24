"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useRecipes } from "@/hooks/useRecipes";
import { CATEGORY_META, SUBCATEGORY_TABS } from "@/lib/category-data";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
import { CategoryBanner } from "@/components/category/CategoryBanner";
import { CategoryNavStrip } from "@/components/category/CategoryNavStrip";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategoryResults } from "@/components/category/CategoryResults";

function parseMinutes(time: string): number {
  const hours = time.match(/(\d+)\s*hr/);
  const minutes = time.match(/(\d+)\s*min/);
  return (hours ? parseInt(hours[1], 10) * 60 : 0) + (minutes ? parseInt(minutes[1], 10) : 0);
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const key = params.slug || "nigerian";
  const meta = CATEGORY_META[key] || CATEGORY_META.nigerian;
  const { recipes } = useRecipes();

  const categoryRecipes = useMemo(() => {
    if (key === "quick") return recipes.filter((r) => parseMinutes(r.time) <= 30);
    return recipes.filter((r) => r.categorySlug === key);
  }, [recipes, key]);

  const filters = useRecipeFilters(categoryRecipes);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--ce-bg)", minHeight: "100vh" }}>
      <CategoryBanner meta={meta} />
      <CategoryNavStrip currentSlug={key} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {SUBCATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => filters.setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: filters.activeTab === tab ? "#FFC72C" : "var(--ce-bg-card)",
                color: filters.activeTab === tab ? "#5C4033" : "var(--ce-text-muted)",
                fontWeight: filters.activeTab === tab ? 700 : 500,
                boxShadow: filters.activeTab === tab ? "0 2px 12px rgba(255,199,44,0.35)" : "0 1px 6px var(--ce-shadow)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {filters.sidebarOpen && (
          <CategoryFilters
            className="lg:hidden mb-8"
            search={filters.search}
            onSearchChange={filters.setSearch}
            difficulty={filters.difficulty}
            onDifficultyChange={filters.setDifficulty}
            sort={filters.sort}
            onSortChange={filters.setSort}
          />
        )}

        <div className="flex gap-8">
          <CategoryFilters
            className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start"
            search={filters.search}
            onSearchChange={filters.setSearch}
            difficulty={filters.difficulty}
            onDifficultyChange={filters.setDifficulty}
            sort={filters.sort}
            onSortChange={filters.setSort}
          />

          <CategoryResults
            recipes={filters.recipes}
            filteredCount={filters.filteredCount}
            search={filters.search}
            onSearchChange={filters.setSearch}
            sort={filters.sort}
            onSortChange={filters.setSort}
            viewMode={filters.viewMode}
            onViewModeChange={filters.setViewMode}
            sidebarOpen={filters.sidebarOpen}
            onToggleSidebar={() => filters.setSidebarOpen(!filters.sidebarOpen)}
            page={filters.page}
            totalPages={filters.totalPages}
            onPageChange={filters.setPage}
          />
        </div>
      </div>
    </div>
  );
}
