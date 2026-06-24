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
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: "var(--ce-bg)", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6">
        <h1
          className="mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--ce-text)", fontWeight: 800 }}
        >
          {title}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--ce-text-muted)" }}>{intro}</p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-2 text-lg" style={{ fontFamily: "'Dancing Script', cursive", color: "var(--ce-text)", fontWeight: 700 }}>
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ce-text-muted)" }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
