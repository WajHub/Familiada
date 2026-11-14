interface TeamStatsProps {
  redName: string;
  redPoints: number;
  blueName: string;
  bluePoints: number;
}

function TeamStats({
  redName,
  redPoints,
  blueName,
  bluePoints,
}: TeamStatsProps) {
  return (
    <div className="grid grid-cols-12 items-center m-4 p-1 text-white">
      <div className="col-span-2 rounded-[6px] bg-red-600 py-0.5 text-center">
        {redPoints}
      </div>
      <div className="col-span-4 text-left">{redName}</div>
      <div className="col-span-4 text-right">{blueName}</div>
      <div className="col-span-2 rounded-[6px] bg-blue-600 py-0.5 text-center">
        {bluePoints}
      </div>
    </div>
  );
}

export default TeamStats;
