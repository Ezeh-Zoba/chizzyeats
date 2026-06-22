"use client";

import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { ADMIN_CATEGORIES, type AdminCategory } from "@/lib/admin-data";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PALETTE = ["#FFC72C", "#FF8C42", "#22c55e", "#6366f1", "#ef4444", "#ec4899", "#06b6d4", "#84cc16", "#f59e0b"];

export function CategoriesSection() {
  const [categories, setCategories] = useState(ADMIN_CATEGORIES);
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
    setCategories([...categories, { name: newCat.trim(), slug, count: 0, color: PALETTE[categories.length % PALETTE.length] }]);
    setNewCat("");
  };

  const startEdit = (cat: AdminCategory) => {
    setEditingSlug(cat.slug);
    setEditingName(cat.name);
  };

  const saveEdit = () => {
    setCategories(categories.map((c) => (c.slug === editingSlug ? { ...c, name: editingName.trim() || c.name } : c)));
    setEditingSlug(null);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#5C4033" }}>Add New Category</h3>
        <div className="flex gap-3">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name…"
            className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "#FAFAF8", border: "1.5px solid rgba(92,64,51,0.1)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
          />
          <button onClick={addCategory} className="px-5 py-2.5 rounded-xl text-sm" style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}>
            Add
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <div className="px-5 py-4 border-b text-sm font-bold" style={{ color: "#5C4033", borderColor: "rgba(92,64,51,0.07)" }}>
          All Categories ({categories.length})
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(92,64,51,0.05)" }}>
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
                    className="text-sm px-2 py-1 rounded-lg outline-none flex-1 max-w-[200px]"
                    style={{ border: "1.5px solid #FFC72C", color: "#5C4033" }}
                  />
                ) : (
                  <span className="text-sm" style={{ color: "#5C4033", fontWeight: 500 }}>{cat.name}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs" style={{ color: "#8B6F47" }}>{cat.count} recipes</span>
                <div className="flex gap-1.5">
                  {editingSlug === cat.slug ? (
                    <>
                      <button onClick={saveEdit} className="p-1.5 rounded-lg" style={{ color: "#22c55e" }}><Check size={12} /></button>
                      <button onClick={() => setEditingSlug(null)} className="p-1.5 rounded-lg" style={{ color: "#8B6F47" }}><X size={12} /></button>
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
      </div>

      <ConfirmDeleteDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        itemLabel={deletingCategory?.name || "this category"}
        onConfirm={() => {
          setCategories(categories.filter((c) => c.slug !== deletingCategory?.slug));
          setDeletingCategory(null);
        }}
      />
    </div>
  );
}
