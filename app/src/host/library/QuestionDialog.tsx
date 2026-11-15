import { FormEvent, useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { fetchAnswers, fetchQuestion } from "../api";
import { useI18n } from "../../i18n/I18nContext";
import type { AnswerDraft } from "../types";
import { Dialog } from "../ui/Dialog";

interface QuestionDialogProps {
  open: boolean;
  questionId: number | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function emptyAnswer(): AnswerDraft {
  return { id: crypto.randomUUID(), content: "", points: 1 };
}

export function QuestionDialog({ open, questionId, onClose, onSaved }: QuestionDialogProps) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<AnswerDraft[]>([emptyAnswer()]);
  const [saving, setSaving] = useState(false);
  const isNew = questionId === null;

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    const load = async () => {
      if (questionId === null) {
        setPrompt("");
        setAnswers([emptyAnswer()]);
        return;
      }

      const question = await fetchQuestion(questionId);
      const existingAnswers = await fetchAnswers(questionId);
      if (!active) {
        return;
      }
      setPrompt(question.content);
      setAnswers(
        existingAnswers.length > 0
          ? existingAnswers.map((answer) => ({
              id: answer.id,
              content: answer.content,
              points: answer.points,
            }))
          : [emptyAnswer()]
      );
    };

    void load();
    return () => {
      active = false;
    };
  }, [open, questionId]);

  const updateAnswer = (answerId: string | number, field: "content" | "points", value: string) => {
    setAnswers((current) =>
      current.map((answer) => {
        if (answer.id !== answerId) {
          return answer;
        }
        if (field === "points") {
          const parsed = Number(value);
          return { ...answer, points: Number.isFinite(parsed) ? Math.max(0, parsed) : 0 };
        }
        return { ...answer, content: value };
      })
    );
  };

  const removeAnswer = (id: string | number) => {
    if (answers.length <= 1) {
      return;
    }
    setAnswers((current) => current.filter((item) => item.id !== id));
  };

  const addAnswer = () => {
    setAnswers((current) => [...current, emptyAnswer()]);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const sortedAnswers = [...answers].sort(
        (a, b) => (Number(b.points) || 0) - (Number(a.points) || 0)
      );
      const contents = sortedAnswers.map((answer) => answer.content);
      const points = sortedAnswers.map((answer) => answer.points);
      if (questionId === null) {
        await window.api.addNewQuestion(prompt, contents, points);
      } else {
        await window.api.updateQuestion(questionId, prompt, contents, points);
      }
      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      size="lg"
      title={isNew ? t("questionDialog.newQuestion") : t("questionDialog.editQuestion")}
      onClose={onClose}
    >
      <form onSubmit={(event) => void save(event)} className="flex flex-col gap-5">
        {/* Question Prompt */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="question-prompt"
            className="text-xs font-bold uppercase tracking-wider text-zinc-300"
          >
            {t("questionDialog.questionLabel")}
          </label>
          <textarea
            id="question-prompt"
            required
            autoFocus
            rows={2}
            value={prompt}
            placeholder={t("questionDialog.questionPlaceholder")}
            onChange={(event) => setPrompt(event.target.value)}
            className="w-full resize-none rounded-xl border-2 border-zinc-700 bg-zinc-950/80 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder-zinc-500 focus:border-amber-400 focus:bg-zinc-950 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Answers Table Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            {t("questionDialog.answerLabel")}
          </span>

          {/* Table Column Headers */}
          <div className="grid grid-cols-[2.5rem_1fr_6rem_2.5rem] items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="text-center">{t("questionDialog.tableRank")}</span>
            <span>{t("questionDialog.tableAnswer")}</span>
            <span className="text-center">{t("questionDialog.tablePoints")}</span>
            <span className="text-center">{t("questionDialog.tableActions")}</span>
          </div>

          {/* Answer Rows List */}
          <div className="flex flex-col gap-2">
            {answers.map((answer, index) => {
              const isLast = index === answers.length - 1;

              return (
                <div
                  key={answer.id}
                  className="grid grid-cols-[2.5rem_1fr_6rem_2.5rem] items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-2 shadow-xs transition-all hover:border-zinc-700"
                >
                  {/* Rank Badge */}
                  <div className="flex justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800 text-xs font-bold text-zinc-300 shadow-xs">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content Input */}
                  <input
                    required
                    value={answer.content}
                    placeholder={`${t("questionDialog.answerPlaceholder")} ${index + 1}`}
                    onChange={(event) => updateAnswer(answer.id, "content", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        if (isLast) {
                          addAnswer();
                        }
                      }
                    }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-sm font-semibold text-white outline-none transition placeholder-zinc-600 focus:border-amber-400 focus:bg-zinc-950 focus:ring-1 focus:ring-amber-400/30"
                  />

                  {/* Points Input */}
                  <input
                    required
                    type="number"
                    min={0}
                    max={100}
                    value={answer.points}
                    onChange={(event) => updateAnswer(answer.id, "points", event.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-2 py-2 text-center text-sm font-black tabular-nums text-amber-300 outline-none transition focus:border-amber-400 focus:bg-zinc-950 focus:ring-1 focus:ring-amber-400/30"
                  />

                  {/* Action: Remove */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      aria-label={t("questionDialog.removeAnswer")}
                      disabled={answers.length <= 1}
                      onClick={() => removeAnswer(answer.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-800/80 text-zinc-400 transition hover:border-red-500/70 hover:bg-red-950/40 hover:text-red-300 disabled:opacity-20"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={addAnswer}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
          >
            <Plus size={14} />
            <span>{t("questionDialog.addAnswer")}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving || !prompt.trim()}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-md shadow-amber-400/15 transition hover:bg-amber-300 disabled:opacity-50"
            >
              <Check size={16} />
              <span>
                {saving ? t("questionDialog.saving") : t("questionDialog.saveQuestion")}
              </span>
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
