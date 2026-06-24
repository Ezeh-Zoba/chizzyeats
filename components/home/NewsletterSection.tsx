"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Star, PartyPopper } from "lucide-react";
import { db } from "@/lib/firebase/client";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  useEffect(() => {
    getDoc(doc(db, "siteConfig", "main")).then((snap) => {
      if (snap.exists()) setSubscriberCount((snap.data().subscriberCount as number) || 0);
    });
  }, []);

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FF8C42 0%, #FFC72C 100%)" }}
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20" style={{ backgroundColor: "#5C4033" }} />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full opacity-20" style={{ backgroundColor: "#5C4033" }} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: "rgba(92,64,51,0.15)" }}>
          <Mail size={24} style={{ color: "#5C4033" }} />
        </div>
        <h2
          className="mb-3"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(28px, 4vw, 42px)", color: "#5C4033", fontWeight: 800 }}
        >
          Get Weekly Recipes in Your Inbox
        </h2>
        <p className="mb-8 leading-relaxed" style={{ color: "rgba(92,64,51,0.75)" }}>
          Join {subscriberCount > 0 ? `${subscriberCount.toLocaleString()}+` : "thousands of"} food lovers who get exclusive recipes, kitchen tips, and food stories every Tuesday morning.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-3 py-4 px-8 rounded-full" style={{ backgroundColor: "rgba(92,64,51,0.15)" }}>
            <Star size={20} fill="#5C4033" style={{ color: "#5C4033" }} />
            <span style={{ color: "#5C4033", fontWeight: 700 }}>You're in! Check your inbox for a welcome gift <PartyPopper size={16} style={{ display: "inline", verticalAlign: "middle" }} /></span>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              try {
                await addDoc(collection(db, "newsletter_subscribers"), {
                  email,
                  createdAt: serverTimestamp(),
                  source: "home",
                });
                setSubscribed(true);
              } catch {
                setError("Couldn't subscribe right now. Please try again.");
              }
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full outline-none text-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#5C4033",
                fontFamily: "'Inter', sans-serif",
                border: "none",
              }}
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full text-sm transition-all duration-200"
              style={{
                backgroundColor: "#5C4033",
                color: "#FFF8E7",
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Subscribe Free
            </button>
          </form>
        )}
        {error && (
          <p className="mt-3 text-sm" style={{ color: "#5C4033", fontWeight: 600 }}>
            {error}
          </p>
        )}
        <p className="mt-4 text-xs" style={{ color: "rgba(92,64,51,0.6)" }}>
          No spam. Unsubscribe anytime. No ads.
        </p>
      </div>
    </section>
  );
}
