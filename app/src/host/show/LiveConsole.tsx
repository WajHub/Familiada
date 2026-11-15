import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useHostSession } from "../HostSession";
import type { ConsoleAnswer, TeamSide } from "../../types/window";
import { correctAnswerSound, playSound, showAnswerSound, wrongAnswerSound } from "./sounds";
import { useI18n } from "../../i18n/I18nContext";
import FamiliadaStrike from "../../components/BoardPanelPage/FamiliadaStrike";

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
      className={`flex items-center gap-4 rounded-2xl border px-5 py-3 transition-all duration-200 ${
        isAnswered
          ? "border-zinc-800/60 bg-zinc-950/40 opacity-70"
          : "border-zinc-800 bg-zinc-900/90 shadow-sm"
      }`}
    >
      {/* Rank Badge */}
      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800 text-xs font-bold text-zinc-300 shadow-xs">
        {answer.index}
      </span>

      {/* Answer Content */}
      <p className="min-w-0 flex-1 text-lg font-bold text-white tracking-wide">
        {answer.content}
      </p>

      {/* Points Pill */}
      <span className="rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-1.5 text-base font-black tabular-nums text-amber-300 shadow-xs">
        {answer.points}
      </span>

      {/* Status Badges */}
      {answer.status === "guessed" && (
        <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
          <Check size={14} />
          {t("liveConsole.correct")}
        </span>
      )}
      {answer.status === "revealed" && (
        <span className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Eye size={14} />
          {t("liveConsole.exposed")}
        </span>
      )}

      {/* Action Buttons: Show (Reveal) & Correct (Guess) */}
      <button
        type="button"
        disabled={isAnswered}
        onClick={() => reveal("show")}
        className="flex min-h-10 items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
      >
        <Eye size={14} />
        <span>{t("liveConsole.showAnswer")}</span>
      </button>
      <button
        type="button"
        disabled={isAnswered}
        onClick={() => reveal("correct")}
        className="flex min-h-10 items-center gap-1.5 rounded-xl bg-amber-400 px-4 text-xs font-black text-zinc-950 shadow-sm transition hover:bg-amber-300 disabled:opacity-30"
      >
        <Check size={14} />
        <span>{t("liveConsole.correct")}</span>
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
  const isRed = side === "RED";
  const teamClass = isRed
    ? "border-red-900/60 bg-gradient-to-r from-red-950/40 via-zinc-900/80 to-zinc-900/80"
    : "border-blue-900/60 bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-zinc-900/80";
  const solidClass = isRed
    ? "bg-red-600 text-white shadow-md shadow-red-900/30 hover:bg-red-500"
    : "bg-blue-600 text-white shadow-md shadow-blue-900/30 hover:bg-blue-500";

  return (
    <section className={`flex flex-col gap-2 rounded-xl border p-3 backdrop-blur-md ${teamClass}`}>
      {/* Row 1: Team Name + Lost Chances + Points */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {isRed ? t("liveConsole.red") : t("liveConsole.blue")}:
          </span>
          <h3 className="truncate text-base font-bold text-white">{name || side}</h3>
        </div>

        {/* Mini Lost Chances */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-zinc-800/80 bg-zinc-950/70">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex h-5 w-5 items-center justify-center rounded transition-all ${
                i < lostChances
                  ? isRed
                    ? "bg-red-950/80 border border-red-500/50"
                    : "bg-blue-950/80 border border-blue-500/50"
                  : "bg-zinc-900/40 border border-zinc-800/60"
              }`}
            >
              <FamiliadaStrike active={i < lostChances} size={13} />
            </div>
          ))}
        </div>

        {/* Total Points Counter */}
        <div className="flex items-baseline gap-1.5 shrink-0 pl-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">PTS</span>
          <span className="text-xl font-black tabular-nums text-white drop-shadow">{points}</span>
        </div>
      </div>

      {/* Row 2: Strike & Award Round Buttons Side-by-Side */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={lostChances >= 3}
          onClick={() => onStrike(side)}
          className={`min-h-9 rounded-lg px-3 text-xs font-bold transition ${solidClass} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {t("liveConsole.strike")}
        </button>
        <button
          type="button"
          disabled={awardDisabled}
          onClick={() => onAward(side)}
          className={`min-h-9 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-40 ${
            isRed ? "bg-red-600/30" : "bg-blue-600/30"
          }`}
        >
          {t("liveConsole.awardRound")}
        </button>
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
      <header className="flex items-start justify-between gap-4 border-b border-zinc-800/80 bg-zinc-950/60 px-6 py-4 backdrop-blur-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              {t("liveConsole.currentQuestion")}
            </span>
            <span className="flex items-center rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-bold text-amber-300">
              {t("liveConsole.roundPoints")}: <span className="ml-1 text-white font-black">{points}</span>
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white leading-snug">
            {question || t("liveConsole.waitingForRound")}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={requestExitGame}
            className="inline-flex min-h-10 items-center rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
          >
            {t("liveConsole.backToLibrary")}
          </button>
          <button
            type="button"
            disabled={isFirstQuestion}
            onClick={() => window.api.prevQuestion()}
            className="flex min-h-10 items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span>{t("liveConsole.previous")}</span>
          </button>
          <button
            type="button"
            disabled={isLastQuestion}
            onClick={() => window.api.nextQuestion()}
            className="flex min-h-10 items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
          >
            <span>{t("liveConsole.next")}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-3">
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

      <footer className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 bg-zinc-950/40 px-6 py-3">
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
