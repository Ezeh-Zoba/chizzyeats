import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe } from "@/components/RecipeCard";

interface LatestPostsSectionProps {
  recipes: Recipe[];
}

export function LatestPostsSection({ recipes }: LatestPostsSectionProps) {
  return (
    <section id="latest" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: "#FF8C42", fontWeight: 600 }}>
              Fresh from the Kitchen
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", color: "#5C4033", fontWeight: 700 }}>
              Latest Posts
            </h2>
          </div>
          <Link href="/category/nigerian" className="hidden sm:flex items-center gap-1 text-sm" style={{ color: "#FF8C42", fontWeight: 600 }}>
            All posts <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
