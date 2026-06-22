import { SAMPLE_RECIPES } from "@/lib/mock-recipes";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedRecipesSection } from "@/components/home/FeaturedRecipesSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { QuickMealsStrip } from "@/components/home/QuickMealsStrip";
import { AboutChizzySection } from "@/components/home/AboutChizzySection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  const featuredRecipes = SAMPLE_RECIPES.slice(0, 3);
  const latestRecipes = SAMPLE_RECIPES.slice(3, 7);
  const quickRecipes = SAMPLE_RECIPES.filter((r) => r.difficulty === "Easy").slice(0, 3);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#FAFAF8" }}>
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
