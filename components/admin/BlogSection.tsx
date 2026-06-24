"use client";

import { useState } from "react";
import { Edit2, Trash2, Search, Eye, EyeOff } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";
import { BLOG_POST_TYPES } from "@/lib/blog-data";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";

interface BlogSectionProps {
  posts: BlogPost[];
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onTogglePublish: (post: BlogPost) => void;
}

export function BlogSection({ posts, onEditPost, onDeletePost, onTogglePublish }: BlogSectionProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.postType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4 w-full">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ce-text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ backgroundColor: "var(--ce-bg-card)", color: "var(--ce-text)", border: "1px solid var(--ce-border)" }}
        >
          <option value="all">All Types</option>
          {(Object.keys(BLOG_POST_TYPES) as import("@/lib/blog-data").BlogPostType[]).map((t) => (
            <option key={t} value={t}>{BLOG_POST_TYPES[t].label}</option>
          ))}
        </select>
      </div>

      {/* Stats summary */}
      <div className="flex gap-4 text-xs" style={{ color: "var(--ce-text-muted)" }}>
        <span>{posts.filter((p) => p.status === "published").length} published</span>
        <span>{posts.filter((p) => p.status === "draft").length} drafts</span>
        <span>{posts.filter((p) => p.featured).length} featured</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                {["Title", "Type", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider"
                    style={{ color: "var(--ce-text-muted)", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm"
                    style={{ color: "var(--ce-text-muted)" }}>
                    No posts found.
                  </td>
                </tr>
              )}
              {filtered.map((post) => {
                const meta = BLOG_POST_TYPES[post.postType];
                const dateVal = post.publishedAt ?? post.createdAt;
                const date = dateVal
                  ? new Date((dateVal as unknown as { toDate?: () => Date; seconds?: number }).toDate?.() ?? new Date((dateVal as unknown as { seconds: number }).seconds * 1000)).toLocaleDateString()
                  : "—";
                return (
                  <tr key={post.id} className="border-t transition-colors"
                    style={{ borderColor: "var(--ce-border)" }}>
                    <td className="px-5 py-3 max-w-[260px]">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--ce-text)" }}>{post.title}</div>
                      {post.featured && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,199,44,0.2)", color: "#FFC72C", fontWeight: 600 }}>
                          featured
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1"
                        style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                        <meta.icon size={10} /> {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: post.status === "published" ? "#f0fdf4" : "#fff7ed",
                          color: post.status === "published" ? "#22c55e" : "#f59e0b",
                        }}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--ce-text-muted)" }}>{date}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onTogglePublish(post)} className="p-1.5 rounded-lg transition-colors"
                          style={{ color: post.status === "published" ? "#f59e0b" : "#22c55e" }}
                          title={post.status === "published" ? "Unpublish" : "Publish"}>
                          {post.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button onClick={() => onEditPost(post)} className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "#FF8C42" }} title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeletingPost(post)} className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "#ef4444" }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!deletingPost}
        onOpenChange={(open) => !open && setDeletingPost(null)}
        itemLabel={deletingPost?.title || "this post"}
        onConfirm={() => {
          if (deletingPost) onDeletePost(deletingPost.id);
          setDeletingPost(null);
        }}
      />
    </div>
  );
}
