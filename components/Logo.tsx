interface LogoProps {
  variant?: "primary" | "white" | "icon";
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "primary", size = "md" }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 64 };
  const iconSize = sizes[size];
  const isDark = variant === "white";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon Mark */}
      <div style={{ width: iconSize, height: iconSize }} className="relative flex-shrink-0">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize}>
          {/* Plate circle */}
          <circle cx="32" cy="32" r="30" fill={isDark ? "rgba(255,255,255,0.15)" : "#FFF8E7"} stroke={isDark ? "rgba(255,255,255,0.4)" : "#FFC72C"} strokeWidth="2" />
          {/* Fork on left */}
          <g transform="translate(16, 12)">
            <rect x="3" y="0" width="1.5" height="14" rx="0.75" fill={isDark ? "#FFC72C" : "#FF8C42"} />
            <rect x="6" y="0" width="1.5" height="14" rx="0.75" fill={isDark ? "#FFC72C" : "#FF8C42"} />
            <rect x="9" y="0" width="1.5" height="14" rx="0.75" fill={isDark ? "#FFC72C" : "#FF8C42"} />
            <path d="M3.75 14 Q6.75 17 9.75 14" stroke={isDark ? "#FFC72C" : "#FF8C42"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <rect x="6" y="17" width="1.5" height="15" rx="0.75" fill={isDark ? "#FFC72C" : "#FF8C42"} />
          </g>
          {/* Spoon on right */}
          <g transform="translate(38, 11)">
            <ellipse cx="5" cy="7" rx="4" ry="6" fill={isDark ? "#FFC72C" : "#FF8C42"} opacity="0.9" />
            <rect x="4.25" y="13" width="1.5" height="18" rx="0.75" fill={isDark ? "#FFC72C" : "#FF8C42"} />
          </g>
          {/* Steam hearts */}
          <path d="M28 20 C28 17 24 16 24 19 C24 21 26 23 28 25 C30 23 32 21 32 19 C32 16 28 17 28 20Z" fill="#FFC72C" opacity="0.8" />
          {/* C letter in center */}
          <text x="32" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold" fill={isDark ? "#FFC72C" : "#5C4033"} letterSpacing="-0.5">C</text>
        </svg>
      </div>

      {/* Wordmark */}
      {variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: isDark ? "#FFC72C" : "#5C4033",
              fontSize: size === "sm" ? "18px" : size === "lg" ? "30px" : "22px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Chizzy's
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              color: isDark ? "rgba(255,255,255,0.9)" : "#FF8C42",
              fontSize: size === "sm" ? "9px" : size === "lg" ? "14px" : "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            EATS
          </span>
        </div>
      )}
    </div>
  );
}
