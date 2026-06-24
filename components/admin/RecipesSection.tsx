"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";
import type { AdminCategory } from "@/lib/admin-data";
import { RecipeEditDialog } from "@/components/admin/RecipeEditDialog";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";

interface RecipesSectionProps {
  recipes: Recipe[];
  categories: AdminCategory[];
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onTogglePublish: (recipe: Recipe) => void;
}

export function RecipesSection({ recipes, categories, onUpdateRecipe, onDeleteRecipe, onTogglePublish }: RecipesSectionProps) {
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
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 max-w-full sm:max-w-sm" style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)" }}>
          <Search size={15} style={{ color: "var(--ce-text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="bg-transparent outline-none text-sm flex-1"
            style={{ color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "var(--ce-bg-card)", color: "var(--ce-text)", border: "1px solid var(--ce-border)", fontFamily: "'Inter', sans-serif" }}
          >
            <option>All Categories</option>
            {categories.map((c) => <option key={c.slug}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                {["Recipe", "Category", "Time", "Status", "Saves", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider" style={{ color: "var(--ce-text-muted)", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-orange-50 transition-colors" style={{ borderColor: "var(--ce-border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={r.image} alt={r.title} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: "var(--ce-text)" }}>{r.title}</div>
                        <div className="text-xs" style={{ color: "var(--ce-text-muted)" }}>by {r.author || "Chizzy"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ce-bg-surface)", color: "#FF8C42", fontWeight: 600 }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--ce-text-muted)" }}>{r.time}</td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={r.status === "published"
                        ? { backgroundColor: "#dcfce7", color: "#16a34a" }
                        : { backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}
                    >
                      {r.status === "published" ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: "var(--ce-text)" }}>{r.saves?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditingRecipe(r)} className="p-1.5 rounded-lg transition-colors" style={{ color: "#FF8C42" }} title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onTogglePublish(r)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: r.status === "published" ? "#22c55e" : "var(--ce-text-muted)" }}
                        title={r.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {r.status === "published" ? <Eye size={13} /> : <EyeOff size={13} />}
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
        categories={categories}
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
