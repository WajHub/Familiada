import React, { useEffect } from "react";
import { useState } from "react";
import BackToHomeButton from "../components/GamePanelPage/BackToHomeButton.jsx";
import Question from "../components/GamePanelPage/Question.jsx";
import Answer from "../components/GamePanelPage/Answer.jsx";

function GamePanelPage() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    window.api.startGame();
    window.api.onDisplayQuestionMain((question, first, last) => {
      setQuestion(question);
    });
    window.api.onDisplayAnswer((answer, answerId, index) => {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { content: answer, id: answerId, index: index },
      ]);
    });
  }, []);

  return (
    <div>
      {" "}
      <Question questionContent={question} />
      <div className="container answerContainer text-center">
        {answers.map((answer) => {
          return (
            <Answer
              key={answer.id}
              answerContent={answer.content}
              answerId={answer.id}
            />
          );
        })}
      </div>
      <BackToHomeButton />
    </div>
  );
}

export default GamePanelPage;
