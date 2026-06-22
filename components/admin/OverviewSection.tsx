import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import type { Recipe } from "@/components/RecipeCard";
import { ADMIN_STATS_CARDS, ADMIN_VIEWS_DATA, ADMIN_CATEGORY_CHART_DATA } from "@/lib/admin-data";

interface OverviewSectionProps {
  recipes: Recipe[];
}

export function OverviewSection({ recipes }: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_STATS_CARDS.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#f0fdf4", color: "#22c55e", fontWeight: 600 }}>
                {change}
              </span>
            </div>
            <div style={{ fontSize: "24px", color: "#5C4033", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#5C4033", fontWeight: 700, fontSize: "15px" }}>Monthly Views</h3>
            <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}>
              Last 6 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ADMIN_VIEWS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,64,51,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid rgba(92,64,51,0.1)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(92,64,51,0.1)" }}
                formatter={(v: number) => [`${v.toLocaleString()} views`, "Views"]}
              />
              <Line type="monotone" dataKey="views" stroke="#FF8C42" strokeWidth={2.5} dot={{ r: 4, fill: "#FFC72C", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
          <h3 className="mb-4" style={{ color: "#5C4033", fontWeight: 700, fontSize: "15px" }}>Recipes by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ADMIN_CATEGORY_CHART_DATA} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#8B6F47" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#8B6F47" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(92,64,51,0.1)" }} />
              <Bar dataKey="count" fill="#FFC72C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(92,64,51,0.07)" }}>
          <h3 style={{ color: "#5C4033", fontWeight: 700, fontSize: "15px" }}>Recent Recipes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#FAFAF8" }}>
                {["Recipe", "Category", "Difficulty", "Saves", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider" style={{ color: "#8B6F47", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recipes.slice(0, 8).map((r, i) => (
                <tr key={r.id} className="border-t" style={{ borderColor: "rgba(92,64,51,0.05)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={r.image} alt={r.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#5C4033" }}>{r.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#8B6F47" }}>{r.difficulty}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#5C4033", fontWeight: 600 }}>{r.saves?.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: i % 3 === 2 ? "#fff7ed" : "#f0fdf4", color: i % 3 === 2 ? "#f59e0b" : "#22c55e", fontWeight: 600 }}
                    >
                      {i % 3 === 2 ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg" style={{ color: "#8B6F47" }}>
                      <MoreVertical size={14} />
                    </button>
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
