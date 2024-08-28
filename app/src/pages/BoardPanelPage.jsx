import React from "react";
import { useState, useEffect } from "react";
import TeamStats from "../components/BoardPanelPage/TeamStats.jsx";
import Question from "../components/BoardPanelPage/Question.jsx";
import Answer from "../components/BoardPanelPage/Answer.jsx";
import WrongAnswerMark from "../components/BoardPanelPage/WrongAnswerMark.jsx";

function BoardPanelPage() {
  const [questionPoints, setQuestionPoints] = useState(0);
  const [redTeamName, setRedTeamName] = useState("RED");
  const [redTeamPoints, setRedTeamPoints] = useState(0);
  const [blueTeamName, setBlueTeamName] = useState("BLUE");
  const [blueTeamPoints, setBlueTeamPoints] = useState(0);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    window.api.onStatsTeam((redName, blueName, redPoints, bluePoints) => {
      setRedTeamName(redName);
      setBlueTeamName(blueName);
      setRedTeamPoints(redPoints);
      setBlueTeamPoints(bluePoints);
    });
    window.api.onDisplayQuestion((question) => {
      setQuestion(question);
      setAnswers([]);
    });
    window.api.onDisplayHiddenAnswer((index, idAnswer) => {
      setAnswers((answers) => [
        ...answers,
        { index, idAnswer, content: "", isVisible: false },
      ]);
    });
    window.api.onExposeAnswerOnBoard((answerContent, idAnswer) => {
      setAnswers((prevAnswers) => {
        const updatedAnswers = prevAnswers.map((answer) =>
          answer.idAnswer === idAnswer
            ? { ...answer, content: answerContent, isVisible: true }
            : answer
        );
        return updatedAnswers;
      });
    });
    window.api.onWrongAnswer((team) => {
      if (team == "red") {
      } else {
      }
    });
  }, []);

  return (
    <div className="board">
      <div className="container teamStats">
        <TeamStats
          redName={redTeamName}
          redPoints={redTeamPoints}
          blueName={blueTeamName}
          bluePoints={blueTeamPoints}
        />
      </div>

      <div className="container justify-content-center" style={{ margin: 10 }}>
        <div className="row text-center p-3">
          <div className="col text-center p-3 wrongAnswerRed"></div>
          <div className="col-8">
            <Question questionContent={question} />

            <div className="container text-center p-3">
              <div className="container text-left" id="answerContainer">
                {answers.map((answer) => {
                  return (
                    <Answer
                      isVisible={answer.isVisible}
                      content={answer.content}
                      id={answer.idAnswer}
                      index={answer.index}
                      key={answer.idAnswer}
                    />
                  );
                })}
              </div>
            </div>

            <div className="container">
              <div className="points text-end">Suma {questionPoints}</div>
            </div>
          </div>

          <div className="col text-center p-3 wrongAnswerBlue"></div>
        </div>
      </div>
    </div>
  );
}

export default BoardPanelPage;
