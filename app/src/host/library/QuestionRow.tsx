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
        {/* Reordering stepper pill */}
        <div className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-800/80 overflow-hidden shadow-xs shrink-0">
          <button
            type="button"
            aria-label={t("questionRow.moveUp")}
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="flex h-7 w-7 items-center justify-center text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronUp size={15} />
          </button>
          <div className="h-px w-full bg-zinc-700/80" />
          <button
            type="button"
            aria-label={t("questionRow.moveDown")}
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="flex h-7 w-7 items-center justify-center text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 items-center justify-center rounded-md bg-amber-400/10 px-2 text-[11px] font-bold tracking-wider text-amber-300">
              {t("questionRow.questionNumber")} {index + 1}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-white">{question.content}</h3>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {answers.map((answer) => (
              <li
                key={answer.id}
                className="flex items-center gap-2.5 rounded-xl border border-zinc-700/80 bg-zinc-800/90 px-3 py-1.5 text-xs shadow-sm"
              >
                <span className="font-semibold text-white">{answer.content}</span>
                <span className="flex items-center rounded-md bg-amber-400 px-2 py-0.5 text-[11px] font-black tabular-nums text-zinc-950 shadow-xs">
                  {answer.points} {t("questionRow.pts")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-2 pt-0.5 shrink-0">
          <button
            type="button"
            aria-label={t("questionRow.editAria")}
            onClick={() => onEdit(question.id)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 shadow-xs"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label={t("questionRow.deleteAria")}
            onClick={() => onDelete(question)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-400 transition hover:border-red-500/80 hover:bg-red-500/10 hover:text-red-400 shadow-xs"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
