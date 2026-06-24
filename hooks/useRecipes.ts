"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Recipe } from "@/components/RecipeCard";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const q = query(collection(db, "recipes"), where("status", "==", "published"));
    getDocs(q)
      .then((snapshot) => {
        if (!active) return;
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe);
        setRecipes(docs.filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i));
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { recipes, loading };
}
