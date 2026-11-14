import { useState } from "react";
import { Dialog } from "./Dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} title={title} onClose={pending ? () => undefined : onClose}>
      <p className="text-zinc-200">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            void confirm();
          }}
          disabled={pending}
          className="rounded-lg border border-amber-700 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-500/20 disabled:opacity-50"
        >
          {pending ? "Working…" : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
