import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Folder, Pencil, Plus, Trash2, X, HelpCircle } from "lucide-react";
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
    copyCollection,
    updateCollectionTitle,
    deleteCollection,
    refreshQuestions,
    moveQuestion,
    reorderQuestionsList,
    removeQuestion,
  } = useHostSession();

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionListItem | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [copying, setCopying] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoverTarget, setHoverTarget] = useState<{
    cardIndex: number;
    position: "above" | "below";
  } | null>(null);

  const selected = collections.find((collection) => String(collection.id) === selectedCollectionId);

  const startEditCollection = (id: string, currentTitle: string) => {
    setEditingCollectionId(id);
    setEditingTitle(currentTitle);
  };

  const cancelEditCollection = () => {
    setEditingCollectionId(null);
    setEditingTitle("");
  };

  const saveCollectionTitle = async () => {
    if (!editingCollectionId) {
      return;
    }
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      return;
    }
    setSavingTitle(true);
    try {
      await updateCollectionTitle(editingCollectionId, trimmed);
      setEditingCollectionId(null);
    } finally {
      setSavingTitle(false);
    }
  };

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(0);

  const stopAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current !== null) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    scrollSpeedRef.current = 0;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current !== null) {
      return;
    }
    const scrollStep = () => {
      const container = scrollContainerRef.current;
      if (container && scrollSpeedRef.current !== 0) {
        container.scrollTop += scrollSpeedRef.current;
        scrollAnimationRef.current = requestAnimationFrame(scrollStep);
      } else {
        stopAutoScroll();
      }
    };
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
  }, [stopAutoScroll]);

  const checkAutoScroll = useCallback(
    (clientY: number) => {
      const container = scrollContainerRef.current;
      if (!container || draggedIndex === null) {
        stopAutoScroll();
        return;
      }
      const rect = container.getBoundingClientRect();
      const EDGE_THRESHOLD = 120; // px zone from top/bottom where auto-scroll activates
      const MAX_SPEED = 24; // max px per frame

      const distFromTop = clientY - rect.top;
      const distFromBottom = rect.bottom - clientY;

      if (distFromTop < EDGE_THRESHOLD && distFromTop >= -40) {
        const ratio = 1 - Math.max(0, distFromTop) / EDGE_THRESHOLD;
        scrollSpeedRef.current = -Math.max(4, Math.round(ratio * MAX_SPEED));
        startAutoScroll();
      } else if (distFromBottom < EDGE_THRESHOLD && distFromBottom >= -40) {
        const ratio = 1 - Math.max(0, distFromBottom) / EDGE_THRESHOLD;
        scrollSpeedRef.current = Math.max(4, Math.round(ratio * MAX_SPEED));
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    },
    [draggedIndex, startAutoScroll, stopAutoScroll]
  );

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  const openEdit = (id: number) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  function calculateNewIndex(
    fromIndex: number,
    targetIndex: number,
    position: "above" | "below"
  ): number {
    if (fromIndex === targetIndex) {
      return fromIndex;
    }
    if (position === "above") {
      return fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
    } else {
      return fromIndex < targetIndex ? targetIndex : targetIndex + 1;
    }
  }

  const handleDragStart = (index: number) => {
    requestAnimationFrame(() => {
      setDraggedIndex(index);
    });
  };

  const handleDragEnd = () => {
    stopAutoScroll();
    setDraggedIndex(null);
    setHoverTarget(null);
  };

  const handleCardDragOver = (e: React.DragEvent, cardIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null) {
      return;
    }

    checkAutoScroll(e.clientY);

    if (cardIndex === draggedIndex) {
      setHoverTarget(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isTopHalf = relY < rect.height / 2;
    const position = isTopHalf ? "above" : "below";
    setHoverTarget({ cardIndex, position });
  };

  const handleCardDrop = (e: React.DragEvent, cardIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();

    if (draggedIndex === null) {
      setHoverTarget(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    const isTopHalf = relY < rect.height / 2;
    const position = isTopHalf ? "above" : "below";

    const newIndex = calculateNewIndex(draggedIndex, cardIndex, position);
    if (newIndex !== draggedIndex) {
      reorderQuestionsList(draggedIndex, newIndex);
    }

    setDraggedIndex(null);
    setHoverTarget(null);
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null) {
      return;
    }

    checkAutoScroll(e.clientY);

    const container = scrollContainerRef.current;
    if (container && questions.length > 0) {
      const cards = container.querySelectorAll("article");
      if (cards.length > 0) {
        const firstRect = cards[0].getBoundingClientRect();
        const lastRect = cards[cards.length - 1].getBoundingClientRect();
        if (e.clientY < firstRect.top) {
          setHoverTarget({ cardIndex: 0, position: "above" });
        } else if (e.clientY > lastRect.bottom) {
          setHoverTarget({ cardIndex: questions.length - 1, position: "below" });
        }
      }
    }
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    if (
      scrollContainerRef.current &&
      !scrollContainerRef.current.contains(e.relatedTarget as Node)
    ) {
      stopAutoScroll();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (draggedIndex !== null && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    stopAutoScroll();
    if (draggedIndex !== null && hoverTarget !== null) {
      const newIndex = calculateNewIndex(
        draggedIndex,
        hoverTarget.cardIndex,
        hoverTarget.position
      );
      if (newIndex !== draggedIndex) {
        reorderQuestionsList(draggedIndex, newIndex);
      }
    }
    setDraggedIndex(null);
    setHoverTarget(null);
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Collections Sidebar */}
      <section className="flex w-80 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="flex h-20 items-center border-b border-zinc-800 px-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Folder size={16} className="text-zinc-400" />
            <h1 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t("library.collections")}
            </h1>
          </div>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading && (
            <p className="px-2 py-3 text-sm text-zinc-400">{t("library.loadingCollections")}</p>
          )}
          {!loading && collections.length === 0 && (
            <p className="px-2 py-3 text-sm text-zinc-400">{t("library.noCollections")}</p>
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
                        : "flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-3 text-left font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                    }
                  >
                    <span className="truncate">{collection.title}</span>
                    {selectedRow && (
                      <span className="h-2 w-2 rounded-full bg-amber-400 shadow-xs" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Create / Delete Collection Footer */}
        <form
          onSubmit={(event) => void create(event)}
          className="flex flex-col gap-2.5 border-t border-zinc-800 p-3.5 bg-zinc-950/70"
        >
          <label
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-400"
            htmlFor="collection-title"
          >
            {t("library.newCollection")}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="collection-title"
              required
              placeholder={t("library.newCollectionPlaceholder")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-white outline-none transition placeholder-zinc-500 focus:border-amber-400 focus:bg-zinc-950"
            />
            <button
              type="submit"
              disabled={creating || !title.trim()}
              title={t("library.createCollection")}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40 shadow-xs shrink-0"
            >
              <Plus size={16} />
            </button>
          </div>

          {selectedCollectionId && (
            <button
              type="button"
              onClick={() => setCollectionToDelete(selectedCollectionId)}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-red-500/60 hover:bg-red-950/30 hover:text-red-300"
            >
              <Trash2 size={13} />
              <span>{t("library.deleteSelected")}</span>
            </button>
          )}
        </form>
      </section>

      {/* Main Question Management Area */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header Bar */}
        <header className="flex h-20 items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/50 px-6 backdrop-blur-xs">
          <div className="min-w-0">
            {selected && editingCollectionId === String(selected.id) ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void saveCollectionTitle();
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEditCollection();
                    }
                  }}
                  disabled={savingTitle}
                  className="rounded-xl border-2 border-amber-400 bg-zinc-900 px-3.5 py-1 text-xl font-bold text-white outline-none"
                />
                <button
                  type="button"
                  disabled={savingTitle || !editingTitle.trim()}
                  onClick={() => void saveCollectionTitle()}
                  title={t("library.saveCollectionName")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  disabled={savingTitle}
                  onClick={cancelEditCollection}
                  title={t("library.cancelEdit")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h2 className="m-0 truncate text-xl font-bold leading-7 text-white">
                  {selected ? selected.title : t("library.chooseCollection")}
                </h2>
                {selected && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title={t("library.editCollection")}
                      onClick={() => startEditCollection(String(selected.id), selected.title)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-400 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 shadow-xs"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={copying}
                      title={t("library.copyCollection")}
                      onClick={async () => {
                        setCopying(true);
                        try {
                          await copyCollection(String(selected.id));
                        } finally {
                          setCopying(false);
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-400 transition hover:border-amber-400/80 hover:bg-amber-400/10 hover:text-amber-300 shadow-xs disabled:opacity-40"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-zinc-950 shadow-md shadow-amber-400/15 transition hover:bg-amber-300 disabled:opacity-40"
          >
            <Plus size={16} />
            <span>{t("library.addQuestion")}</span>
          </button>
        </header>

        {/* Question List View */}
        <div
          ref={scrollContainerRef}
          onDragOver={handleContainerDragOver}
          onDragLeave={handleContainerDragLeave}
          onDrop={handleContainerDrop}
          onWheel={handleWheel}
          className="flex-1 overflow-y-auto p-6"
        >
          {errorMessage && (
            <p className="mb-4 rounded-xl border border-amber-800 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              {errorMessage}
            </p>
          )}

          {/* Empty State */}
          {selected && questions.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 mb-5">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">
                {t("library.emptyStateTitle")}
              </h3>
              <p className="max-w-md text-xs text-zinc-400 leading-relaxed mb-6">
                {t("library.emptyStateSubtitle")}
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-amber-300 shadow-sm"
              >
                <Plus size={15} />
                <span>{t("library.addFirstQuestion")}</span>
              </button>
            </div>
          )}

          {/* Question Cards List */}
          <div
            className="flex flex-col gap-4"
            onDragOver={handleContainerDragOver}
            onDrop={handleContainerDrop}
          >
            {questions.map((question, index) => {
              const isDragging = draggedIndex === index;
              const showIndicatorAbove =
                hoverTarget !== null &&
                hoverTarget.cardIndex === index &&
                hoverTarget.position === "above";

              const showIndicatorBelow =
                hoverTarget !== null &&
                hoverTarget.cardIndex === index &&
                hoverTarget.position === "below";

              return (
                <QuestionRow
                  key={question.id}
                  question={question}
                  index={index}
                  total={questions.length}
                  isDragging={isDragging}
                  showIndicatorAbove={showIndicatorAbove}
                  showIndicatorBelow={showIndicatorBelow}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleCardDragOver}
                  onDrop={handleCardDrop}
                  onMove={moveQuestion}
                  onEdit={openEdit}
                  onDelete={setQuestionToDelete}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Dialogs */}
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
