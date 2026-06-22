"use client";

import { useMemo, useState } from "react";
import type { Recipe } from "@/components/RecipeCard";
import { SORT_OPTIONS, type SortOption } from "@/lib/category-data";

const PAGE_SIZE = 9;

function parseMinutes(time: string): number {
  const hours = time.match(/(\d+)\s*hr/);
  const minutes = time.match(/(\d+)\s*min/);
  return (hours ? parseInt(hours[1], 10) * 60 : 0) + (minutes ? parseInt(minutes[1], 10) : 0);
}

function sortRecipes(recipes: Recipe[], sort: SortOption): Recipe[] {
  const sorted = [...recipes];
  switch (sort) {
    case "Most Popular":
      return sorted.sort((a, b) => (b.saves || 0) - (a.saves || 0));
    case "Quickest":
      return sorted.sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time));
    case "Highest Rated":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "Newest":
    default:
      return sorted;
  }
}

function matchesTab(recipe: Recipe, tab: string): boolean {
  if (tab === "All") return true;
  if (tab === "Desserts" || tab === "Drinks") return recipe.category === tab;
  if (tab === "Quick") return parseMinutes(recipe.time) <= 30;
  // "Main Dishes" — anything not specifically a dessert, drink, or quick-tagged recipe
  return recipe.category !== "Desserts" && recipe.category !== "Drinks";
}

export function useRecipeFilters(recipes: Recipe[]) {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const result = recipes.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === "All" || r.difficulty === difficulty;
      return matchSearch && matchDiff && matchesTab(r, activeTab);
    });
    return sortRecipes(result, sort);
  }, [recipes, search, difficulty, sort, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateDifficulty = (value: string) => {
    setDifficulty(value);
    setPage(1);
  };

  const updateTab = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  return {
    activeTab,
    setActiveTab: updateTab,
    search,
    setSearch: updateSearch,
    difficulty,
    setDifficulty: updateDifficulty,
    sort,
    setSort,
    viewMode,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
    page: currentPage,
    setPage,
    totalPages,
    filteredCount: filtered.length,
    recipes: paginated,
  };
}
