"use client";

import { useEffect, useState } from "react";
import { collection, doc, getCountFromServer, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { CUISINE_SLUGS } from "@/lib/category-data";

export interface HomeStat {
  value: string;
  label: string;
}

const EMPTY_STATS: HomeStat[] = [
  { value: "—", label: "Recipes" },
  { value: "—", label: "Avg Rating" },
  { value: "—", label: "Cuisines" },
  { value: "—", label: "Subscribers" },
];

export function useHomeStats() {
  const [stats, setStats] = useState<HomeStat[]>(EMPTY_STATS);

  useEffect(() => {
    let active = true;

    async function load() {
      const publishedRecipes = query(collection(db, "recipes"), where("status", "==", "published"));
      const [recipesSnap, recipeCountSnap, siteConfigSnap] = await Promise.all([
        getDocs(publishedRecipes),
        getCountFromServer(publishedRecipes),
        getDoc(doc(db, "siteConfig", "main")),
      ]);

      if (!active) return;

      const ratings = recipesSnap.docs.map((d) => d.data().rating as number | undefined).filter((r): r is number => !!r);
      const avgRating = ratings.length ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : "—";
      const subscriberCount = (siteConfigSnap.data()?.subscriberCount as number) || 0;
      const cuisineCount = new Set(
        recipesSnap.docs
          .map((d) => d.data().categorySlug as string | undefined)
          .filter((slug): slug is string => !!slug && CUISINE_SLUGS.includes(slug))
      ).size;

      setStats([
        { value: `${recipeCountSnap.data().count}+`, label: "Recipes" },
        { value: avgRating, label: "Avg Rating" },
        { value: String(cuisineCount), label: "Cuisines" },
        { value: subscriberCount > 0 ? `${subscriberCount}+` : "0", label: "Subscribers" },
      ]);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return stats;
}
