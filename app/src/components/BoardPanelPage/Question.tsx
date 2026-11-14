interface QuestionProps {
  questionContent: string;
}

function Question({ questionContent }: QuestionProps) {
  return <div className="w-full text-center">{questionContent}</div>;
}

export default Question;
