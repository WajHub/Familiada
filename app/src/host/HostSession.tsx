import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { fetchCollections, fetchQuestions } from "./api";
import type { CollectionSummary, QuestionListItem } from "./types";

interface HostSessionValue {
  collections: CollectionSummary[];
  selectedCollectionId: string;
  selectedCollection: CollectionSummary | null;
  questions: QuestionListItem[];
  loading: boolean;
  errorMessage: string | null;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  confirmExitOpen: boolean;
  requestExitGame: () => void;
  cancelExitGame: () => void;
  confirmExitGame: () => void;
  isBoardOpen: boolean;
  openBoard: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  undoGameAction: () => void;
  redoGameAction: () => void;
  selectCollection: (id: string) => void;
  createCollection: (title: string) => Promise<void>;
  copyCollection: (id: string) => Promise<void>;
  updateCollectionTitle: (id: string, title: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  refreshQuestions: () => Promise<void>;
  moveQuestion: (index: number, direction: -1 | 1) => void;
  removeQuestion: (id: number) => void;
}

const HostSessionContext = createContext<HostSessionValue | null>(null);

interface HostSessionProviderProps {
  children: ReactNode;
}

export function HostSessionProvider({ children }: HostSessionProviderProps) {
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const questionsRef = useRef<QuestionListItem[]>([]);
  questionsRef.current = questions;
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const navigate = useNavigate();

  const requestExitGame = useCallback(() => {
    if (isGameActive) {
      setConfirmExitOpen(true);
    } else {
      navigate("/");
    }
  }, [isGameActive, navigate]);

  const cancelExitGame = useCallback(() => {
    setConfirmExitOpen(false);
  }, []);

  const confirmExitGame = useCallback(() => {
    setConfirmExitOpen(false);
    setIsGameActive(false);
    window.api.deleteCurrentCollection();
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isGameActive) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGameActive]);

  const [isBoardOpen, setIsBoardOpen] = useState(false);

