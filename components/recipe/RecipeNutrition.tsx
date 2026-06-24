export interface NutritionFact {
  label: string;
  value: string;
  unit: string;
}

interface RecipeNutritionProps {
  facts: NutritionFact[];
}

export function RecipeNutrition({ facts }: RecipeNutritionProps) {
  return (
    <div className="mb-12 p-6 rounded-2xl" style={{ backgroundColor: "var(--ce-bg-card)", boxShadow: "0 2px 16px var(--ce-shadow)" }}>
      <h2 className="mb-5" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "20px", color: "var(--ce-text)", fontWeight: 700 }}>
        Nutrition (per serving)
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {facts.map(({ label, value, unit }) => (
          <div key={label} className="text-center p-3 rounded-xl" style={{ backgroundColor: "var(--ce-bg-surface)" }}>
            <div style={{ fontSize: "20px", color: "var(--ce-text)", fontWeight: 800, fontFamily: "'Dancing Script', cursive" }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "#FF8C42", fontWeight: 600 }}>{unit}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--ce-text-muted)" }}>{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: "var(--ce-text-muted)" }}>
        * Estimated values. Actual nutrition may vary based on specific brands and portions used.
      </p>
    </div>
  );
}
