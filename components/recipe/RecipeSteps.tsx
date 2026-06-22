import type { RecipeStep } from "@/components/RecipeCard";

interface RecipeStepsProps {
  steps: RecipeStep[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#5C4033", fontWeight: 700 }}>
        Instructions
      </h2>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.step}
            className="flex gap-4 p-5 rounded-2xl"
            style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(92,64,51,0.06)" }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 800 }}
            >
              {step.step}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm" style={{ color: "#5C4033", fontWeight: 700 }}>{step.title}</h3>
                {step.time && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF8E7", color: "#FF8C42", fontWeight: 600 }}>
                    {step.time}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#8B6F47" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
