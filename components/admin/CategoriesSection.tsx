"use client";

import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import type { AdminCategory } from "@/lib/admin-data";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PALETTE = ["#FFC72C", "#FF8C42", "#22c55e", "#6366f1", "#ef4444", "#ec4899", "#06b6d4", "#84cc16", "#f59e0b"];

interface CategoriesSectionProps {
  categories: AdminCategory[];
  onAdd: (category: AdminCategory) => void;
  onEdit: (slug: string, name: string) => void;
  onDelete: (slug: string) => void;
}

export function CategoriesSection({ categories, onAdd, onEdit, onDelete }: CategoriesSectionProps) {
  const [newCat, setNewCat] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<AdminCategory | null>(null);

  const addCategory = () => {
    if (!newCat.trim()) return;
    const slug = slugify(newCat);
    if (categories.some((c) => c.slug === slug)) {
      setNewCat("");
      return;
    }
    onAdd({ name: newCat.trim(), slug, count: 0, color: PALETTE[categories.length % PALETTE.length] });
    setNewCat("");
  };

  const startEdit = (cat: AdminCategory) => {
    setEditingSlug(cat.slug);
    setEditingName(cat.name);
  };

  const saveEdit = () => {
    if (editingSlug) onEdit(editingSlug, editingName.trim());
    setEditingSlug(null);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add category form */}
        <div className="p-5 rounded-2xl h-fit" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--ce-text)" }}>Add New Category</h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Category name…"
              className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
              style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
            />
            <button onClick={addCategory} className="px-5 py-2.5 rounded-xl text-sm" style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}>
              Add
            </button>
          </div>
        </div>

        {/* Category list */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <div className="px-5 py-4 border-b text-sm font-bold" style={{ color: "var(--ce-text)", borderColor: "var(--ce-border)" }}>
          All Categories ({categories.length})
        </div>
        <div className="divide-y" style={{ borderColor: "var(--ce-border)" }}>
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                {editingSlug === cat.slug ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="text-sm px-2 py-1 rounded-lg outline-none flex-1 max-w-full sm:max-w-[200px]"
                    style={{ border: "1.5px solid #FFC72C", color: "var(--ce-text)" }}
                  />
                ) : (
                  <span className="text-sm" style={{ color: "var(--ce-text)", fontWeight: 500 }}>{cat.name}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{cat.count} recipes</span>
                <div className="flex gap-1.5">
                  {editingSlug === cat.slug ? (
                    <>
                      <button onClick={saveEdit} className="p-1.5 rounded-lg" style={{ color: "#22c55e" }}><Check size={12} /></button>
                      <button onClick={() => setEditingSlug(null)} className="p-1.5 rounded-lg" style={{ color: "var(--ce-text-muted)" }}><X size={12} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg" style={{ color: "#FF8C42" }}><Edit2 size={12} /></button>
                      <button onClick={() => setDeletingCategory(cat)} className="p-1.5 rounded-lg" style={{ color: "#ef4444" }}><Trash2 size={12} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>{/* end category list */}
      </div>{/* end grid */}

      <ConfirmDeleteDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        itemLabel={deletingCategory?.name || "this category"}
        onConfirm={() => {
          if (deletingCategory) onDelete(deletingCategory.slug);
          setDeletingCategory(null);
        }}
      />
    </div>
  );
}
