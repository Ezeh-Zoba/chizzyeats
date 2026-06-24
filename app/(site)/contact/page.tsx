"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: form.name,
        email: form.email,
        message: form.message,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-xl mx-auto px-6 text-center">
        <Mail size={48} className="mb-6 mx-auto" style={{ color: "#FF8C42" }} />
        <h1
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "var(--ce-text)",
            fontWeight: 800,
            marginBottom: "16px",
          }}
        >
          Get in Touch
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "var(--ce-text-muted)" }}>
          Got a question about a recipe, a collaboration idea, or just want to say hi? Drop a message below.
        </p>

        {sent ? (
          <div
            className="flex items-center justify-center gap-2 p-5 rounded-2xl"
            style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-overlay-gold-border)" }}
          >
            <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
            <span style={{ color: "var(--ce-text)", fontWeight: 600 }}>Thanks! Your message has been sent.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--ce-text)", fontWeight: 600 }}>Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
                style={{ backgroundColor: "var(--ce-bg-card)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)" }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl text-sm transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
