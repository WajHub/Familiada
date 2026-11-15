interface WrongAnswerMarkProps {
  team: "RED" | "BLUE";
  amount: number;
}

function Strike() {
  return (
    <div className="whitespace-pre leading-none">
      {"  X   X\n  X\n  X   X"}
    </div>
  );
}

function WrongAnswerMark({ amount }: WrongAnswerMarkProps) {
  return (
    <div className="col-span-2 flex h-full flex-col-reverse items-center justify-start gap-4 p-3 pb-4 text-center self-end">
      {Array.from({ length: amount }, (_, index) => (
        <Strike key={index} />
      ))}
    </div>
  );
}

export default WrongAnswerMark;
