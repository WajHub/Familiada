interface FamiliadaStrikeProps {
  active: boolean;
  className?: string;
  size?: number;
}

export function FamiliadaStrike({ active, className = "", size }: FamiliadaStrikeProps) {
  const litFill = "#ffd000";
  const litStroke = "#fff480";
  const unlitFill = "#141722";
  const unlitStroke = "#242838";

  const fill = active ? litFill : unlitFill;
  const stroke = active ? litStroke : unlitStroke;

  return (
    <svg
      width={size}
      height={size ? Math.round((size * 62) / 54) : undefined}
      viewBox="0 0 54 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${active ? "familiada-strike-glow" : ""} transition-all duration-300 ${className}`}
    >
      {/* Top-Left Wing */}
      <polygon
        points="6,5 20,5 22,23 16,23 5,12"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Top-Right Wing */}
      <polygon
        points="48,5 34,5 32,23 38,23 49,12"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Center Segment */}
      <polygon
        points="24,27 30,27 31,31 30,35 24,35 23,31"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Bottom-Left Wing */}
      <polygon
        points="6,57 20,57 22,39 16,39 5,50"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* Bottom-Right Wing */}
      <polygon
        points="48,57 34,57 32,39 38,39 49,50"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FamiliadaStrike;
