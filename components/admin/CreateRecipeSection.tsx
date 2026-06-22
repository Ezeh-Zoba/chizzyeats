"use client";

import { useState } from "react";
import { CheckCircle, X, Image as ImageIcon } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";
import { ADMIN_CATEGORIES, EMPTY_RECIPE_FORM, type CreateRecipeFormData } from "@/lib/admin-data";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552166539-ade937e98ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

interface CreateRecipeSectionProps {
  formData: CreateRecipeFormData;
  setFormData: (data: CreateRecipeFormData) => void;
  onCreate: (recipe: Recipe, publish: boolean) => void;
}

export function CreateRecipeSection({ formData, setFormData, onCreate }: CreateRecipeSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState<"draft" | "published" | null>(null);

  const buildRecipe = (): Recipe => ({
    id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `recipe-${Date.now()}`,
    title: formData.title,
    category: ADMIN_CATEGORIES.find((c) => c.slug === formData.category)?.name || formData.category,
    time: [formData.prepTime, formData.cookTime].filter(Boolean).join(" + ") || "30 min",
    difficulty: formData.difficulty,
    image: imagePreview || FALLBACK_IMAGE,
    excerpt: formData.excerpt,
    author: "Chizzy",
    rating: 0,
    saves: 0,
    servings: Number(formData.servings) || 4,
  });

  const handleSubmit = (e: React.SyntheticEvent, publish: boolean) => {
    e.preventDefault();
    if (!formData.title) return;
    onCreate(buildRecipe(), publish);
    setSaved(publish ? "published" : "draft");
    setFormData(EMPTY_RECIPE_FORM);
    setImagePreview(null);
    setTimeout(() => setSaved(null), 2500);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-3xl space-y-6">
      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-2xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
          <CheckCircle size={16} style={{ color: "#22c55e" }} />
          <span className="text-sm" style={{ color: "#15803d", fontWeight: 600 }}>
            Recipe {saved === "published" ? "published" : "saved as draft"}!
          </span>
        </div>
      )}

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Recipe Title *</label>
        <input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. The Perfect Party Jollof Rice"
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
          >
            {ADMIN_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
          >
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Servings</label>
          <input
            type="number"
            min="1"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
            className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
            style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {([["Prep Time", "prepTime", "e.g. 15 min"], ["Cook Time", "cookTime", "e.g. 30 min"]] as const).map(([label, field, placeholder]) => (
          <div key={field}>
            <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>{label}</label>
            <input
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
              style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Short Description (Excerpt)</label>
        <textarea
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="A one to two sentence teaser for the recipe…"
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Hero Image</label>
        <div
          className="relative border-2 border-dashed rounded-2xl overflow-hidden transition-colors"
          style={{ borderColor: dragOver ? "#FFC72C" : "rgba(92,64,51,0.2)", backgroundColor: dragOver ? "#FFF8E7" : "#fff", minHeight: "160px" }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) setImagePreview(URL.createObjectURL(file));
          }}
        >
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not optimizable via next/image */}
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "#FFF8E7" }}>
                <ImageIcon size={22} style={{ color: "#FF8C42" }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: "#5C4033" }}>Drop image here or click to upload</span>
              <span className="text-xs mt-1" style={{ color: "#8B6F47" }}>PNG, JPG up to 10MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Full Recipe Content</label>
        <textarea
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write ingredients and instructions here…"
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033", fontFamily: "'Inter', sans-serif", lineHeight: 1.7 }}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-3 rounded-2xl text-sm transition-all" style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}>
          Save as Draft
        </button>
        <button type="button" onClick={(e) => handleSubmit(e, true)} className="flex-1 py-3 rounded-2xl text-sm" style={{ backgroundColor: "#5C4033", color: "#FFF8E7", fontWeight: 700 }}>
          Publish Now
        </button>
      </div>
    </form>
  );
}
