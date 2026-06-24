"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Heart, Bookmark, Star } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";

interface RecipeHeroProps {
  recipe: Recipe;
  galleryImages: string[];
  activeImage: string;
  liked: boolean;
  onToggleLike: () => void;
  saved: boolean;
  onToggleSave: () => void;
  onImageClick?: () => void;
}

export function RecipeHero({ recipe, galleryImages, activeImage, liked, onToggleLike, saved, onToggleSave, onImageClick }: RecipeHeroProps) {
  const categorySlug = recipe.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative h-[50vh] md:h-[60vh] print:h-[320px] overflow-hidden">
      <Image src={activeImage || galleryImages[0]} alt={recipe.title} fill priority sizes="100vw" className="object-cover" />
      <button
        type="button"
        onClick={onImageClick}
        className="absolute inset-0 w-full h-full cursor-zoom-in print:hidden"
        aria-label="View full image"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(92,64,51,0.85) 0%, rgba(92,64,51,0.2) 70%, transparent 100%)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full pointer-events-auto">
          <div className="flex items-center gap-2 mb-3 text-xs print:hidden" style={{ color: "rgba(255,248,231,0.7)" }}>
            <Link href="/" className="hover:text-yellow-300">Home</Link>
            <ChevronRight size={12} />
            <Link href={`/category/${categorySlug}`} className="hover:text-yellow-300">{recipe.category}</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#FFC72C" }}>{recipe.title}</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span
                className="inline-block text-xs px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "#FFC72C", color: "#5C4033", fontWeight: 700 }}
              >
                {recipe.category}
              </span>
              <h1
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "clamp(26px, 5vw, 52px)",
                  color: "#FFF8E7",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  maxWidth: "700px",
                }}
              >
                {recipe.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= Math.round(recipe.rating || 4.9) ? "#FFC72C" : "none"} style={{ color: "#FFC72C" }} />
                  ))}
                  <span className="text-sm ml-1" style={{ color: "rgba(255,248,231,0.85)" }}>{recipe.rating} ({recipe.saves} saves)</span>
                </div>
                <span className="text-sm" style={{ color: "rgba(255,248,231,0.7)" }}>By {recipe.author || "Chizzy"}</span>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={onToggleLike}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: liked ? "#FF8C42" : "rgba(255,255,255,0.2)" }}
              >
                <Heart size={16} fill={liked ? "#fff" : "none"} style={{ color: "#fff" }} />
              </button>
              <button
                onClick={onToggleSave}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: saved ? "#FFC72C" : "rgba(255,255,255,0.2)" }}
              >
                <Bookmark size={16} fill={saved ? "#5C4033" : "none"} style={{ color: saved ? "#5C4033" : "#fff" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Link
        href={`/category/${categorySlug}`}
        className="absolute top-20 md:top-24 left-4 sm:left-6 lg:left-8 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm print:hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", color: "#FFF8E7" }}
      >
        <ArrowLeft size={14} /> Back
      </Link>
    </div>
  );
}
