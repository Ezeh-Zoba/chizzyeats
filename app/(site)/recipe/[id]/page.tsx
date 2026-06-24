"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, deleteDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { Clock, Users, ChefHat } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRecipes } from "@/hooks/useRecipes";
import type { Recipe } from "@/components/RecipeCard";
import { SignInModal } from "@/components/auth/SignInModal";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { RecipeGalleryThumbs } from "@/components/recipe/RecipeGalleryThumbs";
import { ImageLightbox } from "@/components/recipe/ImageLightbox";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients";
import { RecipeSteps } from "@/components/recipe/RecipeSteps";
import { RecipeVideo } from "@/components/recipe/RecipeVideo";
import { RecipeNotes } from "@/components/recipe/RecipeNotes";
import { RecipeNutrition, type NutritionFact } from "@/components/recipe/RecipeNutrition";
import { RelatedRecipes } from "@/components/recipe/RelatedRecipes";
import { RecipeSidebar } from "@/components/recipe/RecipeSidebar";
import { CommentsList } from "@/components/recipe/CommentsList";
import { CommentForm } from "@/components/recipe/CommentForm";

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
  const { user } = useAuthUser();
  const { recipes: allRecipes } = useRecipes();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState(0);
  const [servings, setServings] = useState(4);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getDoc(doc(db, "recipes", params.id))
      .then((snap) => {
        if (!active || !snap.exists()) return;
        const data = { id: snap.id, ...snap.data() } as Recipe;
        setRecipe(data);
        setServings(data.servings || 4);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [params.id]);

  useEffect(() => {
    if (!user || !recipe) {
      setSaved(false);
      return;
    }
    let active = true;
    getDoc(doc(db, "saves", `${user.uid}_${recipe.id}`)).then((snap) => {
      if (active) setSaved(snap.exists());
    });
    return () => {
      active = false;
    };
  }, [user, recipe]);

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  const toggleSave = async () => {
    if (!user) {
      setSignInOpen(true);
      return;
    }
    if (!recipe) return;
    const saveRef = doc(db, "saves", `${user.uid}_${recipe.id}`);
    const recipeRef = doc(db, "recipes", recipe.id);
    if (saved) {
      await deleteDoc(saveRef);
      await updateDoc(recipeRef, { saves: increment(-1) });
    } else {
      await setDoc(saveRef, { userId: user.uid, recipeId: recipe.id, createdAt: new Date() });
      await updateDoc(recipeRef, { saves: increment(1) });
    }
    setSaved(!saved);
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", backgroundColor: "var(--ce-bg)" }} />;
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--ce-bg)" }}>
        <p style={{ color: "var(--ce-text)" }}>Recipe not found.</p>
      </div>
    );
  }

  const relatedRecipes = allRecipes.filter((r) => r.id !== recipe.id && r.categorySlug === recipe.categorySlug).slice(0, 3);
  const galleryImages = recipe.galleryImages?.length ? recipe.galleryImages : [recipe.image];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--ce-bg)", minHeight: "100vh" }}>
      <RecipeHero
        recipe={recipe}
        galleryImages={galleryImages}
        activeImage={galleryImages[activeGallery]}
        liked={saved}
        onToggleLike={toggleSave}
        saved={saved}
        onToggleSave={toggleSave}
        onImageClick={() => setLightboxOpen(true)}
      />

      <div className="print:hidden">
        <RecipeGalleryThumbs images={galleryImages} activeIndex={activeGallery} onSelect={setActiveGallery} />
      </div>

      <ImageLightbox
        images={galleryImages}
        index={activeGallery}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onIndexChange={setActiveGallery}
        alt={recipe.title}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-surface)" }}>
              {[
                { icon: Clock, label: "Total Time", value: recipe.time },
                { icon: Users, label: "Servings", value: `${servings}` },
                { icon: ChefHat, label: "Difficulty", value: recipe.difficulty },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon size={16} style={{ color: "#FF8C42" }} />
                  <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{label}</span>
                  <span className="text-sm" style={{ color: "var(--ce-text)", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>

            <p className="mb-8 leading-relaxed text-base" style={{ color: "var(--ce-text)" }}>
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

            {recipe.videoUrl && (
              <div className="print:hidden">
                <RecipeVideo videoUrl={recipe.videoUrl} />
              </div>
            )}

            {recipe.notes && <RecipeNotes notes={recipe.notes} />}

            <RecipeNutrition facts={GENERIC_NUTRITION} />

            <div className="print:hidden">
              <CommentsList recipeId={recipe.id} />
              <CommentForm recipeId={recipe.id} />

              <RelatedRecipes recipes={relatedRecipes} />
            </div>
          </div>

          <div className="print:hidden">
            <RecipeSidebar recipe={recipe} />
          </div>
        </div>
      </div>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </div>
  );
}
