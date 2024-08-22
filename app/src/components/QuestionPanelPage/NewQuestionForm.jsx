import React, { useState } from "react";
import NewQuestion from "./NewQuestionOverlay/NewQuestion.jsx";
import SubmitButtons from "./NewQuestionOverlay/SubmitButtons.jsx";
import NewAnswer from "./NewQuestionOverlay/NewAnswer.jsx";

function NewQuestionForm({ newForm, update }) {
  const [answers, setAnswers] = useState([<NewAnswer key={0} />]);

  const handleAddAnswer = () => {
    const newAnswer = <NewAnswer key={answers.length} />;
    setAnswers([...answers, newAnswer]);
  };

  const saveQuestion = (event) => {
    event.preventDefault();
    const form = document.querySelector("#form_addNewQuestion");
    var question = document.getElementById("questionInput").value;
    var answersForm = document.getElementsByClassName("answerInput");
    var pointsForm = document.getElementsByClassName("pointsInput");
    var id = form.questionId;

    var answers = [];
    var asnwerPoints = [];

    for (let i = 0; i < answersForm.length; i++) {
      var answerContent = answersForm[i].value;
      var points = pointsForm[i].value;
      answers.push(answerContent);
      asnwerPoints.push(points);
    }
    if (newForm) window.api.addNewQuestion(question, answers, asnwerPoints);
    else window.api.updateQuestion(id, question, answers, asnwerPoints);
    update();
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <form id="form_addNewQuestion">
        <NewQuestion />

        <div className="answerContainer container">{answers}</div>

        <SubmitButtons
          displayNewAnswer={handleAddAnswer}
          submitForm={saveQuestion}
        />
      </form>
    </div>
  );
}

export default NewQuestionForm;
