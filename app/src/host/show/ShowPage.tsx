import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useHostSession } from "../HostSession";
import { LiveConsole } from "./LiveConsole";

interface ShowSetupProps {
  onStart: (redName: string, blueName: string) => Promise<void>;
}

function ShowSetup({ onStart }: ShowSetupProps) {
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
        className="host-fade w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <p className="text-xs uppercase tracking-wide text-zinc-500">Show setup</p>
        <h1 className="mt-1 text-2xl font-semibold text-zinc-50">Name the teams</h1>
        <p className="mt-2 text-sm text-zinc-400">
          The question order from the library is the round order for this show.
        </p>
        <label className="mt-6 flex flex-col gap-2 text-sm text-red-300">
          Red team
          <input
            required
            autoFocus
            value={redName}
            onChange={(event) => setRedName(event.target.value)}
            className="rounded-lg border border-red-900 bg-zinc-950 px-3 py-3 text-base text-zinc-50 outline-none ring-red-500 focus:ring-2"
          />
        </label>
        <label className="mt-4 flex flex-col gap-2 text-sm text-blue-300">
          Blue team
          <input
            required
            value={blueName}
            onChange={(event) => setBlueName(event.target.value)}
            className="rounded-lg border border-blue-900 bg-zinc-950 px-3 py-3 text-base text-zinc-50 outline-none ring-blue-500 focus:ring-2"
          />
        </label>
        <div className="pt-8">
          <button
            type="submit"
            disabled={starting}
            className="min-h-12 w-full rounded-xl bg-amber-400 text-base font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-50"
          >
            {starting ? "Starting…" : "Start show"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ShowPage() {
  const { questions, isGameActive, setIsGameActive } = useHostSession();

  if (questions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold text-zinc-50">No questions to play</h1>
        <p className="max-w-md text-sm text-zinc-400">
          Add at least one question in the library, then come back to start the show.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
        >
          Back to library
        </Link>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <ShowSetup
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
