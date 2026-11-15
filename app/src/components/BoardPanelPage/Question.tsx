interface QuestionProps {
  questionContent: string;
}

export function Question({ questionContent }: QuestionProps) {
  if (!questionContent) {
    return null;
  }

  return (
    <div className="w-full pb-3 text-center">
      <div className="inline-block max-w-full truncate rounded-md border border-amber-900/40 bg-black/60 px-6 py-1.5 font-['CustomFont',sans-serif] text-[2vw] tracking-wider text-[#ffd000] drop-shadow-[0_0_8px_rgba(255,208,0,0.5)]">
        {questionContent.toUpperCase()}
      </div>
    </div>
  );
}

export default Question;
