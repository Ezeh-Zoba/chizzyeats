import type { IconType } from "react-icons";
import { GiNoodles, GiCroissant, GiHamburger, GiCakeSlice, GiSodaCan, GiMoneyStack } from "react-icons/gi";
import { PiLightningFill } from "react-icons/pi";

export interface CategoryMeta {
  label: string;
  title: string;
  description: string;
  banner: string;
  icon: string | IconType;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  nigerian: {
    label: "Nigerian",
    title: "Nigerian Recipes",
    description: "Authentic Nigerian dishes passed down through generations — jollof rice, egusi soup, suya, puff puff, and so much more.",
    banner: "/images/recipes/creamy-penne-pasta.png",
    icon: "🇳🇬",
  },
  african: {
    label: "African",
    title: "African Dishes",
    description: "Vibrant flavours from across the African continent — Ghanaian, Kenyan, Ethiopian, and beyond.",
    banner: "/images/recipes/dumplings-noodles-boiled.png",
    icon: "🌍",
  },
  asian: {
    label: "Asian",
    title: "Asian Cuisine",
    description: "From Thai curries to Japanese ramen, explore the rich tapestry of Asian flavours.",
    banner: "/images/recipes/dumplings-noodles.png",
    icon: GiNoodles,
  },
  desserts: {
    label: "Desserts",
    title: "Desserts & Sweets",
    description: "Life is short — eat dessert first. Cakes, pastries, puddings, and every sweet thing in between.",
    banner: "/images/recipes/korean-hotteok.png",
    icon: GiCakeSlice,
  },
  drinks: {
    label: "Drinks",
    title: "Drinks & Beverages",
    description: "Refreshing smoothies, cocktails, zobo, kunu, and every sip-worthy creation.",
    banner: "/images/recipes/boba-milk-tea.png",
    icon: GiSodaCan,
  },
  european: {
    label: "European",
    title: "European Cuisine",
    description: "Classic French, Italian, Spanish, and British recipes with a Chizzy Eats twist.",
    banner: "/images/recipes/creamy-penne-pasta.png",
    icon: GiCroissant,
  },
  american: {
    label: "American",
    title: "American Classics",
    description: "Comfort food done right — burgers, BBQ, mac & cheese, and hearty grain bowls.",
    banner: "/images/recipes/chicken-sandwich.png",
    icon: GiHamburger,
  },
  budget: {
    label: "Budget Meals",
    title: "Budget Meals",
    description: "Delicious meals that won't break the bank. Proof that great food doesn't need to cost a fortune.",
    banner: "/images/recipes/coconut-pancakes.png",
    icon: GiMoneyStack,
  },
  quick: {
    label: "Quick Meals",
    title: "Quick Meals",
    description: "Ready in 30 minutes or less. Because good food shouldn't take all day.",
    banner: "/images/recipes/chicken-pepper-pizza.png",
    icon: PiLightningFill,
  },
};

// The region/country categories — distinct from type tags like Desserts,
// Drinks, Budget Meals, Quick Meals (mirrors Navbar's "By Region" group).
export const CUISINE_SLUGS = ["nigerian", "african", "asian", "european", "american"];

export const SUBCATEGORY_TABS = ["All", "Main Dishes", "Desserts", "Drinks", "Quick"];
export const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
export const SORT_OPTIONS = ["Newest", "Most Popular", "Quickest", "Highest Rated"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
