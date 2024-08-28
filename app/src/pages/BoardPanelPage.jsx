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
      setAnswers((answers) => [...answers, { index, idAnswer }]);
    });
    window.api.onExposeAnswerOnBoard((answerContent, idAnswer, points) => {
      console.log("TEST", answerContent, idAnswer, points);
      console.log(answers);
      answers.forEach((answer) => {
        console.log("TESTa", answer);
        if (answer.idAnswer == idAnswer) {
          console.log(answerContent);
          answer.isVisible = true;
          answer.content = answerContent;
        }
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
          redName={"RED"}
          redPoints={0}
          blueName={"BLUE"}
          bluePoints={0}
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
                      isVisible={false}
                      content=""
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
