import React from "react";

function Buttons({ displayNewAnswer }) {
  return (
    <div className="container text-center">
      <button
        id="newAnswerButton"
        onClick={displayNewAnswer}
        type="button"
        className="btn btn-light"
      >
        Add new answer
      </button>
      <div className="p-2">
        <input type="submit" className="btn btn-success m-1" />
      </div>
    </div>
  );
}

export default Buttons;
