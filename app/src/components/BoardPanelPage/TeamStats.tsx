interface TeamStatsProps {
  redName: string;
  redPoints: number;
  blueName: string;
  bluePoints: number;
  roundPoints?: number;
}

export function TeamStats({
  redName,
  redPoints,
  blueName,
  bluePoints,
  roundPoints = 0,
}: TeamStatsProps) {
  const roundDisplay = String(roundPoints).padStart(2, " ");

  return (
    <header className="relative flex w-full shrink-0 items-center justify-between px-4 sm:px-6 py-1 sm:py-1.5 font-['CustomFont',sans-serif]">
      {/* RED TEAM SIDE */}
      <div className="flex flex-1 items-center gap-3 sm:gap-4 overflow-hidden">
        {/* Red horizontal neon lines */}
        <div className="flex flex-col gap-1 w-20 sm:w-32 shrink-0 opacity-85">
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
        </div>

        {/* Red score box */}
        <div
          style={{ fontSize: "min(2.1vw, 4.2vh)" }}
          className="flex items-center justify-center min-w-[3.2rem] px-3 py-0.5 sm:py-1 rounded-md border border-red-700/80 bg-red-950/70 text-center font-bold text-red-100 shadow-[0_0_12px_rgba(220,38,38,0.4)] leading-none shrink-0"
        >
          {redPoints}
        </div>

        {/* Red team name */}
        <span
          style={{ fontSize: "min(1.9vw, 3.8vh)" }}
          className="truncate font-bold tracking-wider text-red-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] leading-none"
        >
          {redName || "RED"}
        </span>
      </div>

      {/* CENTER ROUND SCORE PILL */}
      <div className="mx-3 sm:mx-4 flex shrink-0 items-center justify-center">
        <div className="flex items-center justify-center rounded-xl border-2 border-zinc-700/80 bg-black/90 px-4 sm:px-5 py-0.5 sm:py-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.9),0_0_10px_rgba(255,208,0,0.15)]">
          <div
            style={{ fontSize: "min(2.6vw, 4.8vh)" }}
            className="font-['CustomFont',sans-serif] leading-none tracking-widest text-[#ffd000] drop-shadow-[0_0_10px_rgba(255,208,0,0.7)]"
          >
            {roundDisplay}
          </div>
        </div>
      </div>

      {/* BLUE TEAM SIDE */}
      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 overflow-hidden">
        {/* Blue team name */}
        <span
          style={{ fontSize: "min(1.9vw, 3.8vh)" }}
          className="truncate text-right font-bold tracking-wider text-blue-300 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] leading-none"
        >
          {blueName || "BLUE"}
        </span>

        {/* Blue score box */}
        <div
          style={{ fontSize: "min(2.1vw, 4.2vh)" }}
          className="flex items-center justify-center min-w-[3.2rem] px-3 py-0.5 sm:py-1 rounded-md border border-blue-700/80 bg-blue-950/70 text-center font-bold text-blue-100 shadow-[0_0_12px_rgba(37,99,235,0.4)] leading-none shrink-0"
        >
          {bluePoints}
        </div>

        {/* Blue horizontal neon lines */}
        <div className="flex flex-col gap-1 w-20 sm:w-32 shrink-0 opacity-85">
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
        </div>
      </div>
    </header>
  );
}

export default TeamStats;
