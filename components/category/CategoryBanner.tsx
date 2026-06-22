import Link from "next/link";
import Image from "next/image";
import type { CategoryMeta } from "@/lib/category-data";

interface CategoryBannerProps {
  meta: CategoryMeta;
}

export function CategoryBanner({ meta }: CategoryBannerProps) {
  return (
    <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
      <Image src={meta.banner} alt={meta.title} fill sizes="100vw" className="object-cover" />
      <div
        className="absolute inset-0 flex items-end"
        style={{ background: "linear-gradient(0deg, rgba(92,64,51,0.88) 0%, rgba(92,64,51,0.4) 60%, transparent 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "rgba(255,248,231,0.7)" }}>
            <Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#FFC72C" }}>{meta.title}</span>
          </div>
          <div className="flex items-center gap-4">
            {typeof meta.icon === "string" ? (
              <span className="text-4xl">{meta.icon}</span>
            ) : (
              <meta.icon size={40} style={{ color: "#FFC72C" }} />
            )}
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 5vw, 48px)",
                  color: "#FFF8E7",
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {meta.title}
              </h1>
              <p className="mt-1 text-sm max-w-lg" style={{ color: "rgba(255,248,231,0.8)" }}>
                {meta.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
