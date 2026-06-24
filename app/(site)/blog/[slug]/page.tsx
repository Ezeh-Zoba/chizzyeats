"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, ExternalLink, Tv, Utensils, Link2 } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { BlogPost } from "@/lib/blog-data";
import { BLOG_POST_TYPES } from "@/lib/blog-data";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogCard } from "@/components/blog/BlogCard";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    getDocs(query(collection(db, "blogPosts"), where("slug", "==", slug), where("status", "==", "published")))
      .then(async (snap) => {
        if (!active || snap.empty) { setLoading(false); return; }
        const data = { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
        if (!active) return;
        setPost(data);

        // Fetch related posts (same type, exclude self)
        const relSnap = await getDocs(
          query(collection(db, "blogPosts"), where("postType", "==", data.postType), where("status", "==", "published"))
        );
        if (!active) return;
        setRelated(
          relSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }) as BlogPost)
            .filter((p) => p.id !== data.id)
            .slice(0, 3)
        );
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--ce-bg)" }}>
        <div className="max-w-3xl mx-auto px-4 pt-24 animate-pulse space-y-4">
          <div className="h-8 rounded-xl w-3/4" style={{ backgroundColor: "var(--ce-bg-surface)" }} />
          <div className="h-64 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-surface)" }} />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 rounded" style={{ backgroundColor: "var(--ce-bg-surface)", width: i % 3 === 0 ? "80%" : "100%" }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "var(--ce-bg)" }}>
        <p className="text-lg" style={{ color: "var(--ce-text-muted)" }}>Post not found.</p>
        <Link href="/blog" className="text-sm font-semibold" style={{ color: "#FF8C42" }}>← Back to Blog</Link>
      </div>
    );
  }

  const meta = BLOG_POST_TYPES[post.postType];
  const dateVal = post.publishedAt ?? post.createdAt;
  const date = dateVal
    ? new Date(
        (dateVal as unknown as { toDate?: () => Date; seconds?: number }).toDate?.() ??
        new Date((dateVal as unknown as { seconds: number }).seconds * 1000)
      ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative w-full" style={{ height: "clamp(260px, 45vw, 520px)" }}>
          <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--ce-bg) 0%, rgba(0,0,0,0) 60%)" }} />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20" style={{ marginTop: post.coverImage ? "-60px" : "80px", position: "relative" }}>
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
          style={{ color: "var(--ce-text-muted)", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* Type badge + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs px-3 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5"
            style={{ backgroundColor: meta.color, color: "#fff" }}>
            <meta.icon size={13} /> {meta.label}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ce-text-muted)" }}>
              <Clock size={12} /> {post.readTime} min read
            </span>
          )}
          {date && <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{date}</span>}
          <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>by {post.author}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(28px, 5vw, 48px)", color: "var(--ce-text)", fontWeight: 800, lineHeight: 1.2, marginBottom: "16px" }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base leading-relaxed mb-8" style={{ color: "var(--ce-text-muted)", borderLeft: "3px solid #FFC72C", paddingLeft: "16px" }}>
          {post.excerpt}
        </p>

        {/* Source attribution */}
        {post.source && (
          <div className="flex items-center gap-2 mb-8 p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-surface)", border: "1px solid var(--ce-border)" }}>
            <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: "var(--ce-text-muted)" }}>
              {post.source.type === "tv-show" ? <Tv size={12} /> : post.source.type === "restaurant" ? <Utensils size={12} /> : <Link2 size={12} />} Source:
            </span>
            {post.source.url ? (
              <a href={post.source.url} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: "#FF8C42" }}>
                {post.source.name} <ExternalLink size={11} />
              </a>
            ) : (
              <span className="text-xs font-semibold" style={{ color: "var(--ce-text)" }}>{post.source.name}</span>
            )}
          </div>
        )}

        {/* Content blocks */}
        <BlogPostContent blocks={post.content} />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6" style={{ borderTop: "1px solid var(--ce-border)" }}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1 rounded-full transition-colors"
                style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)", textDecoration: "none" }}>
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "28px", color: "var(--ce-text)", fontWeight: 800 }}>
              More {meta.label} Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => <BlogCard key={p.id} post={p} variant="compact" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
