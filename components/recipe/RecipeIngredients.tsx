"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { RecipeIngredient } from "@/components/RecipeCard";

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
  servings: number;
  onServingsChange: (servings: number) => void;
  checked: Set<number>;
  onToggleChecked: (index: number) => void;
}

export function RecipeIngredients({ ingredients, servings, onServingsChange, checked, onToggleChecked }: RecipeIngredientsProps) {
  return (
    <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(92,64,51,0.07)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#5C4033", fontWeight: 700 }}>
          Ingredients
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onServingsChange(Math.max(1, servings - 1))}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
            style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 700 }}
          >
            –
          </button>
          <span className="text-sm" style={{ color: "#5C4033", fontWeight: 600, minWidth: "60px", textAlign: "center" }}>
            {servings} servings
          </span>
          <button
            onClick={() => onServingsChange(servings + 1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors"
            style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 700 }}
          >
            +
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {ingredients.map((ing, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b cursor-pointer group"
            style={{ borderColor: "rgba(92,64,51,0.06)" }}
            onClick={() => onToggleChecked(i)}
          >
            {checked.has(i) ? (
              <CheckCircle2 size={18} style={{ color: "#FFC72C", flexShrink: 0 }} />
            ) : (
              <Circle size={18} style={{ color: "rgba(92,64,51,0.2)", flexShrink: 0 }} />
            )}
            <span className="text-sm font-semibold min-w-[80px]" style={{ color: checked.has(i) ? "#8B6F47" : "#FF8C42" }}>
              {ing.amount}
            </span>
            <span
              className="text-sm"
              style={{ color: checked.has(i) ? "#aaa" : "#5C4033", textDecoration: checked.has(i) ? "line-through" : "none" }}
            >
              {ing.item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
