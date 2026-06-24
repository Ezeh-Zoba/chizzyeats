import type { Timestamp } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Utensils, Search, Star, Eye, Lightbulb, Tv, Salad, FlaskConical, Heart, Microscope } from "lucide-react";

export type BlogPostType =
  | "story"
  | "experience"
  | "find"
  | "rating"
  | "teaser"
  | "insight"
  | "from-the-screen";

export type InsightIcon = "nutrition" | "science" | "health" | "research";
export type RatingType = "restaurant" | "product" | "show" | "ingredient";
export type SourceType = "original" | "restaurant" | "tv-show" | "other-creator" | "brand";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "image"; url: string; caption?: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "insight"; text: string; source: string; sourceUrl: string; icon: InsightIcon }
  | { type: "rating"; name: string; rating: number; notes?: string; ratingType: RatingType }
  | { type: "link-card"; title: string; description?: string; url: string; image?: string }
  | { type: "divider" };

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  postType: BlogPostType;
  tags: string[];
  source?: {
    type: SourceType;
    name: string;
    url?: string;
  };
  content: ContentBlock[];
  author: string;
  status: "draft" | "published";
  featured: boolean;
  includeInNewsletter: boolean;
  readTime?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;
}

export interface BlogPostTypeMeta {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const BLOG_POST_TYPES: Record<BlogPostType, BlogPostTypeMeta> = {
  story:            { label: "Story",           color: "#FFC72C", icon: BookOpen },
  experience:       { label: "Experience",       color: "#FF8C42", icon: Utensils },
  find:             { label: "New Find",         color: "#22c55e", icon: Search },
  rating:           { label: "Rating",           color: "#6366f1", icon: Star },
  teaser:           { label: "Teaser",           color: "#ec4899", icon: Eye },
  insight:          { label: "Insight",          color: "#06b6d4", icon: Lightbulb },
  "from-the-screen":{ label: "From the Screen",  color: "#f59e0b", icon: Tv },
};

export const INSIGHT_ICONS: Record<InsightIcon, LucideIcon> = {
  nutrition: Salad,
  science:   FlaskConical,
  health:    Heart,
  research:  Microscope,
};

export const RATING_TYPE_LABELS: Record<RatingType, string> = {
  restaurant: "Restaurant",
  product:    "Product",
  show:       "TV Show / Film",
  ingredient: "Ingredient",
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  original:       "Original content",
  restaurant:     "Restaurant",
  "tv-show":      "TV Show / Film",
  "other-creator":"Other Creator",
  brand:          "Brand / Product",
};

export interface CreateBlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  postType: BlogPostType;
  tags: string;
  sourceType: SourceType | "";
  sourceName: string;
  sourceUrl: string;
  author: string;
  featured: boolean;
  includeInNewsletter: boolean;
  content: ContentBlock[];
}

export const EMPTY_BLOG_FORM: CreateBlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  postType: "story",
  tags: "",
  sourceType: "",
  sourceName: "",
  sourceUrl: "",
  author: "Chizzy",
  featured: false,
  includeInNewsletter: false,
  content: [],
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function estimateReadTime(content: ContentBlock[]): number {
  const words = content.reduce((count, block) => {
    if (block.type === "paragraph") return count + block.text.split(/\s+/).length;
    if (block.type === "heading") return count + block.text.split(/\s+/).length;
    if (block.type === "quote") return count + block.text.split(/\s+/).length;
    if (block.type === "insight") return count + block.text.split(/\s+/).length;
    if (block.type === "rating") return count + (block.notes?.split(/\s+/).length ?? 0);
    return count;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}
