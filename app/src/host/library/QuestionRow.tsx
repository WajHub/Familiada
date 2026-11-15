import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripHorizontal, Pencil, Trash2 } from "lucide-react";
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
  isDragging?: boolean;
  showIndicatorAbove?: boolean;
  showIndicatorBelow?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export function QuestionRow({
  question,
  index,
  total,
  onMove,
  onEdit,
  onDelete,
  isDragging = false,
  showIndicatorAbove = false,
  showIndicatorBelow = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: QuestionRowProps) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<AnswerSummary[]>([]);
  const cardRef = useRef<HTMLElement>(null);

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
    <div className="flex flex-col gap-2">
      {/* Insertion drop indicator line (above) */}
      {showIndicatorAbove && (
        <div
          onDragOver={(e) => onDragOver?.(e, index)}
          onDrop={(e) => onDrop?.(e, index)}
          className="flex items-center gap-2 py-1 -my-2 z-10 animate-pulse"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-400 shadow-lg shadow-amber-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80" />
        </div>
      )}

      <article
        ref={cardRef}
        onDragOver={(e) => onDragOver?.(e, index)}
        onDrop={(e) => onDrop?.(e, index)}
        className={`rounded-2xl border transition-all duration-150 ${
          isDragging
            ? "opacity-35 border-dashed border-amber-400/60 bg-amber-400/5 shadow-none scale-[0.99]"
            : "border-zinc-800 bg-zinc-900/90 shadow-md"
        } p-5`}
      >
        {/* Header bar: Question number, Drag Handle & Action buttons */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          {/* Left: Question / Round Number Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-black tracking-wide text-zinc-950 shadow-xs">
              {t("questionRow.questionNumber")} {index + 1}
            </span>
          </div>

          {/* Center: Drag Handler (placed in the middle as requested) */}
          <div className="flex flex-1 items-center justify-center">
            <div
              role="button"
              tabIndex={total > 1 ? 0 : -1}
              draggable={total > 1}
              onDragStart={(e) => {
                if (total <= 1) return;
                if (cardRef.current) {
                  const rect = cardRef.current.getBoundingClientRect();
                  e.dataTransfer.setDragImage(cardRef.current, rect.width / 2, 24);
                }
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(index));
                onDragStart?.(index);
              }}
              onDragEnd={() => {
                onDragEnd?.();
              }}
              title={total > 1 ? t("questionRow.dragHandleTooltip") : undefined}
              aria-label={t("questionRow.dragHandleTooltip")}
              className={
                total > 1
                  ? "group flex h-8 w-16 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 shadow-xs transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 cursor-grab active:cursor-grabbing select-none"
                  : "flex h-8 w-16 items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-800/30 text-zinc-600 opacity-40 cursor-not-allowed select-none"
              }
            >
              <GripHorizontal
                size={18}
                className={
                  total > 1
                    ? "text-zinc-500 transition group-hover:text-amber-400"
                    : "text-zinc-600"
                }
              />
            </div>
          </div>

          {/* Right Controls: Reorder Up/Down + Edit + Delete */}
          <div className="flex items-center gap-1.5">
            {/* Move Up */}
            <button
              type="button"
              aria-label={t("questionRow.moveUp")}
              title={t("questionRow.moveUp")}
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-zinc-700/80 disabled:hover:bg-zinc-800/80 disabled:hover:text-zinc-400 shadow-xs"
            >
              <ChevronUp size={15} />
            </button>

            {/* Move Down */}
            <button
              type="button"
              aria-label={t("questionRow.moveDown")}
              title={t("questionRow.moveDown")}
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-zinc-700/80 disabled:hover:bg-zinc-800/80 disabled:hover:text-zinc-400 shadow-xs"
            >
              <ChevronDown size={15} />
            </button>

            {/* Edit Button */}
            <button
              type="button"
              aria-label={t("questionRow.editAria")}
              title={t("questionRow.editAria")}
              onClick={() => onEdit(question.id)}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-zinc-700/80 bg-zinc-800/80 px-3 text-xs font-semibold text-zinc-200 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 shadow-xs"
            >
              <Pencil size={13} />
              <span>{t("questionRow.edit")}</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              aria-label={t("questionRow.deleteAria")}
              title={t("questionRow.deleteAria")}
              onClick={() => onDelete(question)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition hover:border-red-500/80 hover:bg-red-500/10 hover:text-red-400 shadow-xs"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Question Prompt Title */}
        <h3 className="pt-1 text-lg font-bold text-white tracking-wide leading-snug">
          {question.content}
        </h3>

        {/* Ranked Answers Grid (2-Column structured layout) */}
        {answers.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-2.5 gap-y-1.5">
            {answers.map((answer, answerIndex) => (
              <div
                key={answer.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-zinc-950/50 px-3.5 py-2"
              >
                {/* Left: Rank Badge + Content */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 text-[11px] font-bold text-zinc-300">
                    {answerIndex + 1}
                  </span>
                  <span className="truncate text-sm font-semibold text-zinc-100" title={answer.content}>
                    {answer.content}
                  </span>
                </div>

                {/* Right: Points Tag */}
                <span className="shrink-0 rounded-lg bg-zinc-800/80 px-2.5 py-0.5 text-xs font-bold tabular-nums text-zinc-300">
                  {answer.points} {t("questionRow.pts")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs italic text-zinc-500">
            {t("library.noQuestions")}
          </p>
        )}
      </article>

      {/* Insertion drop indicator line (below) */}
      {showIndicatorBelow && (
        <div
          onDragOver={(e) => onDragOver?.(e, index)}
          onDrop={(e) => onDrop?.(e, index)}
          className="flex items-center gap-2 py-1 -my-2 z-10 animate-pulse"
        >
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-400 shadow-lg shadow-amber-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/80" />
        </div>
      )}
    </div>
  );
}
