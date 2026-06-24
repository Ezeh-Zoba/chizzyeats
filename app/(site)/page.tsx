"use client";

import { useRecipes } from "@/hooks/useRecipes";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedRecipesSection } from "@/components/home/FeaturedRecipesSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { QuickMealsStrip } from "@/components/home/QuickMealsStrip";
import { AboutChizzySection } from "@/components/home/AboutChizzySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  const { recipes } = useRecipes();
  const featuredRecipes = recipes.slice(0, 3);
  const latestRecipes = recipes.slice(3, 7);
  const quickRecipes = recipes.filter((r) => r.difficulty === "Easy").slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--ce-bg)" }}>
      <HeroSection />
      <CategoryGrid />
      <FeaturedRecipesSection recipes={featuredRecipes} />
      <LatestPostsSection recipes={latestRecipes} />
      <QuickMealsStrip recipes={quickRecipes} />
      <AboutChizzySection />
      <NewsletterSection />
    </div>
  );
}
