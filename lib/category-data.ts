import type { IconType } from "react-icons";
import { GiNoodles, GiCroissant, GiHamburger, GiCakeSlice, GiSodaCan, GiMoneyStack } from "react-icons/gi";
import { PiLightningFill } from "react-icons/pi";

export interface CategoryMeta {
  title: string;
  description: string;
  banner: string;
  icon: string | IconType;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  nigerian: {
    title: "Nigerian Recipes",
    description: "Authentic Nigerian dishes passed down through generations — jollof rice, egusi soup, suya, puff puff, and so much more.",
    banner: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwc3RldyUyMHNvdXAlMjBib3dsJTIwZm9vZHxlbnwxfHx8fDE3ODIwNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "🇳🇬",
  },
  african: {
    title: "African Dishes",
    description: "Vibrant flavours from across the African continent — Ghanaian, Kenyan, Ethiopian, and beyond.",
    banner: "https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBoZXJvJTIwZ291cm1ldCUyMG1lYWx8ZW58MXx8fHwxNzgyMDY3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "🌍",
  },
  asian: {
    title: "Asian Cuisine",
    description: "From Thai curries to Japanese ramen, explore the rich tapestry of Asian flavours.",
    banner: "https://images.unsplash.com/photo-1552166539-ade937e98ed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmb29kJTIwcGhvdG9ncmFwaHklMjBoZXJvJTIwZ291cm1ldCUyMG1lYWx8ZW58MXx8fHwxNzgyMDY3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiNoodles,
  },
  desserts: {
    title: "Desserts & Sweets",
    description: "Life is short — eat dessert first. Cakes, pastries, puddings, and every sweet thing in between.",
    banner: "https://images.unsplash.com/photo-1514056052883-d017fddd0426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0cyUyMHBhc3RyaWVzJTIwY2FrZXMlMjBmb29kJTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzgyMDY3NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiCakeSlice,
  },
  drinks: {
    title: "Drinks & Beverages",
    description: "Refreshing smoothies, cocktails, zobo, kunu, and every sip-worthy creation.",
    banner: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rJTIwc21vb3RoaWUlMjJiZXZlcmFnZXxlbnwxfHx8fDE3ODIwNjc1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiSodaCan,
  },
  european: {
    title: "European Cuisine",
    description: "Classic French, Italian, Spanish, and British recipes with a Chizzy's Eats twist.",
    banner: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmb29kJTIwcGhvdG9ncmFwaHklMjBoZXJvJTIwZ291cm1ldCUyMG1lYWx8ZW58MXx8fHwxNzgyMDY3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiCroissant,
  },
  american: {
    title: "American Classics",
    description: "Comfort food done right — burgers, BBQ, mac & cheese, and hearty grain bowls.",
    banner: "https://images.unsplash.com/photo-1674649203068-e9fd9c4a5620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmb29kJTIwcGhvdG9ncmFwaHklMjBoZXJvJTIwZ291cm1ldCUyMG1lYWx8ZW58MXx8fHwxNzgyMDY3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiHamburger,
  },
  budget: {
    title: "Budget Meals",
    description: "Delicious meals that won't break the bank. Proof that great food doesn't need to cost a fortune.",
    banner: "https://images.unsplash.com/photo-1591189863430-ab87e120f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxyZWNpcGUlMjBjb29raW5nJTIwa2l0Y2hlbiUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc4MjA2NzQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: GiMoneyStack,
  },
  quick: {
    title: "Quick Meals",
    description: "Ready in 30 minutes or less. Because good food shouldn't take all day.",
    banner: "https://images.unsplash.com/photo-1579150877125-53b49ce88315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxyZWNpcGUlMjBjb29raW5nJTIwa2l0Y2hlbiUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc4MjA2NzQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: PiLightningFill,
  },
};

export const SUBCATEGORY_TABS = ["All", "Main Dishes", "Desserts", "Drinks", "Quick"];
export const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
export const SORT_OPTIONS = ["Newest", "Most Popular", "Quickest", "Highest Rated"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
