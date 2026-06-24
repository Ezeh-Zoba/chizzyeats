"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "firebase/auth";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/lib/firebase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { SignInModal } from "@/components/auth/SignInModal";
import { useRecipes } from "@/hooks/useRecipes";

const navLinks = [
  {
    label: "Recipes",
    href: "/category/nigerian",
    groups: [
      {
        title: "By Region",
        items: [
          { label: "Nigerian", href: "/category/nigerian" },
          { label: "African", href: "/category/african" },
          { label: "Asian", href: "/category/asian" },
          { label: "European", href: "/category/european" },
          { label: "American", href: "/category/american" },
        ],
      },
      {
        title: "By Type",
        items: [
          { label: "Desserts", href: "/category/desserts" },
          { label: "Drinks", href: "/category/drinks" },
          { label: "Budget Meals", href: "/category/budget" },
          { label: "Quick Meals", href: "/category/quick" },
        ],
      },
    ],
  },
  { label: "Desserts", href: "/category/desserts" },
  { label: "Drinks", href: "/category/drinks" },
  { label: "Budget Meals", href: "/category/budget" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuthUser();
  const { recipes } = useRecipes();

  const suggestions = useMemo(() => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return [];
    return recipes.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 5);
  }, [recipes, searchVal]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSuggestionsOpen(false);
    setSearchVal("");
  };

  const submitSearch = () => {
    if (!searchVal.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    closeSearch();
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setUserMenuOpen(false);
    setSuggestionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!suggestionsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [suggestionsOpen]);

  // Over a dark hero image, use light text. Once scrolled (solid bg) or on a
  // light-bg page, delegate to the CSS variable so dark mode works automatically.
  const LIGHT_BACKGROUND_PAGES = ["/about", "/contact", "/privacy", "/terms", "/cookies", "/search", "/account", "/brand"];
  const isLightHeader = !scrolled && !LIGHT_BACKGROUND_PAGES.includes(pathname);
  const headerTextColor = isLightHeader ? "#FFF8E7" : "var(--ce-text)";

  return (
    <>
      <header
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundColor: scrolled ? "var(--ce-bg-nav-scrolled)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 24px var(--ce-shadow)" : "none",
          transition: "all 0.3s ease",
        }}
        className="fixed top-0 left-0 right-0 z-50 print:hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo variant={isLightHeader ? "white" : "primary"} size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.groups && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-colors duration-200"
                    style={{ color: headerTextColor, fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)";
                      (e.currentTarget as HTMLElement).style.color = "#FF8C42";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = headerTextColor;
                    }}
                  >
                    {link.label}
                    {link.groups && <ChevronDown size={14} />}
                  </Link>

                  {link.groups && openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 mt-1 flex gap-6 p-4 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: "var(--ce-bg-card)",
                        boxShadow: "0 8px 32px var(--ce-shadow-elevated)",
                        border: "1px solid var(--ce-overlay-gold-border)",
                      }}
                    >
                      {link.groups.map((group) => (
                        <div key={group.title} className="w-36">
                          <p className="px-2 mb-1 text-xs uppercase tracking-widest" style={{ color: "#FF8C42", fontWeight: 600 }}>
                            {group.title}
                          </p>
                          {group.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="block px-2 py-2 rounded-xl text-sm transition-colors"
                              style={{ color: "var(--ce-text)", fontWeight: 400 }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)";
                                (e.currentTarget as HTMLElement).style.color = "#FF8C42";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "var(--ce-text)";
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <div className="relative" ref={searchRef}>
                  <form
                    onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
                    className="flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ backgroundColor: "var(--ce-bg-surface)", border: "1.5px solid #FFC72C" }}
                  >
                    <button type="submit" aria-label="Search">
                      <Search size={16} style={{ color: "#FF8C42" }} />
                    </button>
                    <input
                      autoFocus
                      value={searchVal}
                      onChange={(e) => { setSearchVal(e.target.value); setSuggestionsOpen(true); }}
                      onFocus={() => setSuggestionsOpen(true)}
                      onKeyDown={(e) => { if (e.key === "Escape") closeSearch(); }}
                      placeholder="Search recipes…"
                      className="bg-transparent outline-none text-sm w-40"
                      style={{ color: "var(--ce-text)", fontFamily: "'Inter', sans-serif" }}
                    />
                    <button type="button" onClick={closeSearch}>
                      <X size={14} style={{ color: "var(--ce-text)" }} />
                    </button>
                  </form>

                  {suggestionsOpen && suggestions.length > 0 && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: "var(--ce-bg-card)",
                        boxShadow: "0 8px 32px var(--ce-shadow-elevated)",
                        border: "1px solid var(--ce-overlay-gold-border)",
                      }}
                    >
                      {suggestions.map((recipe) => (
                        <Link
                          key={recipe.id}
                          href={`/recipe/${recipe.id}`}
                          onClick={closeSearch}
                          className="block px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--ce-text)", fontWeight: 500 }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                        >
                          {recipe.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: headerTextColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--ce-bg-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Search size={18} />
                </button>
              )}

              <ThemeToggle />

              {user ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((open) => !open)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                    style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700 }}
                  >
                    {(user.displayName || user.email || "?")[0].toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-1 w-44 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: "var(--ce-bg-card)",
                        boxShadow: "0 8px 32px var(--ce-shadow-elevated)",
                        border: "1px solid var(--ce-overlay-gold-border)",
                      }}
                    >
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--ce-text)", fontWeight: 500 }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                        >
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                      )}
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "var(--ce-text)", fontWeight: 400 }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                      >
                        <UserIcon size={14} /> My Account
                      </Link>
                      <button
                        onClick={() => signOut(auth)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                        style={{ color: "var(--ce-text-muted)", fontWeight: 400 }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--ce-bg-surface)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSignInOpen(true)}
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
                    color: "#5C4033",
                    fontWeight: 600,
                    boxShadow: "0 2px 12px rgba(255,140,66,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(255,140,66,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(255,140,66,0.3)";
                  }}
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
                style={{ color: headerTextColor }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-6 pt-2"
            style={{ backgroundColor: "var(--ce-bg-nav-mobile)", backdropFilter: "blur(12px)" }}
          >
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 px-4 text-sm rounded-xl mb-1 transition-colors"
                  style={{ color: "var(--ce-text)", fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--ce-bg-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {link.label}
                </Link>
                {link.groups && (
                  <div className="ml-4 border-l-2 pl-4 mb-2 space-y-3" style={{ borderColor: "#FFC72C" }}>
                    {link.groups.map((group) => (
                      <div key={group.title}>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#FF8C42", fontWeight: 600 }}>
                          {group.title}
                        </p>
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="block py-2 text-sm transition-colors"
                            style={{ color: "var(--ce-text-muted)", fontWeight: 400 }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm"
                    style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 600 }}
                  >
                    <LayoutDashboard size={16} /> Go to Dashboard
                  </Link>
                )}
                <Link
                  href="/account"
                  className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm"
                  style={{ backgroundColor: "var(--ce-bg-surface)", color: "var(--ce-text)", fontWeight: 600 }}
                >
                  My Account
                </Link>
                <button
                  onClick={() => signOut(auth)}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm"
                  style={{ color: "var(--ce-text-muted)", fontWeight: 500 }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setSignInOpen(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm"
                style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 600 }}
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>
      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
    </>
  );
}
