import { useEffect, useState } from "react";
import { useHostSession } from "../HostSession";
import type { RevealedAnswer } from "../types";
import type { TeamSide } from "../../types/window";
import { correctAnswerSound, playSound, showAnswerSound, wrongAnswerSound } from "./sounds";

interface AnswerRowProps {
  answer: RevealedAnswer;
}

function AnswerRow({ answer }: AnswerRowProps) {
  const [answered, setAnswered] = useState(false);

  const reveal = (kind: "show" | "correct") => {
    if (answered) {
      return;
    }
    setAnswered(true);
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
        answered ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="w-8 text-sm font-semibold text-zinc-500">{answer.index}</span>
      <p className="min-w-0 flex-1 text-lg font-medium text-zinc-50">{answer.content}</p>
      <button
        type="button"
        disabled={answered}
        onClick={() => reveal("show")}
        className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
      >
        Show
      </button>
      <button
        type="button"
        disabled={answered}
        onClick={() => reveal("correct")}
        className="min-h-11 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
      >
        Correct
      </button>
    </div>
  );
}

interface TeamColumnProps {
  side: TeamSide;
  name: string;
  points: number;
  awardDisabled: boolean;
  onStrike: (side: TeamSide) => void;
  onAward: (side: TeamSide) => void;
}

function TeamColumn({ side, name, points, awardDisabled, onStrike, onAward }: TeamColumnProps) {
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
        <p className="text-xs uppercase tracking-wide text-zinc-400">{side === "RED" ? "Red" : "Blue"}</p>
        <h3 className="truncate text-2xl font-semibold text-white">{name || side}</h3>
        <p className="text-3xl font-semibold tabular-nums text-white">{points}</p>
      </div>
      <button
        type="button"
        onClick={() => onStrike(side)}
        className={`min-h-12 rounded-xl px-4 text-base font-semibold ${solidClass}`}
      >
        Strike
      </button>
      <button
        type="button"
        disabled={awardDisabled}
        onClick={() => onAward(side)}
        className={`min-h-12 rounded-xl border border-white/20 px-4 text-base font-semibold text-white hover:bg-white/10 disabled:opacity-40 ${
          side === "RED" ? "bg-red-600/30" : "bg-blue-600/30"
        }`}
      >
        Award round
      </button>
    </section>
  );
}

export function LiveConsole() {
  const { requestExitGame } = useHostSession();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<RevealedAnswer[]>([]);
  const [points, setPoints] = useState(0);
  const [redName, setRedName] = useState("");
  const [blueName, setBlueName] = useState("");
  const [redPoints, setRedPoints] = useState(0);
  const [bluePoints, setBluePoints] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(true);
  const [isRoundWon, setIsRoundWon] = useState(false);

  useEffect(() => {
    const unsubscribeDisplayQuestion = window.api.onDisplayQuestionMain(
      (nextQuestion, first, last) => {
        setQuestion(nextQuestion);
        setAnswers([]);
        setIsFirstQuestion(first);
        setIsLastQuestion(last);
        setIsRoundWon(false);
      }
    );
    const unsubscribeDisplayAnswer = window.api.onDisplayAnswer((content, answerId, index) => {
      setAnswers((current) => {
        if (current.some((answer) => answer.id === answerId)) {
          return current;
        }
        return [...current, { content, id: answerId, index }];
      });
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
    // playSound(startRoundSound);

    return () => {
      unsubscribeDisplayQuestion();
      unsubscribeDisplayAnswer();
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
          <p className="text-xs uppercase tracking-wide text-zinc-500">Current question</p>
          <h2 className="text-2xl font-semibold text-zinc-50">{question || "Waiting for the round…"}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Round points <span className="font-semibold text-amber-300">{points}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={requestExitGame}
            className="inline-flex min-h-11 items-center rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            Back to library
          </button>
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => window.api.prevQuestion()}
            className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={isLastQuestion}
            onClick={() => window.api.nextQuestion()}
            className="min-h-11 rounded-lg border border-zinc-600 bg-zinc-900 px-4 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {orderedAnswers.length === 0 ? (
          <p className="text-sm text-zinc-500">Answers appear here as the round starts.</p>
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
