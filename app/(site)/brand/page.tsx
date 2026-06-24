import { Logo } from "@/components/Logo";

export default function BrandPage() {
  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-20"
      style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className="mb-2"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "32px", color: "var(--ce-text)", fontWeight: 800 }}
        >
          Logo Export
        </h1>
        <p className="mb-10 text-sm leading-relaxed" style={{ color: "#8B6F47" }}>
          This is the real logo, rendered at flyer-ready size. To save it as an image: take a screenshot of just the
          logo box below (on Mac, press <strong>Cmd + Shift + 4</strong>, then drag a box around it — it saves a PNG
          straight to your Desktop). The vector icon mark alone is also available as a standalone file at{" "}
          <a href="/brand/logo-icon.svg" style={{ color: "#FF8C42", fontWeight: 600 }}>/brand/logo-icon.svg</a>, which
          you can open directly or import into design software.
        </p>

        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
              Primary (for light backgrounds)
            </p>
            <div
              className="flex items-center justify-center rounded-3xl"
              style={{ backgroundColor: "#fff", padding: "80px", boxShadow: "0 2px 16px rgba(92,64,51,0.08)" }}
            >
              <div style={{ transform: "scale(4)" }}>
                <Logo variant="primary" size="lg" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
              White (for dark backgrounds)
            </p>
            <div
              className="flex items-center justify-center rounded-3xl"
              style={{ backgroundColor: "#5C4033", padding: "80px" }}
            >
              <div style={{ transform: "scale(4)" }}>
                <Logo variant="white" size="lg" />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FF8C42", fontWeight: 600 }}>
              Icon only
            </p>
            <div
              className="flex items-center justify-center rounded-3xl"
              style={{ backgroundColor: "#fff", padding: "80px", boxShadow: "0 2px 16px rgba(92,64,51,0.08)" }}
            >
              <div style={{ transform: "scale(4)" }}>
                <Logo variant="icon" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
