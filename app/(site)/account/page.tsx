"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { User as UserIcon } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { SignInModal } from "@/components/auth/SignInModal";

interface MyComment {
  id: string;
  recipeId: string;
  text: string;
  status: string;
  createdAt: Timestamp | null;
}

export default function AccountPage() {
  const { user, loading } = useAuthUser();
  const [signInOpen, setSignInOpen] = useState(false);
  const [comments, setComments] = useState<MyComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCommentsLoading(false);
      return;
    }
    let active = true;
    const q = query(collection(db, "comments"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    getDocs(q)
      .then((snapshot) => {
        if (!active) return;
        setComments(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              recipeId: data.recipeId,
              text: data.text,
              status: data.status,
              createdAt: data.createdAt ?? null,
            };
          })
        );
      })
      .finally(() => active && setCommentsLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  if (!loading && !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="text-center max-w-sm">
          <h1
            className="mb-3"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: "28px", color: "var(--ce-text)", fontWeight: 800 }}
          >
            Sign in to view your account
          </h1>
          <p className="mb-6 text-sm" style={{ color: "var(--ce-text-muted)" }}>
            Track your comment history once you're signed in.
          </p>
          <button
            onClick={() => setSignInOpen(true)}
            className="px-6 py-3 rounded-2xl text-sm"
            style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "var(--ce-text)", fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>
        <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-16"
      style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto">
        {user && (
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "var(--ce-text)", fontWeight: 700 }}
            >
              {(user.displayName || user.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <h1
                style={{ fontFamily: "'Dancing Script', cursive", fontSize: "24px", color: "var(--ce-text)", fontWeight: 800 }}
              >
                {user.displayName || "My Account"}
              </h1>
              <p className="text-sm" style={{ color: "var(--ce-text-muted)" }}>{user.email}</p>
            </div>
          </div>
        )}

        <h2
          className="mb-4 flex items-center gap-2"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "18px", color: "var(--ce-text)", fontWeight: 700 }}
        >
          <UserIcon size={18} style={{ color: "#FF8C42" }} />
          My Comments
        </h2>

        {commentsLoading ? null : comments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ce-text-muted)" }}>You haven't left any comments yet.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: c.status === "approved" ? "#f0fdf4" : "#fff7ed",
                      color: c.status === "approved" ? "#22c55e" : "#f59e0b",
                      fontWeight: 600,
                    }}
                  >
                    {c.status === "approved" ? "Approved" : "Pending review"}
                  </span>
                  {c.createdAt && (
                    <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
                      {c.createdAt.toDate().toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--ce-text)" }}>{c.text}</p>
                <a href={`/recipe/${c.recipeId}`} className="text-xs" style={{ color: "#FF8C42", fontWeight: 600 }}>
                  View recipe →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
