import React from "react";
import { useNavigate } from "react-router-dom";

function TeamNamesFormOverlay() {
  const navigate = useNavigate();

  async function getQuestionsId() {
    var questionsId = [];
    var questions = document.getElementsByClassName("questionRow");

    for (var i = 0; i < questions.length; i++) {
      questionsId.push(questions[i].id);
    }
    return questionsId;
  }

  const startGame = () => {
    var team1 = document.getElementById("team1").value;
    var team2 = document.getElementById("team2").value;
    getQuestionsId().then((questionsId) => {
      window.api.setGameData(team1, team2, questionsId);
    });
    navigate("/GamePanel");
  };

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <form id="nameOfTeamsForm">
        <label htmlFor="team1" style={{ color: "rgb(249, 112, 112)" }}>
          Name of team RED:
        </label>
        <input type="text" id="team1" name="team1" required />
        <br />
        <br />
        <label htmlFor="team2" style={{ color: "rgb(112, 112, 249)" }}>
          Name of team BLUE:
        </label>
        <input type="text" id="team2" name="team2" required />
        <br />
        <br />
        <div className="row">
          <div className="col d-flex justify-content-center">
            <button
              onClick={() => startGame()}
              type="button"
              className="btn btn-success"
            >
              Start
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TeamNamesFormOverlay;
