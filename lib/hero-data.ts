export interface HeroSlide {
  id: string;
  image: string;
  label: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { id: "slide-1", image: "/images/recipes/creamy-penne-pasta.png",          label: "Comfort Food" },
  { id: "slide-2", image: "/images/recipes/dumplings-noodles.png",            label: "Asian Cuisine" },
  { id: "slide-3", image: "/images/recipes/chicken-pepper-pizza.png",         label: "American Classics" },
  { id: "slide-4", image: "/images/recipes/sorbet-fruit-milk-frappe.png",     label: "Drinks & Desserts" },
];
