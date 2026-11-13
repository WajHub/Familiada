import React, { useState } from "react";

function Answer({
  answerContent,
  answerId,
  showAnswerSound,
  correctAnswerSound,
}) {
  const [opacity, setOpacity] = useState(1);

  const [isAnswered, setIsAnswered] = useState(false);

  const handleCorrectAnswer = () => {
    setOpacity(0.5);
    setIsAnswered(true);
    correctAnswerSound.play();
    window.api.guessAnswer(answerId);
  };

  const handleIncorrectAnswer = () => {
    setOpacity(0.5);
    setIsAnswered(true);
    showAnswerSound.play();
    window.api.exposeAnswer(answerId);
  };

  return (
    <div className="row" style={{ opacity: opacity }}>
      <div className="col border border-light rounded mb-2">
        <p
          className="answer-1"
          style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {answerContent}
        </p>

        <button
          className="btn m-1 btn-secondary answer-1"
          disabled={isAnswered}
          onClick={handleIncorrectAnswer}
        >
          Show Answer
        </button>
        <button
          className="btn m-1 btn-outline-success answer-1"
          disabled={isAnswered}
          onClick={handleCorrectAnswer}
        >
          Correct Answer
        </button>
      </div>
    </div>
  );
}

export default Answer;
