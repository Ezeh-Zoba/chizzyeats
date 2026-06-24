"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface FirestoreComment {
  id: string;
  recipeId: string;
  userName: string;
  text: string;
  status: "pending" | "approved";
  createdAt: Timestamp | null;
}

const TABS = ["All", "Pending", "Approved"] as const;
type Tab = (typeof TABS)[number];

function matchesTab(comment: FirestoreComment, tab: Tab): boolean {
  if (tab === "All") return true;
  return comment.status === tab.toLowerCase();
}

export function CommentsSection() {
  const [commentList, setCommentList] = useState<FirestoreComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  useEffect(() => {
    let active = true;
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    getDocs(q)
      .then((snapshot) => {
        if (!active) return;
        setCommentList(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              recipeId: data.recipeId,
              userName: data.userName ?? "Anonymous",
              text: data.text ?? "",
              status: data.status === "approved" ? "approved" : "pending",
              createdAt: data.createdAt ?? null,
            };
          })
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const approve = async (id: string) => {
    await updateDoc(doc(db, "comments", id), { status: "approved" });
    setCommentList(commentList.map((c) => (c.id === id ? { ...c, status: "approved" } : c)));
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "comments", id));
    setCommentList(commentList.filter((c) => c.id !== id));
  };

  const visible = commentList.filter((c) => matchesTab(c, activeTab));

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3 mb-5 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0"
            style={{
              backgroundColor: activeTab === tab ? "#FFC72C" : "var(--ce-bg-card)",
              color: activeTab === tab ? "#5C4033" : "var(--ce-text-muted)",
              fontWeight: activeTab === tab ? 700 : 400,
              boxShadow: "0 1px 6px var(--ce-shadow)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {!loading && visible.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "var(--ce-text-muted)" }}>No {activeTab.toLowerCase()} comments.</p>
      )}

      {visible.map((c) => (
        <div key={c.id} className="p-3 sm:p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
              >
                {c.userName[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>{c.userName}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>on</span>
                    <a href={`/recipe/${c.recipeId}`} className="text-xs font-medium" style={{ color: "#FF8C42" }}>{c.recipeId}</a>
                    {c.createdAt && (
                      <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>• {c.createdAt.toDate().toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <p className="text-sm" style={{ color: "var(--ce-text)" }}>{c.text}</p>
              </div>
            </div>
            <span
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: c.status === "approved" ? "#f0fdf4" : "#fff7ed", color: c.status === "approved" ? "#22c55e" : "#f59e0b", fontWeight: 600 }}
            >
              {c.status}
            </span>
          </div>
          <div className="flex gap-2 mt-4 ml-0 sm:ml-12">
            {c.status === "pending" && (
              <button onClick={() => approve(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs" style={{ backgroundColor: "#f0fdf4", color: "#22c55e", fontWeight: 600 }}>
                <CheckCircle size={12} /> Approve
              </button>
            )}
            <button onClick={() => remove(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs" style={{ backgroundColor: "#fef2f2", color: "#ef4444", fontWeight: 600 }}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
