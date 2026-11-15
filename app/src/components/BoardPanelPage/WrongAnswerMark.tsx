import FamiliadaStrike from "./FamiliadaStrike";

interface WrongAnswerMarkProps {
  team: "RED" | "BLUE";
  amount: number;
}

export function WrongAnswerMark({ amount }: WrongAnswerMarkProps) {
  // Slots ordered from Top to Bottom:
  // Slot 2 (top): active when amount >= 3
  // Slot 1 (middle): active when amount >= 2
  // Slot 0 (bottom): active when amount >= 1
  const strikes = [
    { id: 2, active: amount >= 3 },
    { id: 1, active: amount >= 2 },
    { id: 0, active: amount >= 1 },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-around py-1 sm:py-2">
      {strikes.map((slot) => (
        <div key={slot.id} className="flex items-center justify-center py-1">
          <FamiliadaStrike
            active={slot.active}
            className="w-[6.5vw] min-w-[70px] max-w-[145px] aspect-[54/62] h-auto drop-shadow-md"
          />
        </div>
      ))}
    </div>
  );
}

export default WrongAnswerMark;
