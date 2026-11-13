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
      if (response != undefined) {
        setQuestions(response);
      } else {
        console.error("dataValues is undefined");
      }
    });
  };

  useEffect(() => {
    window.api.get_title().then((response) => {
      if (response && response.dataValues) {
        setTitle(response.dataValues.title);
      } else if (response && response.title) {
        setTitle(response.title);
      } else {
        console.error("Collection title is undefined");
      }
    });
  }, []);

  useEffect(() => {
    updateQuestions();
  }, []);

  const editQuestion = (id) => {
    setIdQuestion(id);
    setNewQuestion(false);
    displayOverlay();
  };

  const deleteQuestion = (id) => {
    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.dataValues.id !== id)
    );
  };

  const moveQuestion = (index, direction) => {
    const newIndex = index + direction;
    setQuestions((currentQuestions) => {
      if (newIndex < 0 || newIndex >= currentQuestions.length) {
        return currentQuestions;
      }

      const reorderedQuestions = [...currentQuestions];
      [reorderedQuestions[index], reorderedQuestions[newIndex]] = [
        reorderedQuestions[newIndex],
        reorderedQuestions[index],
      ];
      return reorderedQuestions;
    });
  };

  return (
    <div className="content">
      <h3 id="title">{title}</h3>
      <QuestionsContainer
        questions={questions}
        handleEditQuestion={editQuestion}
        handleDeleteQuestion={deleteQuestion}
        handleMoveQuestion={moveQuestion}
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
        <TeamNamesFormOverlay questions={questions} />
      </Overlay>
      <Nav displayOverlayNameOfTeams={displayOverlayNameOfTeams} />
    </div>
  );
}

export default QuestionsPanelPage;
