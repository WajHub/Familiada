import React from "react";
import ArrowsButtons from "./ArrowsButtons.jsx";
import Question from "./Question.jsx";
import EditDeleteButtons from "./EditDeleteButtons.jsx";

function QuestionsContainer({ questions, update, handleEditQuestion }) {
  return (
    <div
      className="container text-center pt-3 pl-3  mainContainer"
      id="questionsContainer"
      style={{ marginBottom: 10 }}
    >
      {questions.map((question, index) => {
        return (
          <div
            key={question.dataValues.id}
            className="row m-0 mb-3 d-flex justify-content-center border-bottom border-dark"
          >
            <ArrowsButtons />
            <Question question={question} />
            <EditDeleteButtons
              update={update}
              id={question.dataValues.id}
              editQuestion={handleEditQuestion}
            />
          </div>
        );
      })}
    </div>
  );
}

export default QuestionsContainer;
