"use client";

import { useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { ADMIN_COMMENTS, type AdminComment } from "@/lib/admin-data";

const TABS = ["All", "Pending", "Approved", "Spam"] as const;
type Tab = (typeof TABS)[number];

function matchesTab(comment: AdminComment, tab: Tab): boolean {
  if (tab === "All") return true;
  return comment.status === tab.toLowerCase();
}

export function CommentsSection() {
  const [commentList, setCommentList] = useState(ADMIN_COMMENTS);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const approve = (id: number) => setCommentList(commentList.map((c) => (c.id === id ? { ...c, status: "approved" } : c)));
  const remove = (id: number) => setCommentList(commentList.filter((c) => c.id !== id));
  const visible = commentList.filter((c) => matchesTab(c, activeTab));

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-sm"
            style={{
              backgroundColor: activeTab === tab ? "#FFC72C" : "#fff",
              color: activeTab === tab ? "#5C4033" : "#8B6F47",
              fontWeight: activeTab === tab ? 700 : 400,
              boxShadow: "0 1px 6px rgba(92,64,51,0.07)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "#8B6F47" }}>No {activeTab.toLowerCase()} comments.</p>
      )}

      {visible.map((c) => (
        <div key={c.id} className="p-5 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
              >
                {c.author[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: "#5C4033" }}>{c.author}</span>
                  <span className="text-xs" style={{ color: "#8B6F47" }}>on</span>
                  <span className="text-xs font-medium" style={{ color: "#FF8C42" }}>{c.recipe}</span>
                  <span className="text-xs" style={{ color: "#8B6F47" }}>• {c.time}</span>
                </div>
                <p className="text-sm" style={{ color: "#5C4033" }}>{c.text}</p>
              </div>
            </div>
            <span
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: c.status === "approved" ? "#f0fdf4" : "#fff7ed", color: c.status === "approved" ? "#22c55e" : "#f59e0b", fontWeight: 600 }}
            >
              {c.status}
            </span>
          </div>
          <div className="flex gap-2 mt-4 ml-12">
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
