import { useEffect, useState } from "react";
import Answer from "../components/BoardPanelPage/Answer";
import Question from "../components/BoardPanelPage/Question";
import TeamStats from "../components/BoardPanelPage/TeamStats";
import WrongAnswerMark from "../components/BoardPanelPage/WrongAnswerMark";

interface BoardAnswer {
  index: number;
  idAnswer: number;
  content: string;
  isVisible: boolean;
}

function BoardPanelPage() {
  const [questionPoints, setQuestionPoints] = useState(0);
  const [redTeamName, setRedTeamName] = useState("RED");
  const [redTeamPoints, setRedTeamPoints] = useState(0);
  const [blueTeamName, setBlueTeamName] = useState("BLUE");
  const [blueTeamPoints, setBlueTeamPoints] = useState(0);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<BoardAnswer[]>([]);
  const [wrongAnswersRed, setWrongAnswersRed] = useState(0);
  const [wrongAnswersBlue, setWrongAnswersBlue] = useState(0);

  useEffect(() => {
    const unsubscribeStatsTeam = window.api.onStatsTeam(
      (redName, blueName, redPoints, bluePoints) => {
        setRedTeamName(redName);
        setBlueTeamName(blueName);
        setRedTeamPoints(redPoints);
        setBlueTeamPoints(bluePoints);
      }
    );
    const unsubscribeDisplayQuestion = window.api.onDisplayQuestion(
      (nextQuestion) => {
        setQuestion(nextQuestion);
        setAnswers([]);
        setWrongAnswersRed(0);
        setWrongAnswersBlue(0);
      }
    );
    const unsubscribeDisplayHiddenAnswer = window.api.onDisplayHiddenAnswer(
      (index, idAnswer) => {
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          { index, idAnswer, content: "", isVisible: false },
        ]);
      }
    );
    const unsubscribeExposeAnswer = window.api.onExposeAnswerOnBoard(
      (answerContent, idAnswer) => {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer.idAnswer === idAnswer
              ? { ...answer, content: answerContent, isVisible: true }
              : answer
          )
        );
      }
    );
    const unsubscribeDisplayPoints = window.api.onDisplayPointsForQuestion(
      (points) => {
        setQuestionPoints(points);
      }
    );
    const unsubscribeWrongAnswer = window.api.onWrongAnswer((team) => {
      if (team === "red") {
        setWrongAnswersRed((prev) => prev + 1);
      } else {
        setWrongAnswersBlue((prev) => prev + 1);
      }
    });
    const unsubscribeDisplayLostChances = window.api.onDisplayLostChances(
      (red, blue) => {
        setWrongAnswersRed(red);
        setWrongAnswersBlue(blue);
      }
    );
    const unsubscribeSyncBoardAnswers = window.api.onSyncBoardAnswers(
      (roundAnswers) => {
        setAnswers(
          roundAnswers.map((a) => ({
            index: a.index,
            idAnswer: a.id,
            content: a.status === "hidden" ? "" : `${a.content} ${a.points}`,
            isVisible: a.status !== "hidden",
          }))
        );
      }
    );

    return () => {
      unsubscribeStatsTeam();
      unsubscribeDisplayQuestion();
      unsubscribeDisplayHiddenAnswer();
      unsubscribeExposeAnswer();
      unsubscribeDisplayPoints();
      unsubscribeWrongAnswer();
      unsubscribeDisplayLostChances();
      unsubscribeSyncBoardAnswers();
    };
  }, []);

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden bg-black font-['CustomFont',sans-serif] text-[3.2vw] font-normal text-[#ffff00]">
      <div className="mx-auto w-full max-w-[1140px] px-4">
        <TeamStats
          redName={redTeamName}
          redPoints={redTeamPoints}
          blueName={blueTeamName}
          bluePoints={blueTeamPoints}
        />
      </div>

      <div className="mx-auto my-2.5 w-full max-w-[1140px] px-4">
        <div className="grid grid-cols-12 items-stretch p-3 text-center">
          <WrongAnswerMark team="RED" amount={wrongAnswersRed} />

          <div className="col-span-8 flex flex-col items-center">
            <Question questionContent={question} />

            <div className="w-full p-3 text-center">
              <div className="w-full text-left" id="answerContainer">
                {answers.map((answer) => (
                  <Answer
                    isVisible={answer.isVisible}
                    content={answer.content}
                    id={answer.idAnswer}
                    index={answer.index}
                    key={answer.idAnswer}
                  />
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="text-right">Suma {questionPoints}</div>
            </div>
          </div>

          <WrongAnswerMark team="BLUE" amount={wrongAnswersBlue} />
        </div>
      </div>
    </div>
  );
}

export default BoardPanelPage;
