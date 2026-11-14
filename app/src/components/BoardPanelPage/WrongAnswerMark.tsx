interface WrongAnswerMarkProps {
  team: "RED" | "BLUE";
  amount: number;
}

function Strike() {
  return (
    <div className="mb-4 whitespace-pre leading-none">
      {"  X   X\n  X\n  X   X"}
    </div>
  );
}

function WrongAnswerMark({ amount }: WrongAnswerMarkProps) {
  return (
    <div className="col-span-2 flex flex-col items-center p-3 text-center">
      {Array.from({ length: amount }, (_, index) => (
        <Strike key={index} />
      ))}
    </div>
  );
}

export default WrongAnswerMark;
