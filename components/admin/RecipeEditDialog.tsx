"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Recipe, RecipeIngredient, RecipeStep } from "@/components/RecipeCard";
import type { AdminCategory } from "@/lib/admin-data";

interface RecipeEditDialogProps {
  recipe: Recipe | null;
  categories: AdminCategory[];
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Recipe) => void;
}

const inputStyle = { backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" };
const labelStyle = { color: "var(--ce-text)", fontWeight: 600 } as const;

export function RecipeEditDialog({ recipe, categories, onOpenChange, onSave }: RecipeEditDialogProps) {
  const [form, setForm] = useState<Recipe | null>(recipe);

  useEffect(() => setForm(recipe), [recipe]);

  if (!form) return null;

  const ingredients = form.ingredients ?? [];
  const steps = form.steps ?? [];
  const notes = form.notes ?? [];

  const updateIngredients = (next: RecipeIngredient[]) => setForm({ ...form, ingredients: next });
  const updateSteps = (next: RecipeStep[]) => setForm({ ...form, steps: next });
  const updateNotes = (next: string[]) => setForm({ ...form, notes: next });

  return (
    <Dialog open={!!recipe} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Dancing Script', cursive", color: "var(--ce-text)" }}>Edit Recipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
              >
                {["Easy", "Medium", "Hard"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Time</label>
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Excerpt</label>
            <textarea
              rows={3}
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm resize-none"
              style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Video Tutorial Link (optional)</label>
            <input
              value={form.videoUrl || ""}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Ingredients</label>
            <div className="space-y-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={ing.amount}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[i] = { ...next[i], amount: e.target.value };
                      updateIngredients(next);
                    }}
                    placeholder="Amount"
                    className="w-28 px-3 py-2 rounded-xl outline-none text-sm"
                    style={inputStyle}
                  />
                  <input
                    value={ing.item}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[i] = { ...next[i], item: e.target.value };
                      updateIngredients(next);
                    }}
                    placeholder="Ingredient"
                    className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => updateIngredients(ingredients.filter((_, j) => j !== i))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateIngredients([...ingredients, { amount: "", item: "" }])}
              className="mt-2 flex items-center gap-1.5 text-sm"
              style={{ color: "#FF8C42", fontWeight: 600 }}
            >
              <Plus size={14} /> Add Ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Steps</label>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="p-3 rounded-2xl space-y-2" style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ce-bg-surface)", color: "#FF8C42", fontWeight: 700 }}>
                      Step {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateSteps(steps.filter((_, j) => j !== i).map((s, j) => ({ ...s, step: j + 1 })))}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={step.title}
                      onChange={(e) => {
                        const next = [...steps];
                        next[i] = { ...next[i], title: e.target.value };
                        updateSteps(next);
                      }}
                      placeholder="Step title"
                      className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    />
                    <input
                      value={step.time || ""}
                      onChange={(e) => {
                        const next = [...steps];
                        next[i] = { ...next[i], time: e.target.value };
                        updateSteps(next);
                      }}
                      placeholder="Time (e.g. 5 min)"
                      className="w-36 px-3 py-2 rounded-xl outline-none text-sm"
                      style={inputStyle}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={step.desc}
                    onChange={(e) => {
                      const next = [...steps];
                      next[i] = { ...next[i], desc: e.target.value };
                      updateSteps(next);
                    }}
                    placeholder="Describe this step…"
                    className="w-full px-3 py-2 rounded-xl outline-none text-sm resize-none"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateSteps([...steps, { step: steps.length + 1, title: "", time: "", desc: "" }])}
              className="mt-2 flex items-center gap-1.5 text-sm"
              style={{ color: "#FF8C42", fontWeight: 600 }}
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Notes</label>
            <div className="space-y-2">
              {notes.map((note, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={note}
                    onChange={(e) => {
                      const next = [...notes];
                      next[i] = e.target.value;
                      updateNotes(next);
                    }}
                    placeholder="A helpful tip or note…"
                    className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => updateNotes(notes.filter((_, j) => j !== i))}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => updateNotes([...notes, ""])}
              className="mt-2 flex items-center gap-1.5 text-sm"
              style={{ color: "#FF8C42", fontWeight: 600 }}
            >
              <Plus size={14} /> Add Note
            </button>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onSave(form)}
            className="w-full py-2.5 rounded-xl text-sm"
            style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
