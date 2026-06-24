import { LayoutDashboard, Utensils, MessageSquare, Tag, BarChart2, Settings, Plus, Mail, BookOpen, PenLine } from "lucide-react";

export const ADMIN_SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Utensils, label: "Recipes", id: "recipes" },
  { icon: Plus, label: "Create Recipe", id: "create" },
  { icon: MessageSquare, label: "Comments", id: "comments" },
  { icon: Mail, label: "Messages", id: "messages" },
  { icon: Tag, label: "Categories", id: "categories" },
  { icon: BookOpen, label: "Blog", id: "blog" },
  { icon: PenLine, label: "Write Post", id: "create-blog" },
  { icon: BarChart2, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
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

export interface RecipeFormIngredient {
  amount: string;
  item: string;
}

export interface RecipeFormStep {
  title: string;
  time: string;
  desc: string;
}

export interface CreateRecipeFormData {
  title: string;
  category: string;
  difficulty: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  excerpt: string;
  ingredients: RecipeFormIngredient[];
  steps: RecipeFormStep[];
  notes: string[];
  videoUrl: string;
}

export const EMPTY_RECIPE_FORM: CreateRecipeFormData = {
  title: "", category: "nigerian", difficulty: "Easy",
  prepTime: "", cookTime: "", servings: "4", excerpt: "",
  ingredients: [{ amount: "", item: "" }],
  steps: [{ title: "", time: "", desc: "" }],
  notes: [],
  videoUrl: "",
};
