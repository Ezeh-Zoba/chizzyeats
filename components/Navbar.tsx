"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

const navLinks = [
  {
    label: "Recipes",
    href: "/category/nigerian",
    children: [
      { label: "Nigerian", href: "/category/nigerian" },
      { label: "African", href: "/category/african" },
      { label: "Asian", href: "/category/asian" },
      { label: "European", href: "/category/european" },
      { label: "American", href: "/category/american" },
    ],
  },
  {
    label: "Desserts",
    href: "/category/desserts",
  },
  {
    label: "Drinks",
    href: "/category/drinks",
  },
  {
    label: "Budget Meals",
    href: "/category/budget",
  },
  {
    label: "About",
    href: "/about",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const submitSearch = () => {
    if (!searchVal.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    setSearchOpen(false);
    setSearchVal("");
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Transparent header sits over a dark hero image on most pages, so default
  // to light text there; once scrolled (solid white bg) or on a light-background
  // page like /about, dark text is correct instead.
  const LIGHT_BACKGROUND_PAGES = ["/about", "/contact", "/privacy", "/terms", "/cookies", "/search"];
  const isLightHeader = !scrolled && !LIGHT_BACKGROUND_PAGES.includes(pathname);
  const headerTextColor = isLightHeader ? "#FFF8E7" : "#5C4033";

  return (
    <>
      <header
        style={{
          fontFamily: "'Inter', sans-serif",
          backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 24px rgba(92,64,51,0.08)" : "none",
          transition: "all 0.3s ease",
        }}
        className="fixed top-0 left-0 right-0 z-50"
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
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-colors duration-200"
                    style={{
                      color: headerTextColor,
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF8E7";
                      (e.currentTarget as HTMLElement).style.color = "#FF8C42";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = headerTextColor;
                    }}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} />}
                  </Link>

                  {link.children && openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 mt-1 w-44 rounded-2xl overflow-hidden"
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 8px 32px rgba(92,64,51,0.15)",
                        border: "1px solid rgba(255,199,44,0.2)",
                      }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "#5C4033", fontWeight: 400 }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF8E7";
                            (e.currentTarget as HTMLElement).style.color = "#FF8C42";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "#5C4033";
                          }}
                        >
                          {child.label}
                        </Link>
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
                <form
                  onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
                  className="flex items-center gap-2 rounded-full px-4 py-2"
                  style={{ backgroundColor: "#FFF8E7", border: "1.5px solid #FFC72C" }}
                >
                  <button type="submit" aria-label="Search">
                    <Search size={16} style={{ color: "#FF8C42" }} />
                  </button>
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search recipes…"
                    className="bg-transparent outline-none text-sm w-40"
                    style={{ color: "#5C4033", fontFamily: "'Inter', sans-serif" }}
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchVal(""); }}>
                    <X size={14} style={{ color: "#5C4033" }} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: headerTextColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFF8E7")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Search size={18} />
                </button>
              )}

              <Link
                href="/admin"
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
                Dashboard
              </Link>

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
            style={{ backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(12px)" }}
          >
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 px-4 text-sm rounded-xl mb-1 transition-colors"
                  style={{ color: "#5C4033", fontWeight: 500 }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFF8E7")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 border-l-2 pl-4 mb-2" style={{ borderColor: "#FFC72C" }}>
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm transition-colors"
                        style={{ color: "#8B6F47", fontWeight: 400 }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/admin"
              className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm"
              style={{
                background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
                color: "#5C4033",
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
