import React from "react";

function Answer({
  answerContent,
  answerId,
  showAnswerSound,
  correctAnswerSound,
}) {
  const disableButtons = (idButton) => {
    const selector = "[id='" + idButton + "']";
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      button.disabled = true;
    });
  };

  const handleCorrectAnswer = (event) => {
    disableButtons(event.target.id);
    correctAnswerSound.play();
    window.api.guessAnswer(event.target.id);
  };

  const handleIncorrectAnswer = (event) => {
    disableButtons(event.target.id);
    showAnswerSound.play();
    window.api.exposeAnswer(event.target.id);
  };

  return (
    <div className="row">
      <div className="col border border-light rounded mb-2">
        <p
          className="answer-1"
          style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {answerContent}
        </p>

        <button
          className="btn m-1 btn-secondary answer-1"
          id={answerId}
          onClick={handleIncorrectAnswer}
        >
          Show Answer
        </button>
        <button
          className="btn m-1 btn-outline-success answer-1"
          id={answerId}
          onClick={handleCorrectAnswer}
        >
          Correct Answer
        </button>
      </div>
    </div>
  );
}

export default Answer;
