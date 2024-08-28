import React, { useState, useEffect } from "react";
import NewQuestion from "./NewQuestionOverlay/NewQuestion.jsx";
import SubmitButtons from "./NewQuestionOverlay/SubmitButtons.jsx";
import NewAnswer from "./NewQuestionOverlay/NewAnswer.jsx";

function NewQuestionForm({ newForm, update, id }) {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleAddAnswer = () => {
    const newAnswer = <NewAnswer key={answers.length} answer={""} points={0} />;
    setAnswers((answers) => [...answers, newAnswer]);
  };

  useEffect(() => {
    if (!newForm) {
      window.api.getQuestions(id).then((question) => {
        setQuestion(question.dataValues.content);
        window.api.get_answers(id).then((answersResponse) => {
          answersResponse.forEach((answer, index) => {
            const newAnswer = (
              <NewAnswer
                key={index}
                answer={answer.dataValues.content}
                points={answer.dataValues.points}
              />
            );
            setAnswers((answers) => [...answers, newAnswer]);
          });
        });
      });
    } else {
      setAnswers((answers) => [
        <NewAnswer key={answers.length} answer={""} points={0} />,
      ]);
    }
  }, []);

  const saveQuestion = (event) => {
    event.preventDefault();
    const form = document.querySelector("#form_addNewQuestion");
    var question = document.getElementById("questionInput").value;
    var answersForm = document.getElementsByClassName("answerInput");
    var pointsForm = document.getElementsByClassName("pointsInput");

    var answers = [];
    var asnwerPoints = [];

    for (let i = 0; i < answersForm.length; i++) {
      var answerContent = answersForm[i].value;
      var points = pointsForm[i].value;
      answers.push(answerContent);
      asnwerPoints.push(points);
    }
    if (newForm) window.api.addNewQuestion(question, answers, asnwerPoints);
    else {
      window.api.updateQuestion(id, question, answers, asnwerPoints);
    }
    update();
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <form id="form_addNewQuestion" onSubmit={saveQuestion}>
        <NewQuestion questionsContent={question} />

        <div className="answerContainer container">{answers}</div>

        <SubmitButtons displayNewAnswer={handleAddAnswer} />
      </form>
    </div>
  );
}

export default NewQuestionForm;
