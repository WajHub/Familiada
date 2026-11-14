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
import { fetchCollections, fetchQuestions } from "./api";
import type { CollectionSummary, QuestionListItem } from "./types";

interface HostSessionValue {
  collections: CollectionSummary[];
  selectedCollectionId: string;
  questions: QuestionListItem[];
  loading: boolean;
  errorMessage: string | null;
  selectCollection: (id: string) => void;
  createCollection: (title: string) => Promise<void>;
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

  const value = useMemo<HostSessionValue>(
    () => ({
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
    }),
    [
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
