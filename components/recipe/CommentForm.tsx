"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { SignInModal } from "@/components/auth/SignInModal";
import { commentSchema } from "@/lib/validation/comment";

interface CommentFormProps {
  recipeId: string;
}

export function CommentForm({ recipeId }: CommentFormProps) {
  const { user, loading } = useAuthUser();
  const [signInOpen, setSignInOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setSignInOpen(true);
      return;
    }

    const parsed = commentSchema.safeParse({ text, recipeId });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid comment.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        recipeId,
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        text: parsed.data.text,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Couldn't post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 16px var(--ce-shadow)" }}>
      <h2
        className="mb-4"
        style={{ fontFamily: "'Dancing Script', cursive", fontSize: "20px", color: "var(--ce-text)", fontWeight: 700 }}
      >
        Leave a Comment
      </h2>

      {submitted && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}>
          Thanks! Your comment is pending review and will appear once approved.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl text-xs" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={user ? "Share your thoughts on this recipe…" : "Sign in to leave a comment…"}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
        />
        <button
          type="submit"
          disabled={loading || submitting || (!!user && !text.trim())}
          className="px-6 py-2.5 rounded-2xl text-sm transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "var(--ce-text)", fontWeight: 700 }}
        >
          {user ? (submitting ? "Posting…" : "Post Comment") : "Sign In to Comment"}
        </button>
      </form>

      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </div>
  );
}
