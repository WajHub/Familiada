import React from "react";

function Buttons({ displayNewAnswer, submitForm }) {
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
        <button
          id="newAnswerButton"
          onClick={submitForm}
          type="button"
          className="btn btn-success m-1"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Buttons;
