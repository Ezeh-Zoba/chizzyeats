import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog-data";
import { BLOG_POST_TYPES } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const meta = BLOG_POST_TYPES[post.postType];
  const dateVal = post.publishedAt ?? post.createdAt;
  const date = dateVal
    ? new Date(
        (dateVal as unknown as { toDate?: () => Date; seconds?: number }).toDate?.() ??
        new Date((dateVal as unknown as { seconds: number }).seconds * 1000)
      ).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <Link href={`/blog/${post.slug}`} className="group block" style={{ textDecoration: "none" }}>
      <article
        className="h-full rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: "var(--ce-bg-card)",
          boxShadow: "0 2px 12px var(--ce-shadow)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px var(--ce-shadow-elevated)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px var(--ce-shadow)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
      >
        {/* Cover */}
        <div className="relative overflow-hidden" style={{ aspectRatio: variant === "compact" ? "3/2" : "16/9" }}>
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${meta.color}20` }}>
              <meta.icon size={36} style={{ color: meta.color }} />
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1"
              style={{ backgroundColor: meta.color, color: "#fff", opacity: 0.95 }}>
              <meta.icon size={11} /> {meta.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3
            className="font-bold leading-snug mb-2"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: variant === "compact" ? "18px" : "20px",
              color: "var(--ce-text)",
            }}
          >
            {post.title}
          </h3>
          <p
            className="text-sm leading-relaxed line-clamp-2 mb-3"
            style={{ color: "var(--ce-text-muted)" }}
          >
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--ce-text-faint)" }}>
              {post.readTime ? `${post.readTime} min read` : ""}{post.readTime && date ? " · " : ""}{date}
            </span>
            {post.source && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text-muted)" }}>
                {post.source.name}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
