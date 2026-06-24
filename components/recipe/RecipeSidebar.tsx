"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc, setDoc, runTransaction } from "firebase/firestore";
import { Download, Printer, Share2, Instagram, Facebook, Twitter, Copy, Star, Clock } from "lucide-react";
import type { Recipe } from "@/components/RecipeCard";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { SignInModal } from "@/components/auth/SignInModal";
import { RatingDialog } from "@/components/recipe/RatingDialog";

interface RecipeSidebarProps {
  recipe: Recipe;
  relatedRecipes?: Recipe[];
  onRatingChange?: (newAvg: number) => void;
}

export function RecipeSidebar({ recipe, relatedRecipes, onRatingChange }: RecipeSidebarProps) {
  const { user } = useAuthUser();
  const [copied, setCopied] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { setUserRating(null); return; }
    let active = true;
    getDoc(doc(db, "ratings", `${user.uid}_${recipe.id}`)).then((snap) => {
      if (active && snap.exists()) setUserRating(snap.data().value as number);
    });
    return () => { active = false; };
  }, [user, recipe.id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShareWindow = (url: string) => window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");

  const shareButtons = [
    {
      icon: Instagram,
      label: copied ? "Copied!" : "Instagram",
      bg: "#E1306C",
      onClick: handleCopy,
    },
    {
      icon: Facebook,
      label: "Facebook",
      bg: "#1877F2",
      onClick: () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
    },
    {
      icon: Twitter,
      label: "Twitter/X",
      bg: "#000",
      onClick: () => openShareWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(recipe.title)}`),
    },
    {
      icon: Copy,
      label: copied ? "Copied!" : "Copy Link",
      bg: "#8B6F47",
      onClick: handleCopy,
    },
  ];

  const handleRatingSubmit = async (rating: number) => {
    if (!user) return;
    await setDoc(doc(db, "ratings", `${user.uid}_${recipe.id}`), {
      userId: user.uid,
      recipeId: recipe.id,
      value: rating,
      createdAt: new Date(),
    });

    const recipeRef = doc(db, "recipes", recipe.id);
    let newAvg = rating;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(recipeRef);
      const data = snap.data() ?? {};
      const oldSum: number = data.ratingSum ?? 0;
      const oldCount: number = data.ratingCount ?? 0;
      const prevRating = userRating ?? null;
      const newCount = prevRating !== null ? oldCount : oldCount + 1;
      const newSum = oldSum - (prevRating ?? 0) + rating;
      newAvg = newCount > 0 ? Math.round((newSum / newCount) * 10) / 10 : rating;
      tx.update(recipeRef, { ratingSum: newSum, ratingCount: newCount, rating: newAvg });
    });

    setUserRating(rating);
    onRatingChange?.(newAvg);
    setTimeout(() => setRateOpen(false), 1200);
  };

  return (
    <>
      <div className="sticky top-24 space-y-4">
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
            color: "#5C4033",
            fontWeight: 700,
            boxShadow: "0 4px 16px rgba(255,199,44,0.35)",
          }}
        >
          <Download size={16} />
          Download Recipe PDF
        </button>

        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-sm"
          style={{
            backgroundColor: "var(--ce-bg-card)",
            color: "var(--ce-text)",
            fontWeight: 600,
            boxShadow: "0 2px 12px var(--ce-shadow)",
            border: "1.5px solid var(--ce-border)",
          }}
        >
          <Printer size={16} />
          Print Recipe
        </button>

        <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
          <h4 className="text-sm mb-3" style={{ color: "var(--ce-text)", fontWeight: 700 }}>
            <Share2 size={14} className="inline mr-1.5" />
            Share this Recipe
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {shareButtons.map(({ icon: Icon, label, bg, onClick }) => (
              <button
                key={label === "Copied!" ? `${bg}-copied` : label}
                onClick={onClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-opacity"
                style={{ backgroundColor: bg, color: "#fff", fontWeight: 600, opacity: 0.9 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: "var(--ce-bg)", border: "1.5px solid var(--ce-overlay-gold-border)" }}>
          <div style={{ fontFamily: "'Dancing Script', cursive", fontSize: "36px", color: "var(--ce-text)", fontWeight: 800 }}>
            {userRating ?? recipe.rating ?? 0}
          </div>
          <div className="flex justify-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} fill={s <= Math.round(userRating ?? recipe.rating ?? 0) ? "#FFC72C" : "none"} style={{ color: "#FFC72C" }} />
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
            {userRating ? "Thanks for your rating!" : `${recipe.saves?.toLocaleString() ?? 0} people saved this`}
          </p>
          <button
            onClick={() => (user ? setRateOpen(true) : setSignInOpen(true))}
            className="mt-3 w-full py-2 rounded-xl text-xs"
            style={{ backgroundColor: "#FFC72C", color: "#5C4033", fontWeight: 700 }}
          >
            Rate this Recipe
          </button>
        </div>

        {/* About Author */}
        <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
          <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-3">
            <Image
              src="https://images.unsplash.com/photo-1636647511729-6703539ba71f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
              alt={recipe.author || "Chizzy"}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <h4 className="text-sm text-center mb-1" style={{ color: "var(--ce-text)", fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>
            {recipe.author || "Chizzy"}
          </h4>
          <p className="text-xs text-center mb-3" style={{ color: "var(--ce-text-muted)" }}>
            Nigerian food lover, recipe developer, and your guide to flavourful cooking.
          </p>
          <Link
            href="/about"
            className="block text-center text-xs py-2 rounded-xl"
            style={{ backgroundColor: "var(--ce-bg-surface)", color: "#FF8C42", fontWeight: 600 }}
          >
            View Profile
          </Link>
        </div>

        {/* More Recipes */}
        {relatedRecipes && relatedRecipes.length > 0 && (
          <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
            <h4 className="text-sm mb-3" style={{ color: "var(--ce-text)", fontWeight: 700 }}>More Recipes</h4>
            <div className="space-y-3">
              {relatedRecipes.slice(0, 4).map((r) => (
                <Link key={r.id} href={`/recipe/${r.id}`} className="flex items-center gap-3 group">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={r.image} alt={r.title} fill sizes="48px" className="object-cover group-hover:scale-105 transition-transform duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-xs px-2 py-0.5 rounded-full mb-0.5"
                      style={{ backgroundColor: "var(--ce-bg-surface)", color: "#FF8C42", fontWeight: 600 }}
                    >
                      {r.category}
                    </span>
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--ce-text)" }}>{r.title}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--ce-text-muted)" }}>
                      <Clock size={10} /> {r.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <RatingDialog
        open={rateOpen}
        onOpenChange={setRateOpen}
        recipeTitle={recipe.title}
        onSubmit={handleRatingSubmit}
      />

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </>
  );
}
