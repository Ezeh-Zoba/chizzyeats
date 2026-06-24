"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Plus, ArrowUp, Image as ImageIcon, CheckCircle, AlignLeft, Heading2, Quote, Lightbulb, Star, Link2, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  type BlogPost, type ContentBlock, type CreateBlogFormData, type InsightIcon, type RatingType, type SourceType,
  BLOG_POST_TYPES, INSIGHT_ICONS, RATING_TYPE_LABELS, SOURCE_TYPE_LABELS,
  EMPTY_BLOG_FORM, slugify, estimateReadTime,
} from "@/lib/blog-data";
import { uploadBlogImage } from "@/lib/firebase/storage-helpers";

const inputStyle = { backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" };
const labelStyle = { color: "var(--ce-text)", fontWeight: 600 } as const;
const sectionStyle = { backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" };

interface CreateBlogSectionProps {
  formData: CreateBlogFormData;
  setFormData: (d: CreateBlogFormData) => void;
  onPublish: (post: BlogPost, publish: boolean, imageFile: File | null) => void;
}

function BlockEditor({ block, index, total, onChange, onRemove, onMoveUp }: {
  block: ContentBlock; index: number; total: number;
  onChange: (b: ContentBlock) => void; onRemove: () => void; onMoveUp: () => void;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageFile = async (file: File) => {
    setImageFile(file);
    setUploading(true);
    try {
      const url = URL.createObjectURL(file);
      onChange({ ...(block as { type: "image"; url: string; caption?: string }), url });
    } finally {
      setUploading(false);
    }
    void imageFile; // will be uploaded on save
  };

  const controlStyle = { color: "var(--ce-text-muted)" };
  const ta = { ...inputStyle, width: "100%", borderRadius: "10px", padding: "8px 12px", outline: "none", resize: "vertical" as const };
  const inp = { ...inputStyle, width: "100%", borderRadius: "10px", padding: "8px 12px", outline: "none" };

  return (
    <div className="rounded-2xl p-4 space-y-2" style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)" }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--ce-text-muted)" }}>{block.type}</span>
        <div className="flex gap-1">
          {index > 0 && (
            <button onClick={onMoveUp} className="p-1.5 rounded-lg" style={controlStyle} title="Move up">
              <ArrowUp size={13} />
            </button>
          )}
          <button onClick={onRemove} className="p-1.5 rounded-lg" style={{ color: "#ef4444" }} title="Remove">
            <X size={13} />
          </button>
        </div>
      </div>

      {block.type === "paragraph" && (
        <textarea rows={3} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Write your paragraph…" style={ta} />
      )}

      {block.type === "heading" && (
        <div className="flex gap-3">
          <select value={block.level} onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}
            className="rounded-xl px-3 py-2 text-sm outline-none" style={{ ...inputStyle, width: "80px" }}>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Heading text…" className="flex-1 rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} />
        </div>
      )}

      {block.type === "image" && (
        <div className="space-y-2">
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer min-h-[120px] transition-colors"
            style={{ borderColor: "var(--ce-border-strong)", backgroundColor: "var(--ce-bg-card)" }}
            onClick={() => fileRef.current?.click()}
          >
            {block.url ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden">
                <Image src={block.url} alt="block image" fill sizes="600px" className="object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 py-6">
                <ImageIcon size={20} style={{ color: "var(--ce-text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>{uploading ? "Uploading…" : "Click to upload image"}</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
          <input value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })}
            placeholder="Caption (optional)" className="rounded-xl px-3 py-2 text-xs outline-none w-full" style={inp} />
        </div>
      )}

      {block.type === "quote" && (
        <div className="space-y-2">
          <textarea rows={2} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Quote text…" style={ta} />
          <input value={block.attribution ?? ""} onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            placeholder="Attribution (optional, e.g. Marcus Samuelsson)" className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={inp} />
        </div>
      )}

      {block.type === "insight" && (
        <div className="space-y-2">
          <textarea rows={3} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Insight or fact…" style={ta} />
          <div className="grid grid-cols-2 gap-2">
            <input value={block.source} onChange={(e) => onChange({ ...block, source: e.target.value })}
              placeholder="Source name (e.g. WHO)" className="rounded-xl px-3 py-2 text-sm outline-none" style={inp} />
            <input value={block.sourceUrl} onChange={(e) => onChange({ ...block, sourceUrl: e.target.value })}
              placeholder="Source URL (https://…)" className="rounded-xl px-3 py-2 text-sm outline-none" style={inp} />
          </div>
          <select value={block.icon} onChange={(e) => onChange({ ...block, icon: e.target.value as InsightIcon })}
            className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={{ ...inputStyle }}>
            {(Object.keys(INSIGHT_ICONS) as InsightIcon[]).map((k) => (
              <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
            ))}
          </select>
        </div>
      )}

      {block.type === "rating" && (
        <div className="space-y-2">
          <input value={block.name} onChange={(e) => onChange({ ...block, name: e.target.value })}
            placeholder="Name (e.g. Nando's Lagos or Chef's Table S6)" className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={inp} />
          <div className="flex gap-2">
            <select value={block.rating} onChange={(e) => onChange({ ...block, rating: Number(e.target.value) })}
              className="rounded-xl px-3 py-2 text-sm outline-none" style={{ ...inputStyle, width: "90px" }}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
            <select value={block.ratingType} onChange={(e) => onChange({ ...block, ratingType: e.target.value as RatingType })}
              className="rounded-xl px-3 py-2 text-sm outline-none flex-1" style={{ ...inputStyle }}>
              {(Object.keys(RATING_TYPE_LABELS) as RatingType[]).map((k) => (
                <option key={k} value={k}>{RATING_TYPE_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <textarea rows={2} value={block.notes ?? ""} onChange={(e) => onChange({ ...block, notes: e.target.value })}
            placeholder="Notes / review…" style={ta} />
        </div>
      )}

      {block.type === "link-card" && (
        <div className="space-y-2">
          <input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Link title" className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={inp} />
          <input value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="URL (https://…)" className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={inp} />
          <input value={block.description ?? ""} onChange={(e) => onChange({ ...block, description: e.target.value })}
            placeholder="Short description (optional)" className="rounded-xl px-3 py-2 text-sm outline-none w-full" style={inp} />
        </div>
      )}

      {block.type === "divider" && (
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
          <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>Divider</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--ce-border)" }} />
        </div>
      )}
    </div>
  );
}

const NEW_BLOCKS: { label: string; icon: LucideIcon; block: ContentBlock }[] = [
  { label: "Para",    icon: AlignLeft,  block: { type: "paragraph", text: "" } },
  { label: "Head",    icon: Heading2,   block: { type: "heading", text: "", level: 2 } },
  { label: "Image",   icon: ImageIcon,  block: { type: "image", url: "" } },
  { label: "Quote",   icon: Quote,      block: { type: "quote", text: "" } },
  { label: "Insight", icon: Lightbulb,  block: { type: "insight", text: "", source: "", sourceUrl: "", icon: "nutrition" } },
  { label: "Rating",  icon: Star,       block: { type: "rating", name: "", rating: 5, ratingType: "restaurant" } },
  { label: "Link",    icon: Link2,      block: { type: "link-card", title: "", url: "" } },
  { label: "Divider", icon: Minus,      block: { type: "divider" } },
];

export function CreateBlogSection({ formData, setFormData, onPublish }: CreateBlogSectionProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState<"draft" | "published" | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<CreateBlogFormData>) => setFormData({ ...formData, ...patch });

  const pickCover = (file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const updateBlock = (i: number, block: ContentBlock) => {
    const content = [...formData.content];
    content[i] = block;
    set({ content });
  };

  const removeBlock = (i: number) => {
    const content = formData.content.filter((_, idx) => idx !== i);
    set({ content });
  };

  const moveBlockUp = (i: number) => {
    if (i === 0) return;
    const content = [...formData.content];
    [content[i - 1], content[i]] = [content[i], content[i - 1]];
    set({ content });
  };

  const addBlock = (block: ContentBlock) => set({ content: [...formData.content, { ...block }] });

  const handleTitleChange = (title: string) => {
    set({ title, slug: formData.slug || slugify(title) });
  };

  const handleSubmit = (publish: boolean) => {
    if (!formData.title.trim()) return;
    const now = new Date() as unknown as import("firebase/firestore").Timestamp;
    const post: BlogPost = {
      id: formData.slug || slugify(formData.title) || `post-${Date.now()}`,
      title: formData.title,
      slug: formData.slug || slugify(formData.title),
      excerpt: formData.excerpt,
      coverImage: coverPreview ?? "",
      postType: formData.postType,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      source: formData.sourceType ? { type: formData.sourceType as SourceType, name: formData.sourceName, url: formData.sourceUrl || undefined } : undefined,
      content: formData.content,
      author: formData.author,
      status: publish ? "published" : "draft",
      featured: formData.featured,
      includeInNewsletter: formData.includeInNewsletter,
      readTime: estimateReadTime(formData.content),
      createdAt: now,
      updatedAt: now,
      publishedAt: publish ? now : null,
    };
    onPublish(post, publish, coverFile);
    setSaved(publish ? "published" : "draft");
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-2xl text-sm mb-5"
          style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}>
          <CheckCircle size={16} />
          Post {saved === "published" ? "published" : "saved as draft"}!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: title, cover, content blocks ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Title + Slug */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Post Details</h3>
            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Title *</label>
              <input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Give your post a title…" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>URL Slug</label>
              <input value={formData.slug} onChange={(e) => set({ slug: slugify(e.target.value) })}
                placeholder="auto-generated-from-title" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
              <p className="text-xs mt-1" style={{ color: "var(--ce-text-muted)" }}>Will be: /blog/{formData.slug || "your-slug"}</p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Cover Image</h3>
            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
              style={{
                borderColor: dragOver ? "#FFC72C" : "var(--ce-border-strong)",
                backgroundColor: dragOver ? "var(--ce-overlay-gold)" : "var(--ce-bg-card)",
                minHeight: "180px",
              }}
              onClick={() => coverRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) pickCover(f); }}
            >
              {coverPreview ? (
                <div className="relative w-full h-56">
                  <Image src={coverPreview} alt="cover" fill sizes="800px" className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <span className="text-xs text-white font-semibold">Change image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                    <ImageIcon size={18} style={{ color: "var(--ce-text-muted)" }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>Drop image or click to upload</span>
                  <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && pickCover(e.target.files[0])} />
          </div>

          {/* Content Blocks */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Content</h3>

            {formData.content.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: "var(--ce-text-muted)" }}>
                No blocks yet — add one below to start writing.
              </p>
            )}

            {formData.content.map((block, i) => (
              <BlockEditor
                key={i}
                block={block}
                index={i}
                total={formData.content.length}
                onChange={(b) => updateBlock(i, b)}
                onRemove={() => removeBlock(i)}
                onMoveUp={() => moveBlockUp(i)}
              />
            ))}

            <div className="pt-2">
              <p className="text-xs mb-2 font-semibold" style={{ color: "var(--ce-text-muted)" }}>Add Block</p>
              <div className="flex flex-wrap gap-2">
                {NEW_BLOCKS.map(({ label, icon: BlockIcon, block }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => addBlock(block)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-colors"
                    style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text)", fontWeight: 600 }}
                  >
                    <BlockIcon size={11} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column: meta, source, options, publish ── */}
        <div className="space-y-5">

          {/* Post type + author + excerpt + tags */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Settings</h3>

            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Post Type</label>
              <select value={formData.postType} onChange={(e) => set({ postType: e.target.value as import("@/lib/blog-data").BlogPostType })}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle}>
                {(Object.keys(BLOG_POST_TYPES) as import("@/lib/blog-data").BlogPostType[]).map((t) => (
                  <option key={t} value={t}>{BLOG_POST_TYPES[t].label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Author</label>
              <input value={formData.author} onChange={(e) => set({ author: e.target.value })}
                placeholder="Chizzy" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Excerpt *</label>
              <textarea value={formData.excerpt} onChange={(e) => set({ excerpt: e.target.value })}
                rows={3} placeholder="A short description shown in cards and previews…"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Tags (comma-separated)</label>
              <input value={formData.tags} onChange={(e) => set({ tags: e.target.value })}
                placeholder="nigerian food, jollof, travel" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>
          </div>

          {/* Source Attribution */}
          <div className="p-5 rounded-2xl space-y-4" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Source</h3>
            <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
              For restaurant reviews, TV shows, or content from other creators.
            </p>
            <div>
              <label className="block text-sm mb-1.5" style={labelStyle}>Source Type</label>
              <select value={formData.sourceType} onChange={(e) => set({ sourceType: e.target.value as SourceType | "" })}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle}>
                <option value="">None (original)</option>
                {(Object.keys(SOURCE_TYPE_LABELS) as SourceType[]).map((k) => (
                  <option key={k} value={k}>{SOURCE_TYPE_LABELS[k]}</option>
                ))}
              </select>
            </div>
            {formData.sourceType && (
              <>
                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>Source Name</label>
                  <input value={formData.sourceName} onChange={(e) => set({ sourceName: e.target.value })}
                    placeholder="e.g. Nando's or Chef's Table" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5" style={labelStyle}>Source URL (optional)</label>
                  <input value={formData.sourceUrl} onChange={(e) => set({ sourceUrl: e.target.value })}
                    placeholder="https://…" className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={inputStyle} />
                </div>
              </>
            )}
          </div>

          {/* Options */}
          <div className="p-5 rounded-2xl space-y-3" style={sectionStyle}>
            <h3 className="text-sm font-bold" style={{ color: "var(--ce-text)" }}>Options</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={(e) => set({ featured: e.target.checked })}
                className="w-4 h-4 rounded accent-yellow-400" />
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>Featured post</span>
                <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>Shown as hero on the blog listing page</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.includeInNewsletter} onChange={(e) => set({ includeInNewsletter: e.target.checked })}
                className="w-4 h-4 rounded accent-yellow-400" />
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>Include in newsletter</span>
                <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>Added to the newsletter queue in Settings</p>
              </div>
            </label>
          </div>

          {/* Publish / Draft */}
          <div className="flex flex-col gap-3 pb-6">
            <button type="button" onClick={() => handleSubmit(true)}
              className="w-full py-3 rounded-2xl text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}>
              Publish Post
            </button>
            <button type="button" onClick={() => handleSubmit(false)}
              className="w-full py-3 rounded-2xl text-sm"
              style={{ backgroundColor: "var(--ce-text)", color: "var(--ce-bg)", fontWeight: 700 }}>
              Save Draft
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
