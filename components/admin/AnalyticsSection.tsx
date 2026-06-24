import Image from "next/image";
import { Utensils, MessageSquare, Users, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Recipe } from "@/components/RecipeCard";
import type { AdminCategory } from "@/lib/admin-data";

interface AnalyticsSectionProps {
  recipes: Recipe[];
  categories: AdminCategory[];
  commentCount: number;
  subscriberCount: number;
}

export function AnalyticsSection({ recipes, categories, commentCount, subscriberCount }: AnalyticsSectionProps) {
  const avgRating = recipes.length
    ? (recipes.reduce((sum, r) => sum + (r.rating || 0), 0) / recipes.length).toFixed(2)
    : "0.00";

  const summaryCards = [
    { label: "Total Recipes", value: String(recipes.length), icon: Utensils, color: "#FFC72C" },
    { label: "Total Comments", value: String(commentCount), icon: MessageSquare, color: "#FF8C42" },
    { label: "Subscribers", value: String(subscriberCount), icon: Users, color: "#6366f1" },
    { label: "Avg. Rating", value: avgRating, icon: Star, color: "#22c55e" },
  ];

  const categoryChartData = categories.map((c) => ({ name: c.name, count: c.count })).sort((a, b) => b.count - a.count);
  const topRecipes = [...recipes].sort((a, b) => (b.saves || 0) - (a.saves || 0)).slice(0, 5);
  const maxSaves = Math.max(1, ...topRecipes.map((r) => r.saves || 0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ fontSize: "22px", color: "var(--ce-text)", fontWeight: 800, fontFamily: "'Dancing Script', cursive" }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--ce-text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--ce-text)" }}>Recipes by Category</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={categoryChartData} margin={{ left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(92,64,51,0.1)" }} />
            <Bar dataKey="count" fill="#FFC72C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--ce-text)" }}>Top Performing Recipes</h3>
        <div className="space-y-3">
          {topRecipes.map((r, i) => (
            <div key={r.id} className="flex items-center gap-4">
              <span className="text-sm font-bold w-5" style={{ color: "var(--ce-text-muted)" }}>{i + 1}</span>
              <div className="relative w-10 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={r.image} alt={r.title} fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: "var(--ce-text)", fontWeight: 500 }}>{r.title}</div>
                <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: "var(--ce-border)" }}>
                  <div className="h-full rounded-full" style={{ width: `${((r.saves || 0) / maxSaves) * 100}%`, background: "linear-gradient(90deg, #FFC72C, #FF8C42)" }} />
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--ce-text)" }}>
                {(r.saves || 0).toLocaleString()} saves
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
