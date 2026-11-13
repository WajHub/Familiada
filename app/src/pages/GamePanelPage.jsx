import React, { useEffect } from "react";
import { useState } from "react";
import BackToHomeButton from "../components/GamePanelPage/BackToHomeButton.jsx";
import Question from "../components/GamePanelPage/Question.jsx";
import Answer from "../components/GamePanelPage/Answer.jsx";
import WrongAnswerButton from "../components/GamePanelPage/WrongAnswerButton.jsx";
import NavQuestions from "../components/GamePanelPage/NavQuestions.jsx";
import WinTeamButton from "../components/GamePanelPage/WinTeamButton.jsx";

import startRoundResource from "../audio/StartRound.mp3";
import correctAnswerResource from "../audio/CorrectAnswer.mp3";
import wrongAnswerResource from "../audio/WrongAnswer.mp3";
import showAnswerResource from "../audio/ShowAnswer.mp3";

const startRoundSound = new Audio(startRoundResource);
const correctAnswerSound = new Audio(correctAnswerResource);
const wrongAnswerSound = new Audio(wrongAnswerResource);
const showAnswerSound = new Audio(showAnswerResource);

function GamePanelPage() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [points, setPoints] = useState(0);
  const [redName, setRedName] = useState("");
  const [blueName, setBlueName] = useState("");
  const [redPoints, setRedPoints] = useState(0);
  const [bluePoints, setBluePoints] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(true);
  const [isRoundWon, setIsRoundWon] = useState(false);

  useEffect(() => {
    const unsubscribeDisplayQuestion = window.api.onDisplayQuestionMain((
      question,
      first,
      last
    ) => {
      console.log("display question main");
      console.log("First", first);
      console.log("Last", last);
      setQuestion(question);
      setAnswers([]);
      setIsFirstQuestion(first);
      setIsLastQuestion(last);
      setIsRoundWon(false);
      // startRoundSound.play();
    });
    const unsubscribeDisplayAnswer = window.api.onDisplayAnswer((
      answer,
      answerId,
      index
    ) => {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { content: answer, id: answerId, index: index },
      ]);
    });
    const unsubscribeDisplayPoints = window.api.onDisplayPointsForQuestion((points) => {
      setPoints(points);
    });
    const unsubscribeStatsTeam = window.api.onStatsTeam((
      redName,
      blueName,
      redPoints,
      bluePoints
    ) => {
      setRedName(redName);
      setBlueName(blueName);
      setRedPoints(redPoints);
      setBluePoints(bluePoints);
    });
    window.api.startGame();

    return () => {
      unsubscribeDisplayQuestion();
      unsubscribeDisplayAnswer();
      unsubscribeDisplayPoints();
      unsubscribeStatsTeam();
    };
  }, []);

  const handleWin = (teamColor) => {
    setIsRoundWon(true);
    window.api.win(teamColor);
  };

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
              showAnswerSound={showAnswerSound}
              correctAnswerSound={correctAnswerSound}
            />
          );
        })}
      </div>
      <div className="container text-center mt-2 h3" style={{ color: "white" }}>
        Suma {points}
      </div>
      <div className="container p-4">
        <div className="row">
          <WrongAnswerButton
            teamColor={"RED"}
            wrongAnswerAudio={wrongAnswerSound}
          />
          <WrongAnswerButton
            teamColor={"BLUE"}
            wrongAnswerAudio={wrongAnswerSound}
          />
        </div>
      </div>
      <div className="container p-4">
        <div className="row">
          <WinTeamButton
            teamColor={"RED"}
            disabled={isRoundWon}
            onWin={handleWin}
          />
          <WinTeamButton
            teamColor={"BLUE"}
            disabled={isRoundWon}
            onWin={handleWin}
          />
        </div>
      </div>
      <div className="container pb-4">
        <div className="row">
          <div className="col" id="redTeam">
            {redName}: {redPoints}
          </div>
          <div className="col" id="blueTeam">
            {blueName}: {bluePoints}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <NavQuestions type="Previous" disabled={isFirstQuestion} />
          <NavQuestions type="Next" disabled={isLastQuestion} />
        </div>
      </div>
      <BackToHomeButton />
    </div>
  );
}

export default GamePanelPage;
