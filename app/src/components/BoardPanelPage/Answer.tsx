interface AnswerProps {
  id: number;
  index: number;
  content: string;
  isVisible: boolean;
}

export function Answer({ index, content, isVisible }: AnswerProps) {
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

  return (
    <div className="flex w-full items-baseline justify-between py-1 font-['CustomFont',sans-serif] text-[2.5vw] leading-normal tracking-wide text-[#ffd000]">
      <div className="flex min-w-0 flex-1 items-baseline gap-4 overflow-hidden">
        <span className="w-8 shrink-0 text-right">{index}</span>
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
