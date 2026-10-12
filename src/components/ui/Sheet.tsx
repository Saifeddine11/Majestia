"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey, useFocusTrap, useHydrated, useLockBodyScroll } from "@/lib/a11y/hooks";
import { cn } from "@/lib/cn";
import { fade, sheetVariants } from "@/lib/motion/presets";

export type SheetSide = "bottom" | "right" | "center";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: SheetSide;
  children: ReactNode;
  /** Pinned below the scrolling content. Holds the single primary action. */
  footer?: ReactNode;
  className?: string;
}

const placement: Record<SheetSide, string> = {
  bottom: "items-end justify-center",
  right: "items-stretch justify-end",
  center: "items-center justify-center p-4",
};

const surface: Record<SheetSide, string> = {
  bottom: "w-full max-h-[90dvh] rounded-t-[1.75rem] md:max-w-xl md:rounded-[1.75rem] md:mb-6",
  right: "h-full w-full max-w-[27.5rem] sm:rounded-l-[1.75rem]",
  center: "w-full max-w-xl max-h-[88dvh] rounded-[1.75rem]",
};

/**
 * Modal surface: bottom sheet, side panel or centred dialog.
 * Traps focus, closes on Escape or on a press outside, restores focus to the
 * element that opened it, and locks the page behind it.
 */
export function Sheet({ open, ...rest }: SheetProps) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return createPortal(
    <AnimatePresence>{open ? <SheetSurface key="sheet" {...rest} /> : null}</AnimatePresence>,
    document.body,
  );
}

function SheetSurface({
  onClose,
  title,
  description,
  side = "bottom",
  children,
  footer,
  className,
}: Omit<SheetProps, "open">) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useFocusTrap(panel, true);
  useEscapeKey(true, onClose);
  useLockBodyScroll(true);

  return (
    <div className={cn("on-light fixed inset-0 z-[80] flex", placement[side])}>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-charcoal/45"
        variants={fade}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        variants={sheetVariants[side]}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "glass glass-sheet relative flex flex-col overflow-hidden outline-none",
          surface[side],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-[1.25rem] leading-tight font-medium tracking-[-0.01em]"
            >
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-[0.9375rem] text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full text-charcoal transition-colors hover:bg-charcoal/8"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 sm:px-6">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-charcoal/10 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
