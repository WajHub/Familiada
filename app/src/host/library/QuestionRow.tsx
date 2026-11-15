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
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            aria-label={t("questionRow.moveUp")}
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-200 hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            aria-label={t("questionRow.moveDown")}
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-200 hover:bg-zinc-800 disabled:opacity-30"
          >
            <ChevronDown size={16} />
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">{t("questionRow.questionNumber")} {index + 1}</p>
          <h3 className="mt-1 text-base font-medium text-zinc-50">{question.content}</h3>
          <ul className="mt-3 flex flex-col gap-1">
            {answers.map((answer) => (
              <li key={answer.id} className="text-sm text-zinc-300">
                {answer.content}
                <span className="ml-2 text-zinc-500">{answer.points} {t("questionRow.pts")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={t("questionRow.editAria")}
            onClick={() => onEdit(question.id)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 hover:bg-zinc-800"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label={t("questionRow.deleteAria")}
            onClick={() => onDelete(question)}
            className="rounded-lg border border-zinc-600 bg-zinc-900 p-2 text-zinc-100 hover:bg-zinc-800"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
