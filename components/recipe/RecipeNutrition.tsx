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
    <div className="mb-12 p-6 rounded-2xl" style={{ backgroundColor: "#fff", boxShadow: "0 2px 16px rgba(92,64,51,0.07)" }}>
      <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#5C4033", fontWeight: 700 }}>
        Nutrition (per serving)
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {facts.map(({ label, value, unit }) => (
          <div key={label} className="text-center p-3 rounded-xl" style={{ backgroundColor: "#FFF8E7" }}>
            <div style={{ fontSize: "20px", color: "#5C4033", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "#FF8C42", fontWeight: 600 }}>{unit}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: "#8B6F47" }}>
        * Estimated values. Actual nutrition may vary based on specific brands and portions used.
      </p>
    </div>
  );
}
