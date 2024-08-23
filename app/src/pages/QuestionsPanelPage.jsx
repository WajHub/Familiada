import React, { useEffect, useState } from "react";
import Nav from "../components/QuestionPanelPage/Nav.jsx";
import QuestionsContainer from "../components/QuestionPanelPage/QuestionsContainer.jsx";
import Overlay from "../components/Overlay.jsx";
import NewQuestionForm from "../components/QuestionPanelPage/NewQuestionForm.jsx";
import TeamNamesFormOverlay from "../components/QuestionPanelPage/TeamNamesFormOverlay.jsx";

function QuestionsPanelPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isVisibleOverlayFormNewQuestion, setOverlayFormNewQuestion] =
    useState(false);
  const [isVisibleOverlayNameOfTeam, setOverlayNameOfTeam] = useState(false);
  const [isNewQuestion, setNewQuestion] = useState(true);
  const [idQuestion, setIdQuestion] = useState(-1);

  const displayOverlay = () => {
    setOverlayFormNewQuestion(true);
  };

  const hideOverlay = () => {
    setNewQuestion(true);
    setOverlayFormNewQuestion(false);
  };

  const displayOverlayNameOfTeams = () => {
    setOverlayNameOfTeam(true);
  };

  const hideOverlayNameOfTeam = () => {
    setOverlayNameOfTeam(false);
  };

  const updateQuestions = () => {
    hideOverlay();
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

  const editQuestion = (id) => {
    setIdQuestion(id);
    setNewQuestion(false);
    displayOverlay();
  };

  return (
    <div className="content">
      <h3 id="title">{title}</h3>
      <QuestionsContainer
        questions={questions}
        update={updateQuestions}
        handleEditQuestion={editQuestion}
      />
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
      <Overlay
        isVisible={isVisibleOverlayFormNewQuestion}
        hideOverlay={hideOverlay}
      >
        <NewQuestionForm
          newForm={isNewQuestion}
          update={updateQuestions}
          id={idQuestion}
        />
      </Overlay>
      <Overlay
        isVisible={isVisibleOverlayNameOfTeam}
        hideOverlay={hideOverlayNameOfTeam}
      >
        <TeamNamesFormOverlay />
      </Overlay>
      <Nav displayOverlayNameOfTeams={displayOverlayNameOfTeams} />
    </div>
  );
}

export default QuestionsPanelPage;
