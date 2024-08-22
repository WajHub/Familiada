import React from "react";

function NewAnswer() {
  const handleDeleteAnswer = (event) => {
    event.currentTarget.parentNode.remove();
  };
  return (
    <div className="row p-3 answerRow">
      <label htmlFor="answer" className="col-2 mt-1 mb-1">
        Answer:
      </label>
      <input
        required=""
        type="text"
        className="col-5 answer answerInput m-1"
        name="answer"
      />
      <input
        required=""
        type="number"
        className="pointsInput col-2 m-1"
        name="quantity"
        min="1"
        max="100"
      />
      <button
        className="btn btn-danger btn-sm col-2 m-1"
        onClick={handleDeleteAnswer}
      >
        Delete
      </button>
    </div>
  );
}

export default NewAnswer;
