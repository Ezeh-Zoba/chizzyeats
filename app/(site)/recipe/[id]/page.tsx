"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Clock, Users, ChefHat } from "lucide-react";
import { SAMPLE_RECIPES } from "@/lib/mock-recipes";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { RecipeGalleryThumbs } from "@/components/recipe/RecipeGalleryThumbs";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeSteps } from "@/components/recipe/RecipeSteps";
import { RecipeNotes } from "@/components/recipe/RecipeNotes";
import { RecipeNutrition, type NutritionFact } from "@/components/recipe/RecipeNutrition";
import { RelatedRecipes } from "@/components/recipe/RelatedRecipes";
import { RecipeSidebar } from "@/components/recipe/RecipeSidebar";

const GENERIC_NUTRITION: NutritionFact[] = [
  { label: "Calories", value: "420", unit: "kcal" },
  { label: "Protein", value: "28", unit: "g" },
  { label: "Carbs", value: "52", unit: "g" },
  { label: "Fat", value: "12", unit: "g" },
  { label: "Fibre", value: "3", unit: "g" },
  { label: "Sodium", value: "680", unit: "mg" },
];

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const recipe = SAMPLE_RECIPES.find((r) => r.id === params.id) || SAMPLE_RECIPES[0];
  const relatedRecipes = SAMPLE_RECIPES.filter((r) => r.id !== recipe.id).slice(0, 3);
  const galleryImages = [recipe.image];

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [servings, setServings] = useState(recipe.servings || 4);

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#FAFAF8", minHeight: "100vh" }}>
      <RecipeHero
        recipe={recipe}
        galleryImages={galleryImages}
        activeImage={galleryImages[activeGallery]}
        liked={liked}
        onToggleLike={() => setLiked(!liked)}
        saved={saved}
        onToggleSave={() => setSaved(!saved)}
      />

      <RecipeGalleryThumbs images={galleryImages} activeIndex={activeGallery} onSelect={setActiveGallery} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "#FFF8E7" }}>
              {[
                { icon: Clock, label: "Total Time", value: recipe.time },
                { icon: Users, label: "Servings", value: `${servings}` },
                { icon: ChefHat, label: "Difficulty", value: recipe.difficulty },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={16} style={{ color: "#FF8C42" }} />
                  <span className="text-xs" style={{ color: "#8B6F47" }}>{label}</span>
                  <span className="text-sm" style={{ color: "#5C4033", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>

            <p className="mb-8 leading-relaxed text-base" style={{ color: "#5C4033" }}>
              {recipe.excerpt} This recipe has been tested and perfected in Chizzy's own kitchen — follow the steps below for a reliable, flavour-packed result every time.
            </p>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <RecipeIngredients
                ingredients={recipe.ingredients}
                servings={servings}
                onServingsChange={setServings}
                checked={checked}
                onToggleChecked={toggleCheck}
              />
            )}

            {recipe.steps && recipe.steps.length > 0 && <RecipeSteps steps={recipe.steps} />}

            {recipe.notes && <RecipeNotes notes={recipe.notes} />}

            <RecipeNutrition facts={GENERIC_NUTRITION} />

            <RelatedRecipes recipes={relatedRecipes} />
          </div>

          <RecipeSidebar recipe={recipe} />
        </div>
      </div>
    </div>
  );
}
