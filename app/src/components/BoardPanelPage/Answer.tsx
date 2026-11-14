interface AnswerProps {
  id: number;
  index: number;
  content: string;
  isVisible: boolean;
}

function Answer({ index, content, isVisible }: AnswerProps) {
  return (
    <div className="w-full text-left">
      {index}. {isVisible ? content : "_____________"}
    </div>
  );
}

export default Answer;
