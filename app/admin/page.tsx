"use client";

import { useState } from "react";
import type { Recipe } from "@/components/RecipeCard";
import { SAMPLE_RECIPES } from "@/lib/mock-recipes";
import { EMPTY_RECIPE_FORM, type CreateRecipeFormData } from "@/lib/admin-data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { RecipesSection } from "@/components/admin/RecipesSection";
import { CreateRecipeSection } from "@/components/admin/CreateRecipeSection";
import { CommentsSection } from "@/components/admin/CommentsSection";
import { CategoriesSection } from "@/components/admin/CategoriesSection";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [formData, setFormData] = useState<CreateRecipeFormData>(EMPTY_RECIPE_FORM);

  const updateRecipe = (updated: Recipe) => {
    setRecipes(recipes.map((r) => (r.id === updated.id ? updated : r)));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  const createRecipe = (recipe: Recipe) => {
    setRecipes([recipe, ...recipes]);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection recipes={recipes} />;
      case "recipes":
        return <RecipesSection recipes={recipes} onUpdateRecipe={updateRecipe} onDeleteRecipe={deleteRecipe} />;
      case "create":
        return <CreateRecipeSection formData={formData} setFormData={setFormData} onCreate={createRecipe} />;
      case "comments":
        return <CommentsSection />;
      case "categories":
        return <CategoriesSection />;
      case "analytics":
        return <AnalyticsSection recipes={recipes} />;
      default:
        return <OverviewSection recipes={recipes} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#F5F3EF" }}>
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar activeSection={activeSection} onCreateRecipe={() => setActiveSection("create")} />
        <main className="flex-1 overflow-y-auto p-6">{renderSection()}</main>
      </div>
    </div>
  );
}
