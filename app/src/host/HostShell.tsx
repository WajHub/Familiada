import { Clapperboard, Library } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { HostSessionProvider, useHostSession } from "./HostSession";
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
  const { questions, loading } = useHostSession();
  const canShow = !loading && questions.length > 0;

  return (
    <div className="host-root fixed inset-0 flex bg-zinc-950 text-zinc-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 px-4 py-5">
        <p className="px-3 text-lg font-semibold tracking-wide text-amber-300">Familiada</p>
        <p className="mb-6 px-3 text-xs text-zinc-500">Host control</p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>
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
            Show
          </NavLink>
        </nav>
        {!canShow && !loading && (
          <p className="mt-4 px-3 text-xs leading-5 text-zinc-500">
            Add a question to the selected collection before starting a show.
          </p>
        )}
      </aside>
      <div className="min-w-0 flex-1 overflow-hidden">
        <Outlet />
      </div>
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
