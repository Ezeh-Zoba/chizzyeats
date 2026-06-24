"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, setDoc, where, orderBy } from "firebase/firestore";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { ShieldCheck, Share2, Mail, ExternalLink, Copy, Check } from "lucide-react";
import { db, functions } from "@/lib/firebase/client";
import type { BlogPost } from "@/lib/blog-data";

export function SettingsSection() {
  const [grantEmail, setGrantEmail] = useState("");
  const [grantStatus, setGrantStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [granting, setGranting] = useState(false);

  const [newsletterPosts, setNewsletterPosts] = useState<BlogPost[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const instagramUrlDefault = "";
  const [instagramUrl, setInstagramUrl] = useState(instagramUrlDefault);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      getDoc(doc(db, "siteConfig", "main")),
      getDocs(query(collection(db, "blogPosts"), where("includeInNewsletter", "==", true), where("status", "==", "published"), orderBy("publishedAt", "desc"))),
    ]).then(([snap, blogSnap]) => {
      if (!active) return;
      if (snap.exists()) {
        const data = snap.data();
        setInstagramUrl(data.instagramUrl || "");
        setFacebookUrl(data.facebookUrl || "");
        setTiktokUrl(data.tiktokUrl || "");
      }
      setNewsletterPosts(blogSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost));
    });
    return () => { active = false; };
  }, []);

  const handleGrantAdmin = async () => {
    if (!grantEmail.trim()) return;
    setGranting(true);
    setGrantStatus(null);
    try {
      const grantAdmin = httpsCallable(functions, "grantAdmin");
      await grantAdmin({ email: grantEmail.trim() });
      setGrantStatus({ type: "success", message: `Admin access granted to ${grantEmail.trim()}.` });
      setGrantEmail("");
    } catch (err) {
      const message = err instanceof FunctionsError ? err.message : "Couldn't grant admin access.";
      setGrantStatus({ type: "error", message });
    } finally {
      setGranting(false);
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    setConfigSaved(false);
    try {
      await setDoc(
        doc(db, "siteConfig", "main"),
        { instagramUrl: instagramUrl.trim(), facebookUrl: facebookUrl.trim(), tiktokUrl: tiktokUrl.trim() },
        { merge: true }
      );
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: Admin + Social */}
      <div className="space-y-6">
      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: "var(--ce-text)" }}>
          <ShieldCheck size={16} style={{ color: "#FFC72C" }} />
          Grant Admin Access
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--ce-text-muted)" }}>
          Give another account full admin access to this dashboard.
        </p>

        {grantStatus && (
          <div
            className="mb-3 p-3 rounded-xl text-xs"
            style={{
              backgroundColor: grantStatus.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: grantStatus.type === "success" ? "#15803d" : "#ef4444",
            }}
          >
            {grantStatus.message}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="email"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGrantAdmin()}
            placeholder="email@example.com"
            className="flex-1 px-4 py-2.5 rounded-xl outline-none text-sm"
            style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
          />
          <button
            onClick={handleGrantAdmin}
            disabled={granting}
            className="px-5 py-2.5 rounded-xl text-sm disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
          >
            {granting ? "Granting…" : "Grant Access"}
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: "var(--ce-text)" }}>
          <Share2 size={16} style={{ color: "#FFC72C" }} />
          Social Links
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--ce-text-muted)" }}>
          Shown as icons in the site footer. Leave a field empty to hide that icon.
        </p>

        <div className="space-y-3">
          {[
            { label: "Instagram", value: instagramUrl, onChange: setInstagramUrl },
            { label: "Facebook", value: facebookUrl, onChange: setFacebookUrl },
            { label: "TikTok", value: tiktokUrl, onChange: setTiktokUrl },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-xs mb-1" style={{ color: "var(--ce-text-muted)", fontWeight: 600 }}>{label}</label>
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://${label.toLowerCase()}.com/...`}
                className="w-full px-4 py-2.5 rounded-xl outline-none text-sm"
                style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid var(--ce-border)", color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={savingConfig}
          className="mt-4 px-5 py-2.5 rounded-xl text-sm disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
        >
          {savingConfig ? "Saving…" : configSaved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      </div>{/* end left column */}

      {/* Right column: Newsletter Queue */}
      <div className="space-y-6">
      <div className="p-5 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 12px var(--ce-shadow)" }}>
        <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: "var(--ce-text)" }}>
          <Mail size={16} style={{ color: "#FFC72C" }} />
          Newsletter Queue
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--ce-text-muted)" }}>
          Blog posts marked &ldquo;Include in newsletter&rdquo; — copy the links for your next send.
        </p>

        {newsletterPosts.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: "var(--ce-text-muted)" }}>
            No posts in the queue. Mark posts as &ldquo;Include in newsletter&rdquo; when writing them.
          </p>
        ) : (
          <div className="space-y-2">
            {newsletterPosts.map((post) => {
              const link = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`;
              const copied = copiedId === post.id;
              return (
                <div key={post.id} className="flex items-center justify-between gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "var(--ce-bg-surface)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--ce-text)" }}>{post.title}</p>
                    <p className="text-xs truncate" style={{ color: "#FF8C42" }}>/blog/{post.slug}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg" style={{ color: "var(--ce-text-muted)" }} title="Preview">
                      <ExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        setCopiedId(post.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="p-2 rounded-lg" style={{ color: copied ? "#22c55e" : "var(--ce-text-muted)" }} title="Copy link">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>{/* end right column */}
      </div>{/* end grid */}
    </div>
  );
}
