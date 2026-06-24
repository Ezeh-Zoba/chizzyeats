"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import type { Recipe } from "@/components/RecipeCard";
import { db } from "@/lib/firebase/client";
import { uploadRecipeImage, deleteRecipeImageByUrl } from "@/lib/firebase/storage-helpers";
import { ADMIN_CATEGORIES, EMPTY_RECIPE_FORM, type AdminCategory, type CreateRecipeFormData } from "@/lib/admin-data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { RecipesSection } from "@/components/admin/RecipesSection";
import { CreateRecipeSection } from "@/components/admin/CreateRecipeSection";
import { CommentsSection } from "@/components/admin/CommentsSection";
import { MessagesSection } from "@/components/admin/MessagesSection";
import { CategoriesSection } from "@/components/admin/CategoriesSection";
import { AnalyticsSection } from "@/components/admin/AnalyticsSection";
import { SettingsSection } from "@/components/admin/SettingsSection";
import { BlogSection } from "@/components/admin/BlogSection";
import { CreateBlogSection } from "@/components/admin/CreateBlogSection";
import type { BlogPost } from "@/lib/blog-data";
import { EMPTY_BLOG_FORM, type CreateBlogFormData, estimateReadTime } from "@/lib/blog-data";
import { uploadBlogImage } from "@/lib/firebase/storage-helpers";

