"use client";

import type { LucideIcon } from "lucide-react";
import type { RefObject } from "react";
import { cn } from "@/lib/cn";

interface FieldButtonProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  icon: LucideIcon;
  label: string;
  value: string | null;
  placeholder: string;
  /** Shorter placeholder for narrow cells on phones and tablets. */
  placeholderShort?: string;
  /** True while this field's picker is open. */
  active: boolean;
  onClick: () => void;
  /** `glass`: a cell inside the glass dock. `paper`: a field on a form surface. */
  tone?: "glass" | "paper";
  /** Draws the error outline. The error text itself is linked with `describedBy`. */
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}

/** A labelled control that shows a chosen value and opens a picker. */
export function FieldButton({
  buttonRef,
  icon: Icon,
  label,
  value,
  placeholder,
  placeholderShort,
  active,
  onClick,
  tone = "glass",
  invalid = false,
  describedBy,
  className,
}: FieldButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={active}
      aria-describedby={describedBy}
      onClick={onClick}
      className={cn(
        "flex min-h-13 w-full items-center gap-3 rounded-field px-3.5 py-2 text-left transition-[background-color,box-shadow] duration-200 md:min-h-16 md:px-4",
        active
          ? "bg-paper shadow-[inset_0_0_0_1.5px_var(--color-slate-blue)]"
          : tone === "glass"
            ? "bg-white/50 hover:bg-white/70"
            : "bg-white/60 shadow-[inset_0_0_0_1px_rgba(31,41,46,0.14)] hover:bg-white/85",
        invalid && !active && "shadow-[inset_0_0_0_1.5px_var(--color-charcoal)]",
        className,
      )}
    >
      <Icon className="size-[1.125rem] shrink-0 text-slate-deep" aria-hidden />
      <span className="min-w-0">
        <span className="block text-[0.8125rem] leading-tight text-ink-muted">{label}</span>
        <span
          className={cn(
            "block truncate text-[0.9375rem] leading-snug font-medium md:text-base",
            value ? "text-charcoal" : "text-charcoal/85",
          )}
        >
          {value ??
            (placeholderShort ? (
              <>
                <span className="lg:hidden">{placeholderShort}</span>
                <span className="hidden lg:inline">{placeholder}</span>
              </>
            ) : (
              placeholder
            ))}
        </span>
      </span>
    </button>
  );
}
