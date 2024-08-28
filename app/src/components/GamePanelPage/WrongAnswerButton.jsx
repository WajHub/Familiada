import React from "react";

function WrongAnswerButton({ teamColor, wrongAnswerAudio }) {
  const handleWrongAnswer = () => {
    // wrongAnswerAudio.play();
    window.api.wrongAnswer({ teamColor });
  };
  return (
    <div className="col">
      <div className={"wrongAnswerRed text-center"}>
        <button
          onClick={handleWrongAnswer}
          type="button"
          className={teamColor == "RED" ? "btn btn-danger" : "btn btn-primary"}
        >
          Wrong Answer {teamColor}
        </button>
      </div>
    </div>
  );
}

export default WrongAnswerButton;
