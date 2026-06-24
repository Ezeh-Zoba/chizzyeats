"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { BlogPost, BlogPostType } from "@/lib/blog-data";

interface UseBlogPostsOptions {
  postType?: BlogPostType;
  limit?: number;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const constraints = [
      where("status", "==", "published"),
      ...(options.postType ? [where("postType", "==", options.postType)] : []),
      orderBy("publishedAt", "desc"),
    ];
    getDocs(query(collection(db, "blogPosts"), ...constraints))
      .then((snap) => {
        if (!active) return;
        let result = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
        if (options.limit) result = result.slice(0, options.limit);
        setPosts(result);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.postType]);

  return { posts, loading };
}
