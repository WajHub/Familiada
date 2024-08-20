import React from "react";

function NewQuestionForm() {
  return (
    <div className="container">
      <div className="h-100 d-flex align-items-center justify-content-center">
        <form id="form_addNewQuestion" newQuestion={true} questionId={-1}>
          <div className="col-xs-4 pb-4">
            <label htmlFor="ex3">Question:</label>
            <input
              className="form-control questionInput"
              id="questionInput"
              type="text"
              required
            />
          </div>

          <div className="answerContainer container"> </div>

          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <button
                  id="newAnswerButton"
                  onClick="displayAddingNewAnswer()"
                  type="button"
                  className="btn btn-light"
                >
                  Add new answer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewQuestionForm;
