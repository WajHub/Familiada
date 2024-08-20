import React, { useEffect, useState } from "react";
import Nav from "../components/QuestionPanelPage/Nav.jsx";
import QuestionsContainer from "../components/QuestionPanelPage/QuestionsContainer.jsx";

function QuestionsPanelPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const updateQuestions = () => {
    window.api.get_questions().then((response) => {
      console.log("updateQuestions");
      console.log(response);
      setQuestions(response);
    });
  };

  useEffect(() => {
    window.api.get_title().then((response) => {
      setTitle(response.dataValues.title);
    });
  });

  useEffect(() => {
    console.log("useEffect");
    updateQuestions();
  }, []);

  return (
    <div className="content">
      <h3 id="title">{title}</h3>
      <QuestionsContainer questions={questions} />
      <Nav />
    </div>
  );
}

export default QuestionsPanelPage;
