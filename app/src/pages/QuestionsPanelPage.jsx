import React, { useEffect, useState } from "react";
import Nav from "../components/QuestionPanelPage/Nav.jsx";
import QuestionsContainer from "../components/QuestionPanelPage/QuestionsContainer.jsx";
import Overlay from "../components/Overlay.jsx";
import NewQuestionForm from "../components/QuestionPanelPage/NewQuestionForm.jsx";

function QuestionsPanelPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isVisibleOverlay, setOverlay] = useState(false);

  const displayOverlay = () => {
    console.log("displayOverlay");
    setOverlay(true);
  };

  const hideOverlay = () => {
    setOverlay(false);
  };

  const updateQuestions = () => {
    window.api.get_questions().then((response) => {
      setQuestions(response);
    });
  };

  useEffect(() => {
    window.api.get_title().then((response) => {
      setTitle(response.dataValues.title);
    });
  });

  useEffect(() => {
    updateQuestions();
  }, []);

  return (
    <div className="content">
      <h3 id="title">{title}</h3>
      <QuestionsContainer questions={questions} />
      <div className="row m-0">
        <button
          id="newQestionButton"
          onClick={displayOverlay}
          type="button"
          className="btn btn-outline-primary col"
        >
          Add new question
        </button>
      </div>
      <Overlay isVisible={isVisibleOverlay} hideOverlay={hideOverlay}>
        <NewQuestionForm />
      </Overlay>
      <Nav />
    </div>
  );
}

export default QuestionsPanelPage;
