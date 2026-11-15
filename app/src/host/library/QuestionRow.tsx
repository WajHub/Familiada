import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { fetchAnswers } from "../api";
import { useI18n } from "../../i18n/I18nContext";
import type { AnswerSummary, QuestionListItem } from "../types";

interface QuestionRowProps {
  question: QuestionListItem;
  index: number;
  total: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onEdit: (id: number) => void;
  onDelete: (question: QuestionListItem) => void;
}

export function QuestionRow({
  question,
  index,
  total,
  onMove,
  onEdit,
  onDelete,
}: QuestionRowProps) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<AnswerSummary[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const nextAnswers = await fetchAnswers(question.id);
      if (active) {
        setAnswers(nextAnswers);
      }
    };

    void load();
    const unsubscribe = window.api.onUpdateAnswers(() => {
      void load();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [question.id]);

  return (
    <article className="rounded-2xl border border-zinc-800/90 bg-zinc-900/90 p-5 shadow-sm transition-all hover:border-zinc-700/80">
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-1.5 pt-0.5">
          <button
            type="button"
            aria-label={t("questionRow.moveUp")}
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
          >
            <ChevronUp size={15} />
          </button>
          <button
            type="button"
            aria-label={t("questionRow.moveDown")}
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
          >
            <ChevronDown size={15} />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 items-center justify-center rounded-md bg-amber-400/10 px-2 text-[11px] font-bold tracking-wider text-amber-300">
              {t("questionRow.questionNumber")} {index + 1}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {answers.length} {answers.length === 1 ? "answer" : "answers"}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-white">{question.content}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {answers.map((answer) => (
              <li
                key={answer.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs text-zinc-300"
              >
                <span>{answer.content}</span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  {answer.points} {t("questionRow.pts")}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            aria-label={t("questionRow.editAria")}
            onClick={() => onEdit(question.id)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={t("questionRow.deleteAria")}
            onClick={() => onDelete(question)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-300 transition hover:border-red-900/60 hover:bg-red-950/40 hover:text-red-300"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
