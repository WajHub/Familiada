import { Clapperboard, ExternalLink, Library, Monitor, Redo2, Undo2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { HostSessionProvider, useHostSession } from "./HostSession";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { useI18n } from "../i18n/I18nContext";
import { FlagGb, FlagPl } from "../i18n/flags";
import "./styles/host.css";

function navClass(isActive: boolean, disabled = false): string {
  const base = "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all";
  if (disabled) {
    return `${base} cursor-not-allowed text-zinc-600 opacity-50`;
  }
  if (isActive) {
    return `${base} bg-zinc-800/90 text-amber-300 shadow-sm border border-zinc-700/60`;
  }
  return `${base} text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent`;
}

function HostFrame() {
  const { t, language, setLanguage } = useI18n();
  const {
    questions,
    loading,
    isGameActive,
    selectedCollection,
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
  } = useHostSession();
  const canShow = !loading && questions.length > 0;

  return (
    <div className="host-root fixed inset-0 flex bg-zinc-950 text-zinc-100">
      <aside className="flex w-60 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/90 px-4 py-5 backdrop-blur-md">
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-xs font-black leading-none text-amber-400 select-none">
              F
            </span>
            <span className="m-0 text-base font-bold leading-none tracking-wide text-white">
              {t("common.appName")}
            </span>
          </div>
          <p className="m-0 mt-5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 leading-normal">
            {t("common.hostControl")}
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            onClick={(event) => {
              if (isGameActive) {
                event.preventDefault();
                requestExitGame();
              }
            }}
            className={({ isActive }) => navClass(isActive)}
          >
            <Library size={18} />
            {t("sidebar.library")}
          </NavLink>
          <NavLink
            to="/show"
            aria-disabled={!canShow}
            title={canShow ? t("sidebar.show") : t("sidebar.addQuestionPrompt")}
            onClick={(event) => {
              if (!canShow) {
                event.preventDefault();
              }
            }}
            className={({ isActive }) => navClass(isActive, !canShow)}
          >
            <Clapperboard size={18} />
            <span className="flex-1">{t("sidebar.show")}</span>
            {isGameActive && (
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                {t("sidebar.live")}
              </span>
            )}
          </NavLink>
        </nav>
        {isGameActive && (
          <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                {t("sidebar.showInProgress")}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {t("sidebar.showInProgressDesc")}
            </p>
            {selectedCollection && (
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {t("sidebar.activeCollection")}: {selectedCollection.title}
              </p>
            )}
          </div>
        )}
        {isGameActive && (
          <div className="mt-3 flex flex-col gap-1.5">
            <span className="px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {t("sidebar.gameHistory")}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!canUndo}
                onClick={undoGameAction}
                title={t("sidebar.undoTooltip")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Undo2 size={15} />
                <span>{t("sidebar.undo")}</span>
              </button>
              <button
                type="button"
                disabled={!canRedo}
                onClick={redoGameAction}
                title={t("sidebar.redoTooltip")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Redo2 size={15} />
                <span>{t("sidebar.redo")}</span>
              </button>
            </div>
          </div>
        )}
        <div className="mt-5 border-t border-zinc-800/80 pt-4">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {t("sidebar.audienceScreen")}
            </span>
            {isBoardOpen ? (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t("sidebar.screenOpen")}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                {t("sidebar.screenClosed")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              void openBoard();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <Monitor size={16} className={isBoardOpen ? "text-emerald-400" : "text-zinc-400"} />
            <span className="flex-1 text-left">
              {isBoardOpen ? t("sidebar.focusScoreboard") : t("sidebar.openScoreboard")}
            </span>
            <ExternalLink size={14} className="text-zinc-400" />
          </button>
        </div>
        {!canShow && !loading && (
          <p className="mt-4 px-3 text-xs leading-5 text-zinc-500">
            {t("sidebar.addQuestionPrompt")}
          </p>
        )}
        {window.__familiadaPreview && (
          <p className="mt-4 px-3 text-xs leading-5 text-zinc-500">
            {t("sidebar.previewNote")}
          </p>
        )}
        <div className="mt-auto border-t border-zinc-800/80 pt-4">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {t("sidebar.language")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 px-1">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition ${
                language === "en"
                  ? "border-amber-400 bg-zinc-800 text-amber-300 shadow-sm"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
              title="English"
            >
              <FlagGb className="h-3.5 w-5 rounded-xs" />
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage("pl")}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition ${
                language === "pl"
                  ? "border-amber-400 bg-zinc-800 text-amber-300 shadow-sm"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white"
              }`}
              title="Polski"
            >
              <FlagPl className="h-3.5 w-5 rounded-xs" />
              <span>PL</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <ConfirmDialog
        open={confirmExitOpen}
        title={t("exitDialog.title")}
        message={t("exitDialog.message")}
        confirmLabel={t("exitDialog.confirmLabel")}
        onClose={cancelExitGame}
        onConfirm={confirmExitGame}
      />
    </div>
  );
}

export function HostShell() {
  return (
    <HostSessionProvider>
      <HostFrame />
    </HostSessionProvider>
  );
}
