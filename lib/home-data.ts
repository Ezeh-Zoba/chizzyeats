import type { IconType } from "react-icons";
import { GiNoodles, GiCroissant, GiHamburger, GiCakeSlice, GiSodaCan, GiMoneyStack, GiAfrica, GiCookingPot } from "react-icons/gi";
import { PiLightningFill } from "react-icons/pi";
import { Utensils, Star, Globe, TrendingUp } from "lucide-react";

export interface HomeCategory {
  label: string;
  icon: string | IconType;
  href: string;
  color: string;
  bg: string;
  count: number;
}

export const HOME_CATEGORIES: HomeCategory[] = [
  { label: "Nigerian", icon: GiCookingPot, href: "/category/nigerian", color: "#FFC72C", bg: "#FFF8E7", count: 48 },
  { label: "African", icon: GiAfrica, href: "/category/african", color: "#FF8C42", bg: "#FFF3EB", count: 32 },
  { label: "Asian", icon: GiNoodles, href: "/category/asian", color: "#22c55e", bg: "#f0fdf4", count: 27 },
  { label: "European", icon: GiCroissant, href: "/category/european", color: "#6366f1", bg: "#f0f0fe", count: 19 },
  { label: "American", icon: GiHamburger, href: "/category/american", color: "#ef4444", bg: "#fef2f2", count: 23 },
  { label: "Desserts", icon: GiCakeSlice, href: "/category/desserts", color: "#ec4899", bg: "#fdf2f8", count: 41 },
  { label: "Drinks", icon: GiSodaCan, href: "/category/drinks", color: "#06b6d4", bg: "#f0fdff", count: 15 },
  { label: "Budget Meals", icon: GiMoneyStack, href: "/category/budget", color: "#84cc16", bg: "#f7fee7", count: 36 },
  { label: "Quick Meals", icon: PiLightningFill, href: "/category/quick", color: "#f59e0b", bg: "#fffbeb", count: 29 },
];

export const HOME_STATS = [
  { icon: Utensils, value: "270+", label: "Recipes" },
  { icon: Star, value: "4.9", label: "Avg Rating" },
  { icon: Globe, value: "9", label: "Cuisines" },
  { icon: TrendingUp, value: "50K+", label: "Monthly Readers" },
];
