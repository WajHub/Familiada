import { FormEvent, useState } from "react";
import { useHostSession } from "../HostSession";
import { useI18n } from "../../i18n/I18nContext";
import type { QuestionListItem } from "../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { QuestionDialog } from "./QuestionDialog";
import { QuestionRow } from "./QuestionRow";

export function LibraryPage() {
  const { t } = useI18n();
  const {
    collections,
    selectedCollectionId,
    questions,
    loading,
    errorMessage,
    selectCollection,
    createCollection,
    deleteCollection,
    refreshQuestions,
    moveQuestion,
    removeQuestion,
  } = useHostSession();

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionListItem | null>(null);

  const selected = collections.find((collection) => String(collection.id) === selectedCollectionId);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (nextTitle === "") {
      return;
    }
    setCreating(true);
    try {
      await createCollection(nextTitle);
      setTitle("");
    } finally {
      setCreating(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setEditorOpen(true);
  };

  const openEdit = (id: number) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  return (
    <div className="flex h-full min-h-0">
      <section className="flex w-80 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-4 py-4">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{t("library.collections")}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading && <p className="px-2 py-3 text-sm text-zinc-400">{t("library.loadingCollections")}</p>}
          {!loading && collections.length === 0 && (
            <p className="px-2 py-3 text-sm text-zinc-400">
              {t("library.noCollections")}
            </p>
          )}
          <ul className="flex flex-col gap-2">
            {collections.map((collection) => {
              const id = String(collection.id);
              const selectedRow = id === selectedCollectionId;
              return (
                <li key={collection.id}>
                  <button
                    type="button"
                    onClick={() => selectCollection(id)}
                    className={
                      selectedRow
                        ? "flex w-full items-center justify-between rounded-xl border-2 border-amber-400 bg-zinc-800 px-3.5 py-3 text-left font-bold text-white shadow-md shadow-amber-400/10"
                        : "flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-3 text-left font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
                    }
                  >
                    <span className="truncate">{collection.title}</span>
                    {selectedRow && (
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <form onSubmit={(event) => void create(event)} className="flex flex-col gap-2.5 border-t border-zinc-800 p-3.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300" htmlFor="collection-title">
            {t("library.newCollection")}
          </label>
          <input
            id="collection-title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder-zinc-500 focus:border-amber-400 focus:bg-zinc-950 focus:ring-2 focus:ring-amber-400/20"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-amber-400 px-3.5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-amber-300 disabled:opacity-50"
          >
            {creating ? t("library.creating") : t("library.createCollection")}
          </button>
          <button
            type="button"
            disabled={selectedCollectionId === ""}
            onClick={() => setCollectionToDelete(selectedCollectionId)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-200 disabled:opacity-30"
          >
            {t("library.deleteSelected")}
          </button>
        </form>
      </section>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">{t("sidebar.library")}</p>
            <h2 className="text-xl font-semibold text-zinc-50">
              {selected ? selected.title : t("library.chooseCollection")}
            </h2>
          </div>
          <button
            type="button"
            disabled={!selected}
            onClick={openCreate}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
          >
            {t("library.addQuestion")}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {errorMessage && (
            <p className="mb-4 rounded-lg border border-amber-800 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
              {errorMessage}
            </p>
          )}
          {selected && questions.length === 0 && (
            <p className="text-sm text-zinc-400">
              {t("library.noQuestions")}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {questions.map((question, index) => (
              <QuestionRow
                key={question.id}
                question={question}
                index={index}
                total={questions.length}
                onMove={moveQuestion}
                onEdit={openEdit}
                onDelete={setQuestionToDelete}
              />
            ))}
          </div>
        </div>
      </section>

      <QuestionDialog
        open={editorOpen}
        questionId={editingId}
        onClose={() => setEditorOpen(false)}
        onSaved={refreshQuestions}
      />
      <ConfirmDialog
        open={collectionToDelete !== null}
        title={t("library.deleteCollectionTitle")}
        message={t("library.deleteCollectionMsg")}
        confirmLabel={t("library.deleteCollectionTitle")}
        onClose={() => setCollectionToDelete(null)}
        onConfirm={async () => {
          if (collectionToDelete) {
            await deleteCollection(collectionToDelete);
          }
        }}
      />
      <ConfirmDialog
        open={questionToDelete !== null}
        title={t("library.deleteQuestionTitle")}
        message={
          questionToDelete
            ? `${t("library.deleteQuestionTitle")} “${questionToDelete.content}”?`
            : t("library.deleteQuestionMsg")
        }
        confirmLabel={t("library.deleteQuestionTitle")}
        onClose={() => setQuestionToDelete(null)}
        onConfirm={async () => {
          if (!questionToDelete) {
            return;
          }
          await window.api.deleteQuestion(questionToDelete.id);
          removeQuestion(questionToDelete.id);
        }}
      />
    </div>
  );
}
