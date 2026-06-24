import Image from "next/image";
import { MoreVertical, Utensils, MessageSquare, Users, Star, Pencil, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Recipe } from "@/components/RecipeCard";
import type { AdminCategory } from "@/lib/admin-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OverviewSectionProps {
  recipes: Recipe[];
  categories: AdminCategory[];
  commentCount: number;
  subscriberCount: number;
  onEditRecipe?: (id: string) => void;
  onDeleteRecipe?: (id: string) => void;
}

export function OverviewSection({ recipes, categories, commentCount, subscriberCount, onEditRecipe, onDeleteRecipe }: OverviewSectionProps) {
  const avgRating = recipes.length
    ? (recipes.reduce((sum, r) => sum + (r.rating || 0), 0) / recipes.length).toFixed(2)
    : "0.00";
  const statsCards = [
    { label: "Total Recipes", value: String(recipes.length), icon: Utensils, color: "#FFC72C" },
    { label: "Total Comments", value: String(commentCount), icon: MessageSquare, color: "#FF8C42" },
    { label: "Subscribers", value: String(subscriberCount), icon: Users, color: "#22c55e" },
    { label: "Avg. Rating", value: avgRating, icon: Star, color: "#6366f1" },
  ];
  const categoryChartData = categories.map((c) => ({ name: c.name, count: c.count })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize: "24px", color: "var(--ce-text)", fontWeight: 800, fontFamily: "'Dancing Script', cursive" }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--ce-text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="mb-4" style={{ color: "var(--ce-text)", fontWeight: 700, fontSize: "15px" }}>Recipes by Category</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categoryChartData} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: "var(--ce-text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "var(--ce-text-muted)" }} axisLine={false} tickLine={false} width={70} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px var(--ce-shadow-elevated)" }} />
            <Bar dataKey="count" fill="#FFC72C" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--ce-border)" }}>
          <h3 style={{ color: "var(--ce-text)", fontWeight: 700, fontSize: "15px" }}>Recent Recipes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                {["Recipe", "Category", "Difficulty", "Saves", "Status", ""].map((h) => (
                  <th key={h} className="px-3 sm:px-5 py-2.5 sm:py-3 text-left text-xs uppercase tracking-wider" style={{ color: "var(--ce-text-muted)", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recipes.slice(0, 8).map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: "var(--ce-border)" }}>
                  <td className="px-3 sm:px-5 py-2.5 sm:py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={r.image} alt={r.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: "var(--ce-text)" }}>{r.title}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-5 py-2.5 sm:py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ce-bg-surface)", color: "#FF8C42", fontWeight: 600 }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--ce-text-muted)" }}>{r.difficulty}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--ce-text)", fontWeight: 600 }}>{r.saves?.toLocaleString()}</td>
                  <td className="px-3 sm:px-5 py-2.5 sm:py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: r.status === "draft" ? "#fff7ed" : "#f0fdf4",
                        color: r.status === "draft" ? "#f59e0b" : "#22c55e",
                        fontWeight: 600,
                      }}
                    >
                      {r.status === "draft" ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-2.5 sm:py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg" style={{ color: "var(--ce-text-muted)" }}>
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditRecipe?.(r.id)}>
                          <Pencil size={14} className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteRecipe?.(r.id)} className="text-red-600">
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
