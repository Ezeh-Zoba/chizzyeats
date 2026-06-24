import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/components/RecipeCard";

interface FeaturedRecipesSectionProps {
  recipes: Recipe[];
}

export function FeaturedRecipesSection({ recipes }: FeaturedRecipesSectionProps) {
  if (recipes.length === 0) return null;

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "var(--ce-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "#FF8C42", fontWeight: 600 }}>
              Editor's Picks
            </p>
            <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--ce-text)", fontWeight: 700 }}>
              Featured Recipes
            </h2>
          </div>
          <Link href="/category/nigerian" className="hidden sm:flex items-center gap-1 text-sm" style={{ color: "#FF8C42", fontWeight: 600 }}>
            See all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecipeCard recipe={recipes[0]} variant="featured" />
          </div>
          <div className="flex flex-col gap-6">
            {recipes.slice(1, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} variant="featured" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
