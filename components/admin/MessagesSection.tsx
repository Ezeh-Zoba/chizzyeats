"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  createdAt: Timestamp | null;
}

const TABS = ["All", "Unread", "Read"] as const;
type Tab = (typeof TABS)[number];

function matchesTab(msg: ContactMessage, tab: Tab): boolean {
  if (tab === "All") return true;
  return msg.status === tab.toLowerCase();
}

export function MessagesSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  useEffect(() => {
    let active = true;
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    getDocs(q)
      .then((snapshot) => {
        if (!active) return;
        setMessages(
          snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name ?? "Unknown",
              email: data.email ?? "",
              message: data.message ?? "",
              status: data.status === "read" ? "read" : "unread",
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

  const markRead = async (id: string) => {
    await updateDoc(doc(db, "contactMessages", id), { status: "read" });
    setMessages(messages.map((m) => (m.id === id ? { ...m, status: "read" } : m)));
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "contactMessages", id));
    setMessages(messages.filter((m) => m.id !== id));
  };

  const visible = messages.filter((m) => matchesTab(m, activeTab));
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5"
            style={{
              backgroundColor: activeTab === tab ? "#FFC72C" : "var(--ce-bg-card)",
              color: activeTab === tab ? "#5C4033" : "var(--ce-text-muted)",
              fontWeight: activeTab === tab ? 700 : 400,
              boxShadow: "0 1px 6px var(--ce-shadow)",
            }}
          >
            {tab}
            {tab === "Unread" && unreadCount > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: activeTab === "Unread" ? "#5C4033" : "#FFC72C",
                  color: activeTab === "Unread" ? "#FFC72C" : "#5C4033",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-center py-10" style={{ color: "var(--ce-text-muted)" }}>Loading…</p>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "var(--ce-text-muted)" }}>
          No {activeTab.toLowerCase()} messages.
        </p>
      )}

      {visible.map((m) => (
        <div
          key={m.id}
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: "var(--ce-bg-card)",
            boxShadow: "0 2px 12px var(--ce-shadow)",
            borderLeft: m.status === "unread" ? "3px solid #FFC72C" : "3px solid transparent",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
              >
                {m.name[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: "var(--ce-text)" }}>{m.name}</span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs"
                    style={{ color: "#FF8C42" }}
                  >
                    {m.email}
                  </a>
                  {m.createdAt && (
                    <span className="text-xs" style={{ color: "var(--ce-text-muted)" }}>
                      • {m.createdAt.toDate().toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed mt-1" style={{ color: "var(--ce-text)" }}>{m.message}</p>
              </div>
            </div>
            <span
              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: m.status === "read" ? "#f0fdf4" : "#fff7ed",
                color: m.status === "read" ? "#22c55e" : "#f59e0b",
                fontWeight: 600,
              }}
            >
              {m.status}
            </span>
          </div>

          <div className="flex gap-2 mt-4 ml-12">
            {m.status === "unread" && (
              <button
                onClick={() => markRead(m.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs"
                style={{ backgroundColor: "#fffbeb", color: "#f59e0b", fontWeight: 600 }}
              >
                <MailOpen size={12} /> Mark as Read
              </button>
            )}
            <a
              href={`mailto:${m.email}?subject=Re: Your message on ChizzyEats&body=%0A%0A---%0AOriginal message from ${encodeURIComponent(m.name)}:%0A${encodeURIComponent(m.message)}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs"
              style={{ backgroundColor: "#eff6ff", color: "#3b82f6", fontWeight: 600 }}
            >
              <Mail size={12} /> Reply
            </a>
            <button
              onClick={() => remove(m.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs"
              style={{ backgroundColor: "#fef2f2", color: "#ef4444", fontWeight: 600 }}
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
