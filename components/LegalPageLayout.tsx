interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPageLayout({ title, intro, sections }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: "#FFF8E7", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6">
        <h1
          className="mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#5C4033", fontWeight: 800 }}
        >
          {title}
        </h1>
        <p className="text-sm mb-10" style={{ color: "#8B6F47" }}>{intro}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-2 text-lg" style={{ fontFamily: "'Playfair Display', serif", color: "#5C4033", fontWeight: 700 }}>
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#8B6F47" }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
