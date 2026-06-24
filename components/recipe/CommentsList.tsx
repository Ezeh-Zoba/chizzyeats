"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
import { MessageCircle } from "lucide-react";
import { db } from "@/lib/firebase/client";

interface CommentDoc {
  id: string;
  userName: string;
  text: string;
  createdAt: Timestamp | null;
}

interface CommentsListProps {
  recipeId: string;
}

export function CommentsList({ recipeId }: CommentsListProps) {
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const q = query(
      collection(db, "comments"),
      where("recipeId", "==", recipeId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((snapshot) => {
        if (!active) return;
        setComments(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              userName: data.userName ?? "Anonymous",
              text: data.text ?? "",
              createdAt: data.createdAt ?? null,
            };
          })
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [recipeId]);

  if (loading) return null;
  if (comments.length === 0) return null;

  return (
    <div className="mb-8">
      <h2
        className="mb-5 flex items-center gap-2"
        style={{ fontFamily: "'Dancing Script', cursive", fontSize: "20px", color: "var(--ce-text)", fontWeight: 700 }}
      >
        <MessageCircle size={20} style={{ color: "#FF8C42" }} />
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "var(--ce-text)", fontWeight: 700 }}
              >
                {c.userName[0]?.toUpperCase() ?? "?"}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>{c.userName}</span>
              {c.createdAt && (
                <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
                  {c.createdAt.toDate().toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: "var(--ce-text)" }}>{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
