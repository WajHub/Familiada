import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  size?: "md" | "lg" | "xl";
  headerActions?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({
  open,
  title,
  subtitle,
  size = "lg",
  headerActions,
  onClose,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const maxWidthClass =
    size === "md"
      ? "max-w-xl"
      : size === "xl"
        ? "max-w-4xl"
        : "max-w-3xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`host-fade relative z-10 flex max-h-[90vh] w-full ${maxWidthClass} flex-col rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-6 py-5">
          <div className="min-w-0 pr-4">
            <h2 className="m-0 text-lg font-bold text-white tracking-wide">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-xs text-zinc-400 font-normal">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 transition hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
