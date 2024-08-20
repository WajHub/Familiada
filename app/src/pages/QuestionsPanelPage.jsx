import React, { useEffect, useState } from "react";
import Nav from "../components/QuestionPanelPage/Nav.jsx";
import QuestionsContainer from "../components/QuestionPanelPage/QuestionsContainer.jsx";

function QuestionsPanelPage() {
  const [title, setTitle] = useState("");

  useEffect(() => {
    window.api.get_title().then((response) => {
      setTitle(response.dataValues.title);
    });
  });

  return (
    <div>
      <h3 id="title">{title}</h3>
      <QuestionsContainer />
      <Nav />
    </div>
  );
}

export default QuestionsPanelPage;
