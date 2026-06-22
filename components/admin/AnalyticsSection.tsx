import Image from "next/image";
import { Eye, Users, TrendingUp, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Recipe } from "@/components/RecipeCard";
import { ADMIN_VIEWS_DATA } from "@/lib/admin-data";

const SUMMARY_CARDS = [
  { label: "Page Views", value: "52.4K", sub: "this month", icon: Eye, color: "#FF8C42" },
  { label: "Unique Visitors", value: "31.2K", sub: "this month", icon: Users, color: "#6366f1" },
  { label: "Avg. Time on Page", value: "4:32", sub: "minutes", icon: TrendingUp, color: "#22c55e" },
  { label: "Bounce Rate", value: "28%", sub: "below average", icon: BarChart2, color: "#FFC72C" },
];

interface AnalyticsSectionProps {
  recipes: Recipe[];
}

export function AnalyticsSection({ recipes }: AnalyticsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ fontSize: "22px", color: "#5C4033", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>{label}</div>
            <div className="text-xs" style={{ color: "#22c55e" }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#5C4033" }}>Traffic Overview — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ADMIN_VIEWS_DATA} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(92,64,51,0.06)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8B6F47" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 16px rgba(92,64,51,0.1)" }} formatter={(v: number) => [`${v.toLocaleString()} views`]} />
            <Bar dataKey="views" fill="#FFC72C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#5C4033" }}>Top Performing Recipes</h3>
        <div className="space-y-3">
          {recipes.slice(0, 5).map((r, i) => (
            <div key={r.id} className="flex items-center gap-4">
              <span className="text-sm font-bold w-5" style={{ color: "#8B6F47" }}>{i + 1}</span>
              <div className="relative w-10 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={r.image} alt={r.title} fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: "#5C4033", fontWeight: 500 }}>{r.title}</div>
                <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: "rgba(92,64,51,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${100 - i * 15}%`, background: "linear-gradient(90deg, #FFC72C, #FF8C42)" }} />
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: "#5C4033" }}>
                {((r.saves || 1000) * (5 - i) * 0.4).toFixed(0)} views
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
