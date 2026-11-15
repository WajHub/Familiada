import { useEffect, useState } from "react";
import Answer from "../components/BoardPanelPage/Answer";
import Question from "../components/BoardPanelPage/Question";
import TeamStats from "../components/BoardPanelPage/TeamStats";
import WrongAnswerMark from "../components/BoardPanelPage/WrongAnswerMark";
import { useI18n } from "../i18n/I18nContext";

interface BoardAnswer {
  index: number;
  idAnswer: number;
  content: string;
  isVisible: boolean;
}

function BoardPanelPage() {
  const { t } = useI18n();
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
    <div className="fixed inset-0 flex h-full w-full flex-col justify-between overflow-hidden bg-[#050608] p-2 sm:p-3 lg:p-3.5 text-[#ffd000]">
      {/* Top Header with Team Scores & Center Round Display */}
      <TeamStats
        redName={redTeamName}
        redPoints={redTeamPoints}
        blueName={blueTeamName}
        bluePoints={blueTeamPoints}
        roundPoints={questionPoints}
      />

      {/* Main Electronic Matrix Board */}
      <main className="familiada-matrix-bg relative my-1 sm:my-1.5 flex min-h-0 flex-1 flex-col justify-between rounded-xl border border-zinc-800/90 bg-[#08090c] p-3 sm:p-4 lg:p-5 shadow-2xl">
        <div className="grid h-full min-h-0 grid-cols-12 items-stretch gap-2 sm:gap-4">
          {/* Red Team Strikes Column (Left) */}
          <div className="col-span-2 flex h-full items-center justify-center">
            <WrongAnswerMark team="RED" amount={wrongAnswersRed} />
          </div>

          {/* Question & Answers Area (Center) */}
          <div className="col-span-8 flex h-full min-h-0 flex-col justify-between">
            {/* Question Banner */}
            <Question questionContent={question} />

            {/* Answer Rows List */}
            <div
              id="answerContainer"
              className="flex-1 min-h-0 flex flex-col justify-evenly w-full py-0.5 sm:py-1"
            >
              {answers.map((answer) => (
                <Answer
                  key={answer.idAnswer}
                  id={answer.idAnswer}
                  index={answer.index}
                  content={answer.content}
                  isVisible={answer.isVisible}
                  totalAnswers={answers.length}
                />
              ))}
            </div>

            {/* Bottom Round Points Sum */}
            <div className="flex w-full shrink-0 items-baseline justify-end pt-1 sm:pt-1.5">
              <div
                style={{ fontSize: "min(2.35vw, 4.4vh)" }}
                className="flex items-baseline gap-4 sm:gap-6 font-['CustomFont',sans-serif] leading-none tracking-wider text-[#ffd000] drop-shadow-[0_0_8px_rgba(255,208,0,0.6)]"
              >
                <span>{t("board.total").toUpperCase()}</span>
                <span className="min-w-[3.5rem] sm:min-w-[4rem] text-right tabular-nums">
                  {questionPoints}
                </span>
              </div>
            </div>
          </div>

          {/* Blue Team Strikes Column (Right) */}
          <div className="col-span-2 flex h-full items-center justify-center">
            <WrongAnswerMark team="BLUE" amount={wrongAnswersBlue} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default BoardPanelPage;
