interface QuestionProps {
  questionContent: string;
}

export function Question({ questionContent }: QuestionProps) {
  if (!questionContent) {
    return null;
  }

  return (
    <div className="w-full pb-1.5 sm:pb-2 text-center shrink-0">
      <div
        style={{ fontSize: "min(1.85vw, 3.8vh)" }}
        className="inline-block max-w-full truncate rounded-md border border-amber-900/40 bg-black/60 px-5 py-1 font-['CustomFont',sans-serif] leading-tight tracking-wider text-[#ffd000] drop-shadow-[0_0_8px_rgba(255,208,0,0.5)]"
      >
        {questionContent.toUpperCase()}
      </div>
    </div>
  );
}

export default Question;
