import React from "react";

function Answer({ answerContent, answerId }) {
  return (
    <div class="row">
      <div class="col">
        <button class="btn m-1 btn-secondary answer-1" id={answerId}>
          {answerContent}
        </button>
        <button class="btn m-1 btn-outline-success answer-1" id={answerId}>
          Correct Answer
        </button>
      </div>
    </div>
  );
}

export default Answer;
