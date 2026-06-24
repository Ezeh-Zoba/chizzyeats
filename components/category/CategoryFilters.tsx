"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { DIFFICULTIES, SORT_OPTIONS, type SortOption } from "@/lib/category-data";

interface CategoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  className?: string;
}

export function CategoryFilters({ search, onSearchChange, difficulty, onDifficultyChange, sort, onSortChange, className }: CategoryFiltersProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  useEffect(() => {
    getDoc(doc(db, "siteConfig", "main")).then((snap) => {
      if (snap.exists()) setSubscriberCount((snap.data().subscriberCount as number) || 0);
    });
  }, []);

  return (
    <div className={className}>
      <div className="space-y-6">
        <div>
          <h4 className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
            Search
          </h4>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)" }}>
            <Search size={16} style={{ color: "var(--ce-text-muted)" }} />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search recipes…"
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
            />
            {search && (
              <button onClick={() => onSearchChange("")}>
                <X size={13} style={{ color: "var(--ce-text-muted)" }} />
              </button>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
            Difficulty
          </h4>
          <div className="space-y-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-colors"
                style={{
                  backgroundColor: difficulty === d ? "var(--ce-bg-surface)" : "transparent",
                  color: difficulty === d ? "#FF8C42" : "var(--ce-text-muted)",
                  fontWeight: difficulty === d ? 600 : 400,
                  textAlign: "left",
                }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: difficulty === d ? "#FFC72C" : "var(--ce-border-strong)" }} />
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
            Sort By
          </h4>
          <div className="space-y-2">
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onSortChange(s)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-colors"
                style={{
                  backgroundColor: sort === s ? "var(--ce-bg-surface)" : "transparent",
                  color: sort === s ? "#FF8C42" : "var(--ce-text-muted)",
                  fontWeight: sort === s ? 600 : 400,
                  textAlign: "left",
                }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: sort === s ? "#FFC72C" : "var(--ce-border-strong)" }} />
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)" }}>
          <h4 className="text-sm mb-1" style={{ color: "#5C4033", fontWeight: 700, fontFamily: "'Dancing Script', cursive" }}>
            Never miss a recipe!
          </h4>
          <p className="text-xs mb-3" style={{ color: "rgba(92,64,51,0.75)" }}>
            {subscribed ? "You're subscribed — welcome!" : `Join ${subscriberCount > 0 ? `${subscriberCount.toLocaleString()}+` : "thousands of"} subscribers.`}
          </p>
          {!subscribed && (
            <form onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setSubscribed(true); }}>
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-2"
                style={{ backgroundColor: "rgba(255,255,255,0.8)", color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
              />
              <button type="submit" className="w-full py-2 rounded-xl text-xs" style={{ backgroundColor: "#5C4033", color: "#FFF8E7", fontWeight: 600 }}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
