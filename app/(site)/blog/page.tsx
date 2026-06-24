"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BLOG_POST_TYPES } from "@/lib/blog-data";
import type { BlogPostType } from "@/lib/blog-data";

const PAGE_SIZE = 9;

export default function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const [activeType, setActiveType] = useState<BlogPostType | "all">("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const featuredPost = useMemo(() => posts.find((p) => p.featured), [posts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeType !== "all" && p.postType !== activeType) return false;
      if (activeTags.length && !activeTags.some((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [posts, activeType, activeTags]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(36px, 5vw, 56px)", color: "var(--ce-text)", fontWeight: 800, lineHeight: 1.15 }}>
          Chizzy&apos;s Blog
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--ce-text-muted)", maxWidth: "560px" }}>
          Stories, discoveries, reviews, insights, and food moments from my world — and beyond.
        </p>
      </div>

      {/* Featured hero */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <Link href={`/blog/${featuredPost.slug}`} className="group block" style={{ textDecoration: "none" }}>
            <div className="relative rounded-3xl overflow-hidden aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9]">
              {featuredPost.coverImage ? (
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${BLOG_POST_TYPES[featuredPost.postType].color}30` }}>
                  {(() => { const FeatIcon = BLOG_POST_TYPES[featuredPost.postType].icon; return <FeatIcon size={64} style={{ color: BLOG_POST_TYPES[featuredPost.postType].color }} />; })()}
                </div>
              )}
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,5,2,0.88) 0%, rgba(10,5,2,0.3) 60%, transparent 100%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold mb-3"
                  style={{ backgroundColor: BLOG_POST_TYPES[featuredPost.postType].color, color: "#fff" }}>
                  {(() => { const FeatIcon = BLOG_POST_TYPES[featuredPost.postType].icon; return <FeatIcon size={12} />; })()} {BLOG_POST_TYPES[featuredPost.postType].label}
                </span>
                <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(24px, 4vw, 42px)", color: "#FFF8E7", fontWeight: 800, lineHeight: 1.2, marginBottom: "8px" }}>
                  {featuredPost.title}
                </h2>
                <p className="text-sm sm:text-base mb-4 line-clamp-2" style={{ color: "rgba(255,248,231,0.75)", maxWidth: "600px" }}>
                  {featuredPost.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                  style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033" }}>
                  Read Post <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <BlogFilters
            activeType={activeType}
            activeTags={activeTags}
            allTags={allTags}
            onTypeChange={(t) => { setActiveType(t); setVisibleCount(PAGE_SIZE); }}
            onTagToggle={toggleTag}
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ backgroundColor: "var(--ce-bg-surface)", height: "320px" }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: "var(--ce-text-muted)" }}>No posts found for this filter.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full text-sm transition-all"
                  style={{ backgroundColor: "var(--ce-bg-card)", color: "var(--ce-text)", border: "1.5px solid var(--ce-border)", fontWeight: 600 }}
                >
                  Load more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
