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
    <header className="relative flex w-full items-center justify-between px-6 py-3 font-['CustomFont',sans-serif]">
      {/* RED TEAM SIDE */}
      <div className="flex flex-1 items-center gap-4">
        {/* Red horizontal neon lines */}
        <div className="flex flex-col gap-1 w-24 sm:w-36 opacity-85">
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-red-500 to-transparent shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
        </div>

        {/* Red score box */}
        <div className="flex items-center justify-center min-w-[3.5rem] px-3 py-1 rounded-md border border-red-700/80 bg-red-950/70 text-center text-[2.2vw] font-bold text-red-100 shadow-[0_0_12px_rgba(220,38,38,0.4)]">
          {redPoints}
        </div>

        {/* Red team name */}
        <span className="truncate text-[2vw] font-bold tracking-wider text-red-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">
          {redName || "RED"}
        </span>
      </div>

      {/* CENTER ROUND SCORE PILL */}
      <div className="mx-4 flex shrink-0 items-center justify-center">
        <div className="flex items-center justify-center rounded-xl border-2 border-zinc-700/80 bg-black/90 px-5 py-1.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.9),0_0_10px_rgba(255,208,0,0.15)]">
          <div className="font-['CustomFont',sans-serif] text-[2.8vw] leading-none tracking-widest text-[#ffd000] drop-shadow-[0_0_10px_rgba(255,208,0,0.7)]">
            {roundDisplay}
          </div>
        </div>
      </div>

      {/* BLUE TEAM SIDE */}
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Blue team name */}
        <span className="truncate text-right text-[2vw] font-bold tracking-wider text-blue-300 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]">
          {blueName || "BLUE"}
        </span>

        {/* Blue score box */}
        <div className="flex items-center justify-center min-w-[3.5rem] px-3 py-1 rounded-md border border-blue-700/80 bg-blue-950/70 text-center text-[2.2vw] font-bold text-blue-100 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
          {bluePoints}
        </div>

        {/* Blue horizontal neon lines */}
        <div className="flex flex-col gap-1 w-24 sm:w-36 opacity-85">
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <div className="h-0.5 w-full bg-gradient-to-l from-blue-600 via-blue-500 to-transparent shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
        </div>
      </div>
    </header>
  );
}

export default TeamStats;
