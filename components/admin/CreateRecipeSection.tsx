"use client";

import { useState } from "react";
import { CheckCircle, X, Image as ImageIcon, Plus } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";
import { EMPTY_RECIPE_FORM, type AdminCategory, type CreateRecipeFormData } from "@/lib/admin-data";

const inputStyle = { backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" };
const labelStyle = { color: "var(--ce-text)", fontWeight: 600 } as const;

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552166539-ade937e98ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

interface CreateRecipeSectionProps {
  formData: CreateRecipeFormData;
  setFormData: (data: CreateRecipeFormData) => void;
  categories: AdminCategory[];
  onCreate: (recipe: Recipe, publish: boolean, imageFile: File | null) => void;
}

export function CreateRecipeSection({ formData, setFormData, categories, onCreate }: CreateRecipeSectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState<"draft" | "published" | null>(null);

  const pickImage = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const buildRecipe = (): Recipe => ({
    id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `recipe-${Date.now()}`,
    title: formData.title,
    category: categories.find((c) => c.slug === formData.category)?.name || formData.category,
    categorySlug: formData.category,
    time: [formData.prepTime, formData.cookTime].filter(Boolean).join(" + ") || "30 min",
    prepTime: formData.prepTime,
    cookTime: formData.cookTime,
    difficulty: formData.difficulty,
    image: imagePreview || FALLBACK_IMAGE,
    excerpt: formData.excerpt,
    ingredients: formData.ingredients.filter((i) => i.item.trim()),
    steps: formData.steps
      .filter((s) => s.title.trim() || s.desc.trim())
      .map((s, i) => ({ step: i + 1, title: s.title, time: s.time, desc: s.desc })),
    notes: formData.notes.filter((n) => n.trim()),
    videoUrl: formData.videoUrl.trim() || undefined,
    author: "Chizzy",
    rating: 0,
    saves: 0,
    servings: Number(formData.servings) || 4,
  });

  const handleSubmit = (e: React.SyntheticEvent, publish: boolean) => {
    e.preventDefault();
    if (!formData.title) return;
    onCreate(buildRecipe(), publish, imageFile);
    setSaved(publish ? "published" : "draft");
    setFormData(EMPTY_RECIPE_FORM);
    setImagePreview(null);
    setImageFile(null);
    setTimeout(() => setSaved(null), 2500);
  };

  const sectionStyle = { backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="w-full">
      {saved && (
        <div className="flex items-center gap-2 p-4 rounded-2xl mb-5" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
          <CheckCircle size={16} style={{ color: "#22c55e" }} />
          <span className="text-sm" style={{ color: "#15803d", fontWeight: 600 }}>
            Recipe {saved === "published" ? "published" : "saved as draft"}!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: title, image, ingredients, steps, notes ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Title */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Recipe Details</h3>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Recipe Title *</label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Perfect Party Jollof Rice"
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Short Description (Excerpt)</label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A one to two sentence teaser for the recipe…"
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Hero Image</h3>
            <div
              className="relative border-2 border-dashed rounded-2xl overflow-hidden transition-colors"
              style={{ borderColor: dragOver ? "#FFC72C" : "var(--ce-border-strong)", backgroundColor: dragOver ? "var(--ce-overlay-gold)" : "var(--ce-bg-card)", minHeight: "180px" }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) pickImage(file); }}
            >
              {imagePreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not optimizable via next/image */}
                  <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                    <ImageIcon size={22} style={{ color: "#FF8C42" }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>Drop image here or click to upload</span>
                  <span className="text-xs mt-1" style={{ color: "var(--ce-text-muted)" }}>PNG, JPG up to 10MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) pickImage(file); }} />
                </label>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Ingredients</h3>
            <div className="space-y-2">
              {formData.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input value={ing.amount} onChange={(e) => { const next = [...formData.ingredients]; next[i] = { ...next[i], amount: e.target.value }; setFormData({ ...formData, ingredients: next }); }}
                    placeholder="Amount" className="w-28 px-3 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} />
                  <input value={ing.item} onChange={(e) => { const next = [...formData.ingredients]; next[i] = { ...next[i], item: e.target.value }; setFormData({ ...formData, ingredients: next }); }}
                    placeholder="Ingredient" className="flex-1 px-3 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} />
                  <button type="button" onClick={() => setFormData({ ...formData, ingredients: formData.ingredients.filter((_, j) => j !== i) })}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFormData({ ...formData, ingredients: [...formData.ingredients, { amount: "", item: "" }] })}
              className="flex items-center gap-1.5 text-sm" style={{ color: "#FF8C42", fontWeight: 600 }}>
              <Plus size={14} /> Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Steps</h3>
            <div className="space-y-3">
              {formData.steps.map((step, i) => (
                <div key={i} className="p-3 rounded-2xl space-y-2" style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ce-bg-card)", color: "#FF8C42", fontWeight: 700 }}>Step {i + 1}</span>
                    <button type="button" onClick={() => setFormData({ ...formData, steps: formData.steps.filter((_, j) => j !== i) })}
                      className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--ce-bg-card)", color: "var(--ce-text-muted)" }}>
                      <X size={13} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input value={step.title} onChange={(e) => { const next = [...formData.steps]; next[i] = { ...next[i], title: e.target.value }; setFormData({ ...formData, steps: next }); }}
                      placeholder="Step title" className="flex-1 px-3 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} />
                    <input value={step.time} onChange={(e) => { const next = [...formData.steps]; next[i] = { ...next[i], time: e.target.value }; setFormData({ ...formData, steps: next }); }}
                      placeholder="Time (e.g. 5 min)" className="w-36 px-3 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} />
                  </div>
                  <textarea rows={2} value={step.desc} onChange={(e) => { const next = [...formData.steps]; next[i] = { ...next[i], desc: e.target.value }; setFormData({ ...formData, steps: next }); }}
                    placeholder="Describe this step…" className="w-full px-3 py-2.5 rounded-xl outline-none text-sm resize-none" style={inputStyle} />
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFormData({ ...formData, steps: [...formData.steps, { title: "", time: "", desc: "" }] })}
              className="flex items-center gap-1.5 text-sm" style={{ color: "#FF8C42", fontWeight: 600 }}>
              <Plus size={14} /> Add Step
            </button>
          </div>

          {/* Notes */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Notes</h3>
            <div className="space-y-2">
              {formData.notes.map((note, i) => (
                <div key={i} className="flex gap-2">
                  <input value={note} onChange={(e) => { const next = [...formData.notes]; next[i] = e.target.value; setFormData({ ...formData, notes: next }); }}
                    placeholder="A helpful tip or note…" className="flex-1 px-3 py-2.5 rounded-xl outline-none text-sm" style={inputStyle} />
                  <button type="button" onClick={() => setFormData({ ...formData, notes: formData.notes.filter((_, j) => j !== i) })}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFormData({ ...formData, notes: [...formData.notes, ""] })}
              className="flex items-center gap-1.5 text-sm" style={{ color: "#FF8C42", fontWeight: 600 }}>
              <Plus size={14} /> Add Note
            </button>
          </div>
        </div>

        {/* ── Right column: meta, video, publish ── */}
        <div className="space-y-5">

          {/* Category, Difficulty, Servings, Times */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Settings</h3>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Difficulty</label>
              <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}>
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Servings</label>
              <input type="number" min="1" value={formData.servings} onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                className="w-full px-3 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }} />
            </div>

            {([["Prep Time", "prepTime", "e.g. 15 min"], ["Cook Time", "cookTime", "e.g. 30 min"]] as const).map(([label, field, placeholder]) => (
              <div key={field}>
                <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>{label}</label>
                <input value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  placeholder={placeholder} className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                  style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }} />
              </div>
            ))}
          </div>

          {/* Video */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Video Tutorial</h3>
            <input value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-2xl outline-none text-sm" style={inputStyle} />
          </div>

          {/* Publish / Draft */}
          <div className="flex flex-col gap-3 pb-6">
            <button type="button" onClick={(e) => handleSubmit(e, true)}
              className="w-full py-3 rounded-2xl text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}>
              Publish Now
            </button>
            <button type="submit"
              className="w-full py-3 rounded-2xl text-sm"
              style={{ backgroundColor: "var(--ce-text)", color: "var(--ce-bg)", fontWeight: 700 }}>
              Save as Draft
            </button>
          </div>
        </div>

      </div>
    </form>
  );
}
