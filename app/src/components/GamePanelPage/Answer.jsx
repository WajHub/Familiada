import React from "react";
import startRoundResource from "../../audio/StartRound.mp3";
import correctAnswerResource from "../../audio/CorrectAnswer.mp3";
import wrongAnswerResource from "../../audio/WrongAnswer.mp3";
import showAnswerResource from "../../audio/ShowAnswer.mp3";

function Answer({ answerContent, answerId }) {
  const startRoundSound = new Audio(startRoundResource);
  const correctAnswerSound = new Audio(correctAnswerResource);
  const wrongAnswerSound = new Audio(wrongAnswerResource);
  const showAnswerSound = new Audio(showAnswerResource);

  const disableButtons = (idButton) => {
    const selector = "[id='" + idButton + "']";
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button) => {
      button.disabled = true;
    });
  };

  const handleCorrectAnswer = (event) => {
    disableButtons(event.target.id);
    showAnswerSound.play();
    window.api.guessAnswer(event.target.id);
  };

  const handleIncorrectAnswer = (event) => {
    disableButtons(event.target.id);
    wrongAnswerSound.play();
    window.api.exposeAnswer(event.target.id);
  };

  return (
    <div className="row">
      <div className="col">
        <button
          className="btn m-1 btn-secondary answer-1"
          id={answerId}
          onClick={handleIncorrectAnswer}
        >
          {answerContent}
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
