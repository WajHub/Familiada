import React, { useEffect } from "react";
import { useState } from "react";
import BackToHomeButton from "../components/GamePanelPage/BackToHomeButton.jsx";
import Question from "../components/GamePanelPage/Question.jsx";
import Answer from "../components/GamePanelPage/Answer.jsx";

function GamePanelPage() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  window.api.onDisplayQuestionMain((question, first, last) => {
    console.log("Wiadomosc z main=>", question);
    setQuestion(question);
    // document.querySelector("#winRed").disabled = false;
    // document.querySelector("#winBlue").disabled = false;
    // if (first) {
    //   document.querySelector("#prev").classList.add("disabled");
    // } else {
    //   document.querySelector("#prev").classList.remove("disabled");
    // }
    // if (last) {
    //   document.querySelector("#next").classList.add("disabled");
    // } else {
    //   document.querySelector("#next").classList.remove("disabled");
    // }
  });

  window.api.onDisplayAnswer((answer, answerId, index) => {
    setAnswers([...answers, { content: answer, id: answerId, index: index }]);
  });

  useEffect(() => {
    window.api.startGame();
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
