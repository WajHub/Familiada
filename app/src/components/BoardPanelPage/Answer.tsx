interface AnswerProps {
  id: number;
  index: number;
  content: string;
  isVisible: boolean;
  totalAnswers?: number;
}

export function Answer({
  index,
  content,
  isVisible,
  totalAnswers = 6,
}: AnswerProps) {
  let text = "";
  let points = "";

  if (isVisible && content) {
    const match = content.match(/^(.*)\s+(\d+)$/);
    if (match) {
      text = match[1].trim().toUpperCase();
      points = match[2];
    } else {
      text = content.trim().toUpperCase();
    }
  }

  // Dynamic typography: scales automatically based on how many answers are active on the board,
  // guaranteeing up to 10 answers fit perfectly on 40"-60" displays while filling maximum screen space.
  const fontSizeStyle =
    totalAnswers >= 9
      ? "min(1.85vw, 3.8vh)"
      : totalAnswers >= 7
      ? "min(2.1vw, 4.5vh)"
      : "min(2.4vw, 5.5vh)";

  return (
    <div
      style={{ fontSize: fontSizeStyle }}
      className="flex w-full items-baseline justify-between font-['CustomFont',sans-serif] leading-tight tracking-wide text-[#ffd000]"
    >
      <div className="flex min-w-0 flex-1 items-baseline gap-3 sm:gap-4 overflow-hidden">
        <span className="w-[2.2em] min-w-[2.2em] shrink-0 text-right tabular-nums">
          {index}
        </span>
        {isVisible ? (
          <span className="truncate">{text}</span>
        ) : (
          <span className="truncate tracking-[0.2em] text-[#ffd000]/80">
            ................................................................................
          </span>
        )}
      </div>
      {isVisible && points !== "" && (
        <span className="ml-4 shrink-0 text-right tabular-nums">{points}</span>
      )}
    </div>
  );
}

export default Answer;