function timeAgo(timestamp: Timestamp | undefined): string {
  if (!timestamp) return "";
  const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface AdminNotification {
  id: string;
  text: string;
  time: string;
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateRecipeFormData>(EMPTY_RECIPE_FORM);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogFormData, setBlogFormData] = useState<CreateBlogFormData>(EMPTY_BLOG_FORM);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    let active = true;
    setLoadError(null);

    async function load() {
      try {
        const [recipesSnap, categoriesSnap, commentsCountSnap, siteConfigSnap, pendingCommentsSnap, blogSnap] = await Promise.all([
          getDocs(collection(db, "recipes")),
          getDocs(collection(db, "categories")),
          getCountFromServer(collection(db, "comments")),
          getDoc(doc(db, "siteConfig", "main")),
          getDocs(query(collection(db, "comments"), where("status", "==", "pending"), orderBy("createdAt", "desc"), limit(5))),
          getDocs(query(collection(db, "blogPosts"), orderBy("createdAt", "desc"))),
        ]);

        let loadedCategories: AdminCategory[] = categoriesSnap.docs.map((d) => d.data() as AdminCategory);

        // First-run bootstrap: seed the default category set once, so the
        // Create Recipe form's category picker isn't empty on a fresh project.
        if (loadedCategories.length === 0) {
          const batch = writeBatch(db);
          for (const cat of ADMIN_CATEGORIES) {
            batch.set(doc(db, "categories", cat.slug), { name: cat.name, slug: cat.slug, color: cat.color });
          }
          await batch.commit();
          loadedCategories = ADMIN_CATEGORIES.map(({ name, slug, color }) => ({ name, slug, color, count: 0 }));
        }

        if (!active) return;
        setRecipes(recipesSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe));
        setBlogPosts(blogSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost));
        setCategories(loadedCategories);
        setCommentCount(commentsCountSnap.data().count);
        setSubscriberCount((siteConfigSnap.data()?.subscriberCount as number) || 0);
        setNotifications(
          pendingCommentsSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              text: `${data.userName || "Someone"} left a comment pending review`,
              time: timeAgo(data.createdAt as Timestamp | undefined),
            };
          })
        );
      } catch (err) {
        if (!active) return;
        console.error("Admin dashboard load error:", err);
        setLoadError(
          err instanceof Error ? err.message : "Failed to load dashboard. Check your Firebase permissions."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const uniqueRecipes = useMemo(
    () => recipes.filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i),
    [recipes]
  );
  const uniqueBlogPosts = useMemo(
    () => blogPosts.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i),
    [blogPosts]
  );

  const categoriesWithCounts = categories.map((c) => ({
    ...c,
    count: uniqueRecipes.filter((r) => r.categorySlug === c.slug).length,
  }));

  const createRecipe = async (recipe: Recipe, publish: boolean, imageFile: File | null) => {
    const heroImageUrl = imageFile ? await uploadRecipeImage(imageFile, recipe.id) : recipe.image;
    const now = new Date();
    const docData = {
      ...recipe,
      image: heroImageUrl,
      status: publish ? "published" : "draft",
      createdAt: now,
      updatedAt: now,
      publishedAt: publish ? now : null,
    };
    await setDoc(doc(db, "recipes", recipe.id), docData);
    setRecipes((prev) => [{ ...recipe, image: heroImageUrl, status: docData.status as Recipe["status"] }, ...prev.filter((r) => r.id !== recipe.id)]);
  };

  const updateRecipe = async (updated: Recipe) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { saves, ...fields } = updated;
    await updateDoc(doc(db, "recipes", updated.id), { ...fields, updatedAt: new Date() });
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? { ...updated, saves: r.saves } : r)));
  };

  const deleteRecipe = async (id: string) => {
    const target = recipes.find((r) => r.id === id);
    await deleteDoc(doc(db, "recipes", id));
    if (target?.image) await deleteRecipeImageByUrl(target.image);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const addCategory = async (category: AdminCategory) => {
    await setDoc(doc(db, "categories", category.slug), { name: category.name, slug: category.slug, color: category.color });
    setCategories([...categories, category]);
  };

  const editCategory = async (slug: string, name: string) => {
    if (!name) return;
    await updateDoc(doc(db, "categories", slug), { name });
    setCategories(categories.map((c) => (c.slug === slug ? { ...c, name } : c)));
  };

  const deleteCategory = async (slug: string) => {
    await deleteDoc(doc(db, "categories", slug));
    setCategories(categories.filter((c) => c.slug !== slug));
  };

  const createBlogPost = async (post: BlogPost, publish: boolean, imageFile: File | null) => {
    const coverImage = imageFile ? await uploadBlogImage(imageFile, post.id) : post.coverImage;
    const now = new Date();
    const docData = {
      ...post,
      coverImage,
      status: publish ? "published" : "draft",
      readTime: estimateReadTime(post.content),
      createdAt: now,
      updatedAt: now,
      publishedAt: publish ? now : null,
    };
    await setDoc(doc(db, "blogPosts", post.id), docData);
    setBlogPosts((prev) => [{ ...post, coverImage, status: docData.status as BlogPost["status"] }, ...prev.filter((p) => p.id !== post.id)]);
    setBlogFormData(EMPTY_BLOG_FORM);
    setActiveSection("blog");
  };

  const toggleBlogPublish = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const now = new Date();
    await updateDoc(doc(db, "blogPosts", post.id), {
      status: newStatus,
      publishedAt: newStatus === "published" ? now : null,
      updatedAt: now,
    });
    setBlogPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus as BlogPost["status"] } : p));
  };

  const deleteBlogPost = async (id: string) => {
    await deleteDoc(doc(db, "blogPosts", id));
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection
            recipes={uniqueRecipes}
            categories={categoriesWithCounts}
            commentCount={commentCount}
            subscriberCount={subscriberCount}
            onEditRecipe={() => setActiveSection("recipes")}
            onDeleteRecipe={deleteRecipe}
          />
        );
      case "recipes":
        return <RecipesSection
          recipes={uniqueRecipes}
          categories={categoriesWithCounts}
          onUpdateRecipe={updateRecipe}
          onDeleteRecipe={deleteRecipe}
          onTogglePublish={(recipe) => {
            const newStatus = recipe.status === "published" ? "draft" : "published";
            updateRecipe({
              ...recipe,
              status: newStatus,
              publishedAt: newStatus === "published" ? new Date() : null,
            } as Recipe);
          }}
        />;
      case "create":
        return <CreateRecipeSection formData={formData} setFormData={setFormData} categories={categoriesWithCounts} onCreate={createRecipe} />;
      case "comments":
        return <CommentsSection />;
      case "messages":
        return <MessagesSection />;
      case "categories":
        return <CategoriesSection categories={categoriesWithCounts} onAdd={addCategory} onEdit={editCategory} onDelete={deleteCategory} />;
      case "analytics":
        return (
          <AnalyticsSection
            recipes={uniqueRecipes}
            categories={categoriesWithCounts}
            commentCount={commentCount}
            subscriberCount={subscriberCount}
          />
        );
      case "blog":
        return (
          <BlogSection
            posts={uniqueBlogPosts}
            onEditPost={(post) => { setEditingBlogPost(post); setActiveSection("create-blog"); }}
            onDeletePost={deleteBlogPost}
            onTogglePublish={toggleBlogPublish}
          />
        );
      case "create-blog":
        return (
          <CreateBlogSection
            formData={editingBlogPost ? {
              title: editingBlogPost.title,
              slug: editingBlogPost.slug,
              excerpt: editingBlogPost.excerpt,
              postType: editingBlogPost.postType,
              tags: editingBlogPost.tags.join(", "),
              sourceType: editingBlogPost.source?.type ?? "",
              sourceName: editingBlogPost.source?.name ?? "",
              sourceUrl: editingBlogPost.source?.url ?? "",
              author: editingBlogPost.author,
              featured: editingBlogPost.featured,
              includeInNewsletter: editingBlogPost.includeInNewsletter,
              content: editingBlogPost.content,
            } : blogFormData}
            setFormData={(d) => { setEditingBlogPost(null); setBlogFormData(d); }}
            onPublish={createBlogPost}
          />
        );
      case "settings":
        return <SettingsSection />;
      default:
        return (
          <OverviewSection
            recipes={recipes}
            categories={categoriesWithCounts}
            commentCount={commentCount}
            subscriberCount={subscriberCount}
            onEditRecipe={() => setActiveSection("recipes")}
            onDeleteRecipe={deleteRecipe}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--ce-bg-admin)" }}>
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar activeSection={activeSection} onCreateRecipe={() => setActiveSection("create")} notifications={notifications} />
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm" style={{ color: "var(--ce-text-muted)" }}>Loading…</p>
          ) : loadError ? (
            <div className="max-w-lg mx-auto mt-20 p-6 rounded-2xl text-center"
              style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid rgba(239,68,68,0.25)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "#ef4444" }}>Dashboard failed to load</p>
              <p className="text-xs mb-4" style={{ color: "var(--ce-text-muted)" }}>{loadError}</p>
              <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
                If this says &quot;Missing or insufficient permissions&quot;, run{" "}
                <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text)" }}>
                  firebase deploy --only firestore:rules
                </code>{" "}
                in your terminal, then refresh.
              </p>
              <button
                onClick={() => { setLoading(true); setLoadAttempt((n) => n + 1); }}
                className="mt-4 px-5 py-2 rounded-xl text-sm"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
              >
                Retry
              </button>
            </div>
          ) : (
            renderSection()
          )}
        </main>
      </div>
    </div>
  );
}
