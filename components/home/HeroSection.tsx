import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { HOME_STATS } from "@/lib/home-data";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBoZXJvJTIwZ291cm1ldCUyMG1lYWx8ZW58MXx8fHwxNzgyMDY3NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero food"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(92,64,51,0.88) 0%, rgba(92,64,51,0.6) 50%, rgba(92,64,51,0.2) 100%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "rgba(255,199,44,0.2)", border: "1px solid rgba(255,199,44,0.4)" }}
          >
            <Flame size={14} style={{ color: "#FFC72C" }} />
            <span className="text-sm" style={{ color: "#FFC72C", fontWeight: 600 }}>
              New Recipe Every Week
            </span>
          </div>

          <h1
            className="mb-3 leading-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              color: "#FFF8E7",
              lineHeight: 1.1,
            }}
          >
            A Nigerian Kitchen,{" "}
            <span style={{ color: "#FFC72C" }}>Global Table</span>
          </h1>

          <p
            className="mb-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontWeight: 600,
              color: "rgba(255,248,231,0.92)",
            }}
          >
            Cooking the World from Home.
          </p>

          <p className="mb-6 text-sm" style={{ color: "#FFC72C", fontWeight: 600, letterSpacing: "0.04em" }}>
            by Chizzy
          </p>

          <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(255,248,231,0.85)" }}>
            Restaurant-worthy. Made at home. No passport, no reservation needed.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/category/nigerian"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
                color: "#5C4033",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(255,199,44,0.4)",
              }}
            >
              Browse Recipes <ArrowRight size={18} />
            </Link>
            <a
              href="#latest"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#FFF8E7",
                fontWeight: 600,
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              Latest Posts
            </a>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-4 max-w-lg">
            {HOME_STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold" style={{ color: "#FFC72C", fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,248,231,0.7)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs" style={{ color: "rgba(255,248,231,0.5)" }}>Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: "rgba(255,248,231,0.3)" }}>
          <div className="w-1 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#FFC72C" }} />
        </div>
      </div>
    </section>
  );
}
