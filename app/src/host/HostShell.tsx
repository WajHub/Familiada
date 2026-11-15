import { Clapperboard, ExternalLink, Library, Monitor, Redo2, Undo2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { HostSessionProvider, useHostSession } from "./HostSession";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import "./styles/host.css";

function navClass(isActive: boolean, disabled = false): string {
  const base = "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium";
  if (disabled) {
    return `${base} cursor-not-allowed text-zinc-600`;
  }
  if (isActive) {
    return `${base} bg-zinc-800 text-zinc-50`;
  }
  return `${base} text-zinc-300 hover:bg-zinc-900 hover:text-white`;
}

function HostFrame() {
  const {
    questions,
    loading,
    isGameActive,
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
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 px-4 py-5">
        <p className="px-3 text-lg font-semibold tracking-wide text-amber-300">Familiada</p>
        <p className="mb-6 px-3 text-xs text-zinc-500">Host control</p>
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
            Library
          </NavLink>
          <NavLink
            to="/show"
            aria-disabled={!canShow}
            title={canShow ? "Open the live show" : "Add a question before starting a show"}
            onClick={(event) => {
              if (!canShow) {
                event.preventDefault();
              }
            }}
            className={({ isActive }) => navClass(isActive, !canShow)}
          >
            <Clapperboard size={18} />
            <span className="flex-1">Show</span>
            {isGameActive && (
              <span className="flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Live
              </span>
            )}
          </NavLink>
        </nav>
        {isGameActive && (
          <div className="mt-4 rounded-xl border border-red-900/60 bg-red-950/30 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Show in progress
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Live on the scoreboard. Scores and answers are active.
            </p>
          </div>
        )}
        {isGameActive && (
          <div className="mt-3 flex flex-col gap-1.5">
            <span className="px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Game History
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!canUndo}
                onClick={undoGameAction}
                title="Undo last game action (Ctrl+Z)"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Undo2 size={15} />
                <span>Undo</span>
              </button>
              <button
                type="button"
                disabled={!canRedo}
                onClick={redoGameAction}
                title="Redo game action (Ctrl+Y)"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Redo2 size={15} />
                <span>Redo</span>
              </button>
            </div>
          </div>
        )}
        <div className="mt-5 border-t border-zinc-800/80 pt-4">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Audience Screen
            </span>
            {isBoardOpen ? (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Open
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                Closed
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              void openBoard();
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
          >
            <Monitor size={16} className={isBoardOpen ? "text-emerald-400" : "text-zinc-400"} />
            <span className="flex-1 text-left">
              {isBoardOpen ? "Focus scoreboard" : "Open scoreboard"}
            </span>
            <ExternalLink size={13} className="text-zinc-500" />
          </button>
        </div>
        {!canShow && !loading && (
          <p className="mt-4 px-3 text-xs leading-5 text-zinc-500">
            Add a question to the selected collection before starting a show.
          </p>
        )}
        {window.__familiadaPreview && (
          <p className="mt-auto px-3 text-xs leading-5 text-zinc-500">
            Preview data for layout. The Electron window uses your saved sets.
          </p>
        )}
      </aside>
      <div className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
      <ConfirmDialog
        open={confirmExitOpen}
        title="End current game?"
        message="A game is currently in progress. Returning to the library will end the show and clear all scores and game progress. Are you sure you want to leave?"
        confirmLabel="End game & leave"
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
