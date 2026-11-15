import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useHostSession } from "../HostSession";
import { useI18n } from "../../i18n/I18nContext";
import { LiveConsole } from "./LiveConsole";

interface ShowSetupProps {
  collectionTitle?: string;
  onStart: (redName: string, blueName: string) => Promise<void>;
}

function ShowSetup({ collectionTitle, onStart }: ShowSetupProps) {
  const { t } = useI18n();
  const [redName, setRedName] = useState("");
  const [blueName, setBlueName] = useState("");
  const [starting, setStarting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const red = redName.trim();
    const blue = blueName.trim();
    if (red === "" || blue === "") {
      return;
    }
    setStarting(true);
    try {
      await onStart(red, blue);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-8">
      <form
        onSubmit={(event) => void submit(event)}
        className="host-fade host-glass-card w-full max-w-lg rounded-3xl p-8 shadow-2xl transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t("showSetup.setupTitle")}
          </p>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">{t("showSetup.nameTeams")}</h1>
        {collectionTitle && (
          <p className="mt-2 text-sm text-zinc-300">
            {t("showSetup.chosenCollectionSentence")}{" "}
            <span className="font-bold text-amber-400">{collectionTitle}</span>.
          </p>
        )}
        <p className="mt-1 text-xs text-zinc-400">
          {t("showSetup.setupSubtitle")}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-red-400">
            {t("showSetup.redTeam")}
            <input
              required
              autoFocus
              value={redName}
              onChange={(event) => setRedName(event.target.value)}
              className="rounded-xl border border-red-900/60 bg-zinc-950/80 px-4 py-3 text-base font-medium text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </label>

          <div className="relative my-1 flex items-center justify-center">
            <div className="h-px w-full bg-zinc-800" />
            <span className="absolute rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-zinc-400">
              VS
            </span>
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold text-blue-400">
            {t("showSetup.blueTeam")}
            <input
              required
              value={blueName}
              onChange={(event) => setBlueName(event.target.value)}
              className="rounded-xl border border-blue-900/60 bg-zinc-950/80 px-4 py-3 text-base font-medium text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={starting}
            className="min-h-12 w-full rounded-xl bg-amber-400 text-base font-bold text-zinc-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 disabled:opacity-50"
          >
            {starting ? t("showSetup.starting") : t("showSetup.startShow")}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ShowPage() {
  const { t } = useI18n();
  const { questions, isGameActive, setIsGameActive, selectedCollection } = useHostSession();

  if (questions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-50">{t("showSetup.noQuestionsTitle")}</h1>
        <p className="max-w-md text-sm text-zinc-400">
          {t("showSetup.noQuestionsSubtitle")}
        </p>
        <Link
          to="/"
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
        >
          {t("showSetup.backToLibrary")}
        </Link>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <ShowSetup
        collectionTitle={selectedCollection?.title}
        onStart={async (redName, blueName) => {
          await window.api.setGameData(
            redName,
            blueName,
            questions.map((question) => question.id)
          );
          setIsGameActive(true);
        }}
      />
    );
  }

  return <LiveConsole />;
}
