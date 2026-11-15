import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { en, type Translations } from "./en";
import { pl } from "./pl";

export type Language = "en" | "pl";

const dictionaries: Record<Language, Translations> = { en, pl };

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "familiada_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "pl") {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === STORAGE_KEY &&
        (event.newValue === "en" || event.newValue === "pl")
      ) {
        setLanguageState(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = (keyPath: string): string => {
    const parts = keyPath.split(".");
    let current: unknown = dictionaries[language];
    for (const part of parts) {
      if (
        current &&
        typeof current === "object" &&
        part in (current as Record<string, unknown>)
      ) {
        current = (current as Record<string, unknown>)[part];
      } else {
        // Fallback to English
        let fallback: unknown = dictionaries.en;
        for (const p of parts) {
          if (
            fallback &&
            typeof fallback === "object" &&
            p in (fallback as Record<string, unknown>)
          ) {
            fallback = (fallback as Record<string, unknown>)[p];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === "string" ? fallback : keyPath;
      }
    }
    return typeof current === "string" ? current : keyPath;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
}
