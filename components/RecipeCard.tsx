"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat, Heart, Bookmark } from "lucide-react";
import { useState } from "react";

export interface RecipeIngredient {
  amount: string;
  item: string;
}

export interface RecipeStep {
  step: number;
  title: string;
  time?: string;
  desc: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  time: string;
  difficulty: string;
  image: string;
  excerpt?: string;
  author?: string;
  rating?: number;
  saves?: number;
  servings?: number;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
  notes?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  variant?: "default" | "featured" | "horizontal";
}

export function RecipeCard({ recipe, variant = "default" }: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  if (variant === "horizontal") {
    return (
      <Link
        href={`/recipe/${recipe.id}`}
        className="flex gap-4 group"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}
          >
            {recipe.category}
          </span>
          <h4 className="mt-1.5 text-sm leading-snug line-clamp-2" style={{ color: "#5C4033", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            {recipe.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={11} style={{ color: "#8B6F47" }} />
            <span className="text-xs" style={{ color: "#8B6F47" }}>{recipe.time}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/recipe/${recipe.id}`}
        className="group relative overflow-hidden rounded-3xl block"
        style={{ boxShadow: "0 8px 40px rgba(92,64,51,0.15)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-end p-6"
          style={{ background: "linear-gradient(0deg, rgba(92,64,51,0.92) 0%, rgba(92,64,51,0.3) 60%, transparent 100%)" }}
        >
          <span
            className="self-start text-xs px-3 py-1 rounded-full mb-2"
            style={{ backgroundColor: "#FFC72C", color: "#5C4033", fontWeight: 700 }}
          >
            {recipe.category}
          </span>
          <h3
            className="mb-2 leading-tight"
            style={{ color: "#FFF8E7", fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}
          >
            {recipe.title}
          </h3>
          {recipe.excerpt && (
            <p className="text-sm mb-3 line-clamp-2" style={{ color: "rgba(255,248,231,0.75)" }}>
              {recipe.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock size={13} style={{ color: "#FFC72C" }} />
                <span className="text-xs" style={{ color: "rgba(255,248,231,0.85)" }}>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat size={13} style={{ color: "#FFC72C" }} />
                <span className="text-xs" style={{ color: "rgba(255,248,231,0.85)" }}>{recipe.difficulty}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Heart size={14} fill={liked ? "#FF8C42" : "none"} style={{ color: liked ? "#FF8C42" : "#fff" }} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Bookmark size={14} fill={saved ? "#FFC72C" : "none"} style={{ color: saved ? "#FFC72C" : "#fff" }} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 16px rgba(92,64,51,0.08)",
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(92,64,51,0.16)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(92,64,51,0.08)")}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: "#FFC72C", color: "#5C4033", fontWeight: 700 }}
          >
            {recipe.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <Heart size={14} fill={liked ? "#FF8C42" : "none"} style={{ color: liked ? "#FF8C42" : "#5C4033" }} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <Bookmark size={14} fill={saved ? "#FFC72C" : "none"} style={{ color: saved ? "#FFC72C" : "#5C4033" }} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}
          >
            {recipe.difficulty}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <Clock size={12} style={{ color: "#8B6F47" }} />
            <span className="text-xs" style={{ color: "#8B6F47" }}>{recipe.time}</span>
          </div>
        </div>

        <h3
          className="mb-2 leading-snug line-clamp-2"
          style={{ color: "#5C4033", fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 600 }}
        >
          {recipe.title}
        </h3>

        {recipe.excerpt && (
          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#8B6F47" }}>
            {recipe.excerpt}
          </p>
        )}

        <div
          className="pt-3 border-t flex items-center justify-between"
          style={{ borderColor: "rgba(92,64,51,0.08)" }}
        >
          <span className="text-xs" style={{ color: "#8B6F47" }}>
            By {recipe.author || "Chizzy"}
          </span>
          <span className="text-xs" style={{ color: "#FF8C42", fontWeight: 600 }}>
            View Recipe →
          </span>
        </div>
      </div>
    </Link>
  );
}
