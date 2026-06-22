"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SAMPLE_RECIPES } from "@/lib/mock-recipes";
import { useRecipeFilters } from "@/hooks/useRecipeFilters";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategoryResults } from "@/components/category/CategoryResults";

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const filters = useRecipeFilters(SAMPLE_RECIPES);

  useEffect(() => {
    filters.setSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync when the URL query changes
  }, [query]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "#FF8C42", fontWeight: 600 }}>
          Search Results
        </p>
        <h1 className="mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#5C4033", fontWeight: 700 }}>
          {query ? `Results for "${query}"` : "Search Recipes"}
        </h1>

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
