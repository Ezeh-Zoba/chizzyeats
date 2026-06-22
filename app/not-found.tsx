import Link from "next/link";
import { GiCookingPot } from "react-icons/gi";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFF8E7", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <GiCookingPot size={56} className="mb-6 mx-auto" style={{ color: "#FF8C42" }} />
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 40px)",
            color: "#5C4033",
            fontWeight: 800,
            marginBottom: "12px",
          }}
        >
          Page Not Found
        </h1>
        <p className="text-base leading-relaxed mb-8" style={{ color: "#8B6F47" }}>
          We couldn't find that page. Maybe it was moved, or the recipe got eaten before we could save it.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm"
          style={{
            background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
            color: "#5C4033",
            fontWeight: 700,
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
