"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Recipe } from "@/components/RecipeCard";
import { ADMIN_CATEGORIES } from "@/lib/admin-data";

interface RecipeEditDialogProps {
  recipe: Recipe | null;
  onOpenChange: (open: boolean) => void;
  onSave: (recipe: Recipe) => void;
}

export function RecipeEditDialog({ recipe, onOpenChange, onSave }: RecipeEditDialogProps) {
  const [form, setForm] = useState<Recipe | null>(recipe);

  useEffect(() => setForm(recipe), [recipe]);

  if (!form) return null;

  return (
    <Dialog open={!!recipe} onOpenChange={onOpenChange}>
      <DialogContent style={{ fontFamily: "'Inter', sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Playfair Display', serif", color: "#5C4033" }}>Edit Recipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
              >
                {ADMIN_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
              >
                {["Easy", "Medium", "Hard"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Time</label>
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "#5C4033", fontWeight: 600 }}>Excerpt</label>
            <textarea
              rows={3}
              value={form.excerpt || ""}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm resize-none"
              style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.15)", color: "#5C4033" }}
            />
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
