import { useEffect, useState } from "react";
import { useHostSession } from "../HostSession";
import type { ConsoleAnswer, TeamSide } from "../../types/window";
import { correctAnswerSound, playSound, showAnswerSound, wrongAnswerSound } from "./sounds";
import { useI18n } from "../../i18n/I18nContext";

interface AnswerRowProps {
  answer: ConsoleAnswer;
}

function AnswerRow({ answer }: AnswerRowProps) {
  const { t } = useI18n();
  const isAnswered = answer.status !== "hidden";

  const reveal = (kind: "show" | "correct") => {
    if (isAnswered) {
      return;
    }
    if (kind === "correct") {
      playSound(correctAnswerSound);
      window.api.guessAnswer(answer.id);
      return;
    }
    playSound(showAnswerSound);
    window.api.exposeAnswer(answer.id);
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 transition-opacity duration-200 ${
        isAnswered ? "opacity-60" : "opacity-100"
      }`}
    >
      <span className="w-8 text-sm font-semibold text-zinc-500">{answer.index}</span>
      <p className="min-w-0 flex-1 text-lg font-medium text-zinc-50">{answer.content}</p>
      <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-sm font-semibold tabular-nums text-amber-300">
        {answer.points}
      </span>
      {answer.status === "guessed" && (
        <span className="rounded-lg bg-amber-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
          {t("liveConsole.correct")}
        </span>
      )}
      {answer.status === "revealed" && (
        <span className="rounded-lg bg-zinc-700/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-300">
          {t("liveConsole.exposed")}
        </span>
      )}
      <button
        type="button"
        disabled={isAnswered}
        onClick={() => reveal("show")}
        className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
      >
        {t("liveConsole.showAnswer")}
      </button>
      <button
        type="button"
        disabled={isAnswered}
        onClick={() => reveal("correct")}
        className="min-h-11 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
      >
        {t("liveConsole.correct")}
      </button>
    </div>
  );
}

interface TeamColumnProps {
  side: TeamSide;
  name: string;
  points: number;
  lostChances: number;
  awardDisabled: boolean;
  onStrike: (side: TeamSide) => void;
  onAward: (side: TeamSide) => void;
}

function TeamColumn({
  side,
  name,
  points,
  lostChances,
  awardDisabled,
  onStrike,
  onAward,
}: TeamColumnProps) {
  const { t } = useI18n();
  const teamClass =
    side === "RED"
      ? "border-red-900/80 bg-red-950/40"
      : "border-blue-900/80 bg-blue-950/40";
  const solidClass =
    side === "RED"
      ? "bg-red-600 text-white hover:bg-red-500"
      : "bg-blue-600 text-white hover:bg-blue-500";

  return (
    <section className={`flex flex-col gap-3 rounded-2xl border p-4 ${teamClass}`}>
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          {side === "RED" ? t("liveConsole.red") : t("liveConsole.blue")}
        </p>
        <h3 className="truncate text-2xl font-semibold text-white">{name || side}</h3>
        <p className="text-3xl font-semibold tabular-nums text-white">{points}</p>
      </div>

      <button
        type="button"
        disabled={lostChances >= 3}
        onClick={() => onStrike(side)}
        className={`min-h-12 rounded-xl px-4 text-base font-semibold ${solidClass} disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {t("liveConsole.strike")}
      </button>
      <button
        type="button"
        disabled={awardDisabled}
        onClick={() => onAward(side)}
        className={`min-h-12 rounded-xl border border-white/20 px-4 text-base font-semibold text-white hover:bg-white/10 disabled:opacity-40 ${
          side === "RED" ? "bg-red-600/30" : "bg-blue-600/30"
        }`}
      >
        {t("liveConsole.awardRound")}
      </button>

      <div className="mt-auto flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          {t("liveConsole.lostChances")}
        </span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                i < lostChances
                  ? side === "RED"
                    ? "border-red-500 bg-red-600 text-white shadow-md shadow-red-900/50"
                    : "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-900/50"
                  : "border-zinc-800 bg-zinc-900/80 text-zinc-600"
              }`}
            >
              {i < lostChances ? "✕" : "·"}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LiveConsole() {
  const { t } = useI18n();
  const { requestExitGame } = useHostSession();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<ConsoleAnswer[]>([]);
  const [points, setPoints] = useState(0);
  const [redName, setRedName] = useState("");
  const [blueName, setBlueName] = useState("");
  const [redPoints, setRedPoints] = useState(0);
  const [bluePoints, setBluePoints] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(true);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [lostChancesRed, setLostChancesRed] = useState(0);
  const [lostChancesBlue, setLostChancesBlue] = useState(0);

  useEffect(() => {
    const unsubscribeDisplayQuestion = window.api.onDisplayQuestionMain(
      (nextQuestion, first, last, roundPoints, isAwarded) => {
        setQuestion(nextQuestion);
        setIsFirstQuestion(first);
        setIsLastQuestion(last);
        if (typeof roundPoints === "number") {
          setPoints(roundPoints);
        }
        if (typeof isAwarded === "boolean") {
          setIsRoundWon(isAwarded);
        } else {
          setIsRoundWon(false);
        }
      }
    );
    const unsubscribeDisplayAnswer = window.api.onDisplayAnswer((content, answerId, index) => {
      setAnswers((current) => {
        if (current.some((answer) => answer.id === answerId)) {
          return current;
        }
        return [
          ...current,
          { content, id: answerId, index, points: 0, status: "hidden" },
        ];
      });
    });
    const unsubscribeSyncRoundAnswers = window.api.onSyncRoundAnswers((nextAnswers) => {
      setAnswers(nextAnswers);
    });
    const unsubscribeDisplayLostChances = window.api.onDisplayLostChances((red, blue) => {
      setLostChancesRed(red);
      setLostChancesBlue(blue);
    });
    const unsubscribeDisplayPoints = window.api.onDisplayPointsForQuestion((nextPoints) => {
      setPoints(nextPoints);
    });
    const unsubscribeStatsTeam = window.api.onStatsTeam((nextRedName, nextBlueName, nextRedPoints, nextBluePoints) => {
      setRedName(nextRedName);
      setBlueName(nextBlueName);
      setRedPoints(nextRedPoints);
      setBluePoints(nextBluePoints);
    });

    window.api.startGame();

    return () => {
      unsubscribeDisplayQuestion();
      unsubscribeDisplayAnswer();
      unsubscribeSyncRoundAnswers();
      unsubscribeDisplayLostChances();
      unsubscribeDisplayPoints();
      unsubscribeStatsTeam();
    };
  }, []);

  const award = (side: TeamSide) => {
    setIsRoundWon(true);
    window.api.win(side);
  };

  const orderedAnswers = [...answers].sort((left, right) => left.index - right.index);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-800 px-6 py-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {t("liveConsole.currentQuestion")}
          </p>
          <h2 className="text-2xl font-semibold text-zinc-50">
            {question || t("liveConsole.waitingForRound")}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {t("liveConsole.roundPoints")}{" "}
            <span className="font-semibold text-amber-300">{points}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={requestExitGame}
            className="inline-flex min-h-11 items-center rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            {t("liveConsole.backToLibrary")}
          </button>
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => window.api.prevQuestion()}
            className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
          >
            {t("liveConsole.previous")}
          </button>
          <button
            type="button"
            disabled={isLastQuestion}
            onClick={() => window.api.nextQuestion()}
            className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
          >
            {t("liveConsole.next")}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {orderedAnswers.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {t("liveConsole.answersPlaceholder")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orderedAnswers.map((answer) => (
              <AnswerRow key={answer.id} answer={answer} />
            ))}
          </div>
        )}
      </div>

      <footer className="grid grid-cols-2 gap-4 border-t border-zinc-800 px-6 py-4">
        <TeamColumn
          side="RED"
          name={redName}
          points={redPoints}
          lostChances={lostChancesRed}
          awardDisabled={isRoundWon}
          onStrike={(side) => {
            playSound(wrongAnswerSound);
            window.api.wrongAnswer({ teamColor: side });
          }}
          onAward={award}
        />
        <TeamColumn
          side="BLUE"
          name={blueName}
          points={bluePoints}
          lostChances={lostChancesBlue}
          awardDisabled={isRoundWon}
          onStrike={(side) => {
            playSound(wrongAnswerSound);
            window.api.wrongAnswer({ teamColor: side });
          }}
          onAward={award}
        />
      </footer>
    </div>
  );
}
