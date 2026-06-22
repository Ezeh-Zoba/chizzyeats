import { LayoutDashboard, Utensils, MessageSquare, Tag, BarChart2, Settings, Plus, Eye, Users, Star } from "lucide-react";

export const ADMIN_SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Utensils, label: "Recipes", id: "recipes" },
  { icon: Plus, label: "Create Recipe", id: "create" },
  { icon: MessageSquare, label: "Comments", id: "comments" },
  { icon: Tag, label: "Categories", id: "categories" },
  { icon: BarChart2, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export const ADMIN_STATS_CARDS = [
  { label: "Total Recipes", value: "274", change: "+12", icon: Utensils, color: "#FFC72C" },
  { label: "Monthly Views", value: "52.4K", change: "+18%", icon: Eye, color: "#FF8C42" },
  { label: "Subscribers", value: "25.1K", change: "+340", icon: Users, color: "#22c55e" },
  { label: "Avg. Rating", value: "4.87", change: "+0.1", icon: Star, color: "#6366f1" },
];

export const ADMIN_VIEWS_DATA = [
  { month: "Jan", views: 28000 },
  { month: "Feb", views: 32000 },
  { month: "Mar", views: 38000 },
  { month: "Apr", views: 35000 },
  { month: "May", views: 44000 },
  { month: "Jun", views: 52400 },
];

export const ADMIN_CATEGORY_CHART_DATA = [
  { name: "Nigerian", count: 48 },
  { name: "Desserts", count: 41 },
  { name: "Budget", count: 36 },
  { name: "African", count: 32 },
  { name: "Quick", count: 29 },
  { name: "Asian", count: 27 },
  { name: "American", count: 23 },
];

export interface AdminComment {
  id: number;
  author: string;
  recipe: string;
  text: string;
  time: string;
  status: "pending" | "approved" | "spam";
}

export const ADMIN_COMMENTS: AdminComment[] = [
  { id: 1, author: "Amaka S.", recipe: "Jollof Rice", text: "This recipe is spot on! Made it for a party and everyone asked for the recipe. Thank you Chizzy!", time: "2h ago", status: "pending" },
  { id: 2, author: "Funke A.", recipe: "Egusi Soup", text: "I've been looking for a proper egusi recipe for ages. This one is perfect!", time: "4h ago", status: "approved" },
  { id: 3, author: "John M.", recipe: "Chocolate Cake", text: "Made this for my wife's birthday. She absolutely loved it!", time: "6h ago", status: "approved" },
  { id: 4, author: "Sarah K.", recipe: "Salmon", text: "Quick question — can I use frozen salmon instead of fresh?", time: "8h ago", status: "pending" },
];

export interface AdminCategory {
  name: string;
  slug: string;
  count: number;
  color: string;
}

export const ADMIN_CATEGORIES: AdminCategory[] = [
  { name: "Nigerian", slug: "nigerian", count: 48, color: "#FFC72C" },
  { name: "African", slug: "african", count: 32, color: "#FF8C42" },
  { name: "Asian", slug: "asian", count: 27, color: "#22c55e" },
  { name: "European", slug: "european", count: 19, color: "#6366f1" },
  { name: "American", slug: "american", count: 23, color: "#ef4444" },
  { name: "Desserts", slug: "desserts", count: 41, color: "#ec4899" },
  { name: "Drinks", slug: "drinks", count: 15, color: "#06b6d4" },
  { name: "Budget Meals", slug: "budget", count: 36, color: "#84cc16" },
  { name: "Quick Meals", slug: "quick", count: 29, color: "#f59e0b" },
];

export interface CreateRecipeFormData {
  title: string;
  category: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  excerpt: string;
  content: string;
}

export const EMPTY_RECIPE_FORM: CreateRecipeFormData = {
  title: "", category: "nigerian", difficulty: "Easy",
  prepTime: "", cookTime: "", servings: "4", excerpt: "", content: "",
};
