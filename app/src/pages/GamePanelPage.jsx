import React, { useEffect } from "react";
import { useState } from "react";
import BackToHomeButton from "../components/GamePanelPage/BackToHomeButton.jsx";
import Question from "../components/GamePanelPage/Question.jsx";

function GamePanelPage() {
  const [question, setQuestion] = useState("TEST");

  window.api.onDisplayQuestionMain((question, first, last) => {
    console.log("question", question);
    setQuestion(question);
  });

  useEffect(() => {}, []);

  return (
    <div>
      {" "}
      <Question questionContent={question} />
      <BackToHomeButton />
    </div>
  );
}

export default GamePanelPage;