  useEffect(() => {
    window.api.isBoardOpen().then(setIsBoardOpen).catch(() => undefined);
    const unsubscribe = window.api.onBoardWindowState((isOpen) => {
      setIsBoardOpen(isOpen);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const openBoard = useCallback(async () => {
    await window.api.openBoardWindow();
    setIsBoardOpen(true);
  }, []);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const unsubscribe = window.api.onUndoRedoState(
      (nextCanUndo, nextCanRedo) => {
        setCanUndo(nextCanUndo);
        setCanRedo(nextCanRedo);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const undoGameAction = useCallback(() => {
    window.api.undoGameAction();
  }, []);

  const redoGameAction = useCallback(() => {
    window.api.redoGameAction();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isGameActive) return;
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        if (event.shiftKey) {
          event.preventDefault();
          if (canRedo) redoGameAction();
        } else {
          event.preventDefault();
          if (canUndo) undoGameAction();
        }
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        if (canRedo) redoGameAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameActive, canUndo, canRedo, undoGameAction, redoGameAction]);

  const loadQuestions = useCallback(async (collectionId: string) => {
    if (collectionId === "") {
      setQuestions([]);
      return;
    }
    await window.api.setCurrentCollection(collectionId);
    setQuestions(await fetchQuestions());
  }, []);

  const refreshQuestions = useCallback(async () => {
    setQuestions(await fetchQuestions());
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const nextCollections = await fetchCollections();
        if (!active) {
          return;
        }
        setCollections(nextCollections);
        setSelectedCollectionId((currentId) => {
          if (nextCollections.some((collection) => String(collection.id) === currentId)) {
            return currentId;
          }
          return nextCollections.length > 0 ? String(nextCollections[0].id) : "";
        });
        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Could not load collections.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    let active = true;
    const load = async () => {
      try {
        await loadQuestions(selectedCollectionId);
        if (active) {
          setErrorMessage(null);
        }
      } catch (error) {
        if (!active) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Could not load questions.");
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [loading, loadQuestions, selectedCollectionId]);

  const selectCollection = useCallback((id: string) => {
    setSelectedCollectionId(id);
  }, []);

  const createCollection = useCallback(async (title: string) => {
    const created = await window.api.saveCollection(title);
    const nextCollections = await fetchCollections();
    setCollections(nextCollections);
    const createdId = created.dataValues?.id;
    const fallback = nextCollections[nextCollections.length - 1];
    setSelectedCollectionId(String(createdId ?? fallback?.id ?? ""));
  }, []);

  const copyCollection = useCallback(async (id: string) => {
    const copied = await window.api.copyCollection(id);
    const nextCollections = await fetchCollections();
    setCollections(nextCollections);
    const createdId =
      (copied as { id?: number; dataValues?: { id?: number } })?.id ??
      (copied as { id?: number; dataValues?: { id?: number } })?.dataValues?.id;
    const fallback = nextCollections[nextCollections.length - 1];
    setSelectedCollectionId(String(createdId ?? fallback?.id ?? ""));
  }, []);

  const updateCollectionTitle = useCallback(async (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await window.api.updateCollection(id, trimmed);
    setCollections((current) =>
      current.map((col) => (String(col.id) === id ? { ...col, title: trimmed } : col))
    );
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    await window.api.deleteCollection(id);
    const nextCollections = await fetchCollections();
    setCollections(nextCollections);
    setSelectedCollectionId((currentId) => {
      if (currentId !== id && nextCollections.some((collection) => String(collection.id) === currentId)) {
        return currentId;
      }
      return nextCollections.length > 0 ? String(nextCollections[0].id) : "";
    });
  }, []);

  const moveQuestion = useCallback(
    (index: number, direction: -1 | 1) => {
      const currentQuestions = questionsRef.current;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentQuestions.length) {
        return;
      }
      const reordered = [...currentQuestions];
      const current = reordered[index];
      const neighbor = reordered[newIndex];
      if (!current || !neighbor) {
        return;
      }
      reordered[index] = neighbor;
      reordered[newIndex] = current;
      questionsRef.current = reordered;
      setQuestions(reordered);

      void window.api
        .reorderQuestions(reordered.map((question) => question.id))
        .catch((error) => {
          console.error("Failed to persist questions order:", error);
          void refreshQuestions();
        });
    },
    [refreshQuestions]
  );

  const removeQuestion = useCallback((id: number) => {
    setQuestions((currentQuestions) => currentQuestions.filter((question) => question.id !== id));
  }, []);

  const selectedCollection = useMemo(
    () => collections.find((col) => String(col.id) === selectedCollectionId) ?? null,
    [collections, selectedCollectionId]
  );

  const value = useMemo<HostSessionValue>(
    () => ({
      collections,
      selectedCollectionId,
      selectedCollection,
      questions,
      loading,
      errorMessage,
      isGameActive,
      setIsGameActive,
      confirmExitOpen,
      requestExitGame,
      cancelExitGame,
      confirmExitGame,
      isBoardOpen,
      openBoard,
      canUndo,
      canRedo,
      undoGameAction,
      redoGameAction,
      selectCollection,
      createCollection,
      copyCollection,
      updateCollectionTitle,
      deleteCollection,
      refreshQuestions,
      moveQuestion,
      removeQuestion,
    }),
    [
      collections,
      selectedCollectionId,
      selectedCollection,
      questions,
      loading,
      errorMessage,
      isGameActive,
      setIsGameActive,
      confirmExitOpen,
      requestExitGame,
      cancelExitGame,
      confirmExitGame,
      isBoardOpen,
      openBoard,
      canUndo,
      canRedo,
      undoGameAction,
      redoGameAction,
      selectCollection,
      createCollection,
      copyCollection,
      updateCollectionTitle,
      deleteCollection,
      refreshQuestions,
      moveQuestion,
      removeQuestion,
    ]
  );

  return <HostSessionContext.Provider value={value}>{children}</HostSessionContext.Provider>;
}

export function useHostSession(): HostSessionValue {
  const session = useContext(HostSessionContext);
  if (!session) {
    throw new Error("useHostSession must be used inside HostSessionProvider");
  }
  return session;
}
