"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useShortlist } from "@/lib/shortlist/store";

interface ShortlistButtonProps {
  slug: string;
  name: string;
  /** `icon` sits on a photograph; `full` is a labelled button. */
  variant?: "icon" | "full";
  className?: string;
}

/** Adds a property to, or removes it from, the visitor's selection. */
export function ShortlistButton({ slug, name, variant = "icon", className }: ShortlistButtonProps) {
  const { has, toggle } = useShortlist();
  const selected = has(slug);
  const icon = (
    <Heart
      aria-hidden
      className={cn("size-5 transition-colors", selected && "fill-slate-blue text-slate-blue")}
    />
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => toggle(slug)}
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border px-5 text-[0.9375rem] font-medium transition-colors duration-200",
          selected
            ? "border-slate-blue bg-slate-blue/12 text-charcoal"
            : "border-charcoal/25 text-charcoal hover:border-charcoal/45 hover:bg-charcoal/5",
          className,
        )}
      >
        {icon}
        {selected ? "Dans ma sélection" : "Ajouter à ma sélection"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? `Retirer ${name} de ma sélection` : `Ajouter ${name} à ma sélection`}
      onClick={() => toggle(slug)}
      className={cn(
        "grid size-11 place-items-center rounded-full bg-paper/95 text-charcoal shadow-[0_4px_18px_rgba(31,41,46,0.18)] transition-[background-color,scale] duration-200 hover:bg-cream active:scale-95",
        className,
      )}
    >
      {icon}
    </button>
  );
}
