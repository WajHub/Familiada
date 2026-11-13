import React from "react";
import ArrowsButtons from "./ArrowsButtons.jsx";
import Question from "./Question.jsx";
import EditDeleteButtons from "./EditDeleteButtons.jsx";

function QuestionsContainer({
  questions,
  handleEditQuestion,
  handleDeleteQuestion,
  handleMoveQuestion,
}) {
  return (
    <div
      className="container text-center pt-3 pl-3  mainContainer"
      id="questionsContainer"
      style={{ marginBottom: 10 }}
    >
      {questions.map((question, index) => {
        const questionId = question.dataValues.id;
        return (
          <div
            key={questionId}
            className="row m-0 mb-3 d-flex justify-content-center border-bottom border-dark"
          >
            <ArrowsButtons
              onMoveUp={() => handleMoveQuestion(index, -1)}
              onMoveDown={() => handleMoveQuestion(index, 1)}
            />
            <Question question={question} />
            <EditDeleteButtons
              update={update}
              id={questionId}
              editQuestion={handleEditQuestion}
              deleteQuestion={handleDeleteQuestion}
            />
          </div>
        );
      })}
    </div>
  );
}

export default QuestionsContainer;
