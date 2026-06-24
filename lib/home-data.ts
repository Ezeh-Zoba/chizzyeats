import type { IconType } from "react-icons";
import { GiNoodles, GiCroissant, GiHamburger, GiCakeSlice, GiSodaCan, GiMoneyStack, GiAfrica, GiCookingPot } from "react-icons/gi";
import { PiLightningFill } from "react-icons/pi";

export interface HomeCategory {
  label: string;
  icon: string | IconType;
  href: string;
  color: string;
  bg: string;
}

// Per-category recipe counts are computed live from Firestore in
// CategoryGrid.tsx — this just defines which categories show up and how.
export const HOME_CATEGORIES: HomeCategory[] = [
  { label: "Nigerian", icon: GiCookingPot, href: "/category/nigerian", color: "#FFC72C", bg: "#FFF8E7" },
  { label: "African", icon: GiAfrica, href: "/category/african", color: "#FF8C42", bg: "#FFF3EB" },
  { label: "Asian", icon: GiNoodles, href: "/category/asian", color: "#22c55e", bg: "#f0fdf4" },
  { label: "European", icon: GiCroissant, href: "/category/european", color: "#6366f1", bg: "#f0f0fe" },
  { label: "American", icon: GiHamburger, href: "/category/american", color: "#ef4444", bg: "#fef2f2" },
  { label: "Desserts", icon: GiCakeSlice, href: "/category/desserts", color: "#ec4899", bg: "#fdf2f8" },
  { label: "Drinks", icon: GiSodaCan, href: "/category/drinks", color: "#06b6d4", bg: "#f0fdff" },
  { label: "Budget Meals", icon: GiMoneyStack, href: "/category/budget", color: "#84cc16", bg: "#f7fee7" },
  { label: "Quick Meals", icon: PiLightningFill, href: "/category/quick", color: "#f59e0b", bg: "#fffbeb" },
];
