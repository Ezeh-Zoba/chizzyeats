"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Edit2, Trash2 } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";
import { ADMIN_CATEGORIES } from "@/lib/admin-data";
import { RecipeEditDialog } from "@/components/admin/RecipeEditDialog";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";

interface RecipesSectionProps {
  recipes: Recipe[];
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export function RecipesSection({ recipes, onUpdateRecipe, onDeleteRecipe }: RecipesSectionProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All Categories" || r.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [recipes, search, categoryFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-sm" style={{ backgroundColor: "#fff", border: "1.5px solid rgba(92,64,51,0.1)" }}>
          <Search size={15} style={{ color: "#8B6F47" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "#fff", color: "#5C4033", border: "1px solid rgba(92,64,51,0.1)", fontFamily: "'Inter', sans-serif" }}
          >
            <option>All Categories</option>
            {ADMIN_CATEGORIES.map((c) => <option key={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#FAFAF8" }}>
                {["Recipe", "Category", "Time", "Saves", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider" style={{ color: "#8B6F47", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-orange-50 transition-colors" style={{ borderColor: "rgba(92,64,51,0.05)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={r.image} alt={r.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "#5C4033" }}>{r.title}</div>
                        <div className="text-xs" style={{ color: "#8B6F47" }}>by {r.author || "Chizzy"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#8B6F47" }}>{r.time}</td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#5C4033" }}>{r.saves?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditingRecipe(r)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#FF8C42" }} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setDeletingRecipe(r)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#ef4444" }} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecipeEditDialog
        recipe={editingRecipe}
        onOpenChange={(open) => !open && setEditingRecipe(null)}
        onSave={(recipe) => {
          onUpdateRecipe(recipe);
          setEditingRecipe(null);
        }}
      />

      <ConfirmDeleteDialog
        open={!!deletingRecipe}
        onOpenChange={(open) => !open && setDeletingRecipe(null)}
        itemLabel={deletingRecipe?.title || "this recipe"}
        onConfirm={() => {
          if (deletingRecipe) onDeleteRecipe(deletingRecipe.id);
          setDeletingRecipe(null);
        }}
      />
    </div>
  );
}
