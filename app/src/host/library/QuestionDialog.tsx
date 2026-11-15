import { FormEvent, useEffect, useState } from "react";
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
          return { ...answer, points: Number.isFinite(parsed) ? parsed : 0 };
        }
        return { ...answer, content: value };
      })
    );
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const contents = answers.map((answer) => answer.content);
      const points = answers.map((answer) => answer.points);
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
      title={isNew ? t("questionDialog.newQuestion") : t("questionDialog.editQuestion")}
      onClose={onClose}
    >
      <form onSubmit={(event) => void save(event)} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          {t("questionDialog.questionLabel")}
          <input
            required
            autoFocus
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-base text-zinc-50 outline-none ring-amber-400 focus:ring-2"
          />
        </label>

        <div className="flex flex-col gap-3">
          {answers.map((answer, index) => (
            <div key={answer.id} className="grid grid-cols-[1fr_6rem_auto] items-end gap-2">
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                {t("questionDialog.answerLabel")} {index + 1}
                <input
                  required
                  value={answer.content}
                  onChange={(event) => updateAnswer(answer.id, "content", event.target.value)}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none ring-amber-400 focus:ring-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                {t("questionDialog.pointsLabel")}
                <input
                  required
                  type="number"
                  min={1}
                  max={100}
                  value={answer.points}
                  onChange={(event) => updateAnswer(answer.id, "points", event.target.value)}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-50 outline-none ring-amber-400 focus:ring-2"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setAnswers((current) => current.filter((item) => item.id !== answer.id))
                }
                className="rounded-lg border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                {t("questionDialog.removeAnswer")}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setAnswers((current) => [...current, emptyAnswer()])}
            className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
          >
            {t("questionDialog.addAnswer")}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-50"
          >
            {saving ? t("questionDialog.saving") : t("questionDialog.saveQuestion")}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
