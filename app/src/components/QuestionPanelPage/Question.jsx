import React from "react";
import { useState, useEffect } from "react";
import Answer from "./Answer.jsx";

function Question({ question }) {
  const [answers, setAnswers] = useState([]);

  const updateAnswers = () => {
    window.api.get_answers(question.dataValues.id).then((response) => {
      setAnswers(response);
    });
  };

  useEffect(() => {
    updateAnswers();
  }, []);

  return (
    <div className="col-9">
      <div className="questionRow row" id={question.dataValues.id}>
        <div className="questionCol col">
          Question: <strong>{question.dataValues.content}</strong>
        </div>
        {answers.map((answer) => {
          return <Answer answer={answer} key={answer.dataValues.id} />;
        })}
      </div>
    </div>
  );
}

export default Question;
