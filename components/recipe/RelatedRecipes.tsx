import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/components/RecipeCard";

interface RelatedRecipesProps {
  recipes: Recipe[];
}

export function RelatedRecipes({ recipes }: RelatedRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <div>
      <h2 className="mb-6" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "22px", color: "var(--ce-text)", fontWeight: 700 }}>
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
