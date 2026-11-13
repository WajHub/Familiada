import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeamNamesFormOverlay({ questions }) {
  const navigate = useNavigate();
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const startGame = async () => {
    const questionsId = questions.map((question) =>
      question.dataValues ? question.dataValues.id : question.id
    );
    const response = await window.api.setGameData(team1, team2, questionsId);
    console.log(response);
    navigate("/GamePanel");
  };

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <form id="nameOfTeamsForm">
        <label htmlFor="team1" style={{ color: "rgb(249, 112, 112)" }}>
          Name of team RED:
        </label>
        <input
          type="text"
          id="team1"
          name="team1"
          required
          value={team1}
          onChange={(event) => setTeam1(event.target.value)}
        />
        <br />
        <br />
        <label htmlFor="team2" style={{ color: "rgb(112, 112, 249)" }}>
          Name of team BLUE:
        </label>
        <input
          type="text"
          id="team2"
          name="team2"
          required
          value={team2}
          onChange={(event) => setTeam2(event.target.value)}
        />
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
