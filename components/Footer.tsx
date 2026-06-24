"use client";

import { useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Heart, Mail, Check } from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa6";
import { Logo } from "./Logo";
import { db } from "@/lib/firebase/client";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const footerLinks = {
  recipes: [
    { label: "Nigerian Recipes", href: "/category/nigerian" },
    { label: "African Dishes", href: "/category/african" },
    { label: "Asian Cuisine", href: "/category/asian" },
    { label: "European", href: "/category/european" },
    { label: "Desserts", href: "/category/desserts" },
    { label: "Drinks", href: "/category/drinks" },
  ],
  explore: [
    { label: "Budget Meals", href: "/category/budget" },
    { label: "Quick Meals", href: "/category/quick" },
    { label: "Latest Posts", href: "/category/nigerian" },
    { label: "Blog", href: "/blog" },
    { label: "About Chizzy", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  const siteConfig = useSiteConfig();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socials = [
    { icon: FaInstagram, label: "Instagram", href: siteConfig.instagramUrl },
    { icon: FaFacebook, label: "Facebook", href: siteConfig.facebookUrl },
    { icon: FaTiktok, label: "TikTok", href: siteConfig.tiktokUrl },
  ].filter((s) => s.href);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        createdAt: serverTimestamp(),
        source: "footer",
      });
      setSubscribed(true);
    } catch {
      setError("Couldn't subscribe right now. Please try again.");
    }
  };

  return (
    <footer className="print:hidden" style={{ backgroundColor: "#5C4033", fontFamily: "'Inter', sans-serif" }}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo variant="white" size="md" />
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(255,248,231,0.7)" }}>
              A cozy corner of the internet where Nigerian recipes meet global flavors. Made with love, served with joy.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ backgroundColor: "rgba(255,199,44,0.15)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#FFC72C";
                    (e.currentTarget as HTMLElement).style.color = "#5C4033";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,199,44,0.15)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,248,231,0.8)";
                  }}
                >
                  <Icon size={16} style={{ color: "rgba(255,248,231,0.8)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Recipes */}
          <div>
            <h4 className="text-sm mb-4" style={{ color: "#FFC72C", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Recipes
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.recipes.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,248,231,0.7)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFC72C")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,248,231,0.7)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm mb-4" style={{ color: "#FFC72C", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,248,231,0.7)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFC72C")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,248,231,0.7)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm mb-4" style={{ color: "#FFC72C", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Stay in the Loop
            </h4>
            <p className="text-sm mb-4" style={{ color: "rgba(255,248,231,0.7)" }}>
              Weekly recipes, tips, and food stories delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ backgroundColor: "rgba(255,199,44,0.15)", color: "#FFC72C", fontWeight: 600 }}>
                <Check size={14} /> You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                {error && <p className="text-xs w-full" style={{ color: "#FF8C42" }}>{error}</p>}
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <Mail size={14} style={{ color: "rgba(255,248,231,0.5)" }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-transparent outline-none text-sm flex-1 min-w-0"
                    style={{ color: "#FFF8E7", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
                    color: "#5C4033",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-4 sm:px-6 lg:px-8 py-5"
        style={{ borderColor: "rgba(255,199,44,0.15)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,248,231,0.5)" }}>
            © 2024 Chizzy Eats. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: "rgba(255,248,231,0.5)" }}>
            Made with <Heart size={10} fill="currentColor" style={{ color: "#FF8C42" }} /> in Lagos & beyond
          </p>
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-xs transition-colors" style={{ color: "rgba(255,248,231,0.5)" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
