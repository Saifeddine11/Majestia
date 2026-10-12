"use client";

import { Minus, Plus } from "lucide-react";
import { GUEST_LIMITS, totalGuests, type SearchState } from "@/lib/search/params";

type Guests = Pick<SearchState, "adults" | "children">;

interface GuestSelectorProps {
  value: Guests;
  onChange: (next: Guests) => void;
}

const stepClass =
  "grid size-11 place-items-center rounded-full border border-charcoal/25 text-charcoal transition-colors " +
  "hover:border-charcoal/45 hover:bg-white/60 disabled:border-charcoal/12 disabled:text-charcoal/30 disabled:hover:bg-transparent";

function Row({
  label,
  singular,
  count,
  min,
  max,
  onStep,
}: {
  label: string;
  singular: string;
  count: number;
  min: number;
  max: number;
  onStep: (delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={stepClass}
          onClick={() => onStep(-1)}
          disabled={count <= min}
          aria-label={`Retirer un ${singular}`}
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <output
          className="w-7 text-center text-[1.0625rem] font-medium tabular-nums"
          aria-label={label}
        >
          {count}
        </output>
        <button
          type="button"
          className={stepClass}
          onClick={() => onStep(1)}
          disabled={count >= max}
          aria-label={`Ajouter un ${singular}`}
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const total = totalGuests(value);
  return (
    <div>
      <Row
        label="Adultes"
        singular="adulte"
        count={value.adults}
        min={GUEST_LIMITS.adults.min}
        max={GUEST_LIMITS.adults.max}
        onStep={(delta) => onChange({ ...value, adults: value.adults + delta })}
      />
      <div className="h-px bg-charcoal/10" />
      <Row
        label="Enfants"
        singular="enfant"
        count={value.children}
        min={GUEST_LIMITS.children.min}
        max={GUEST_LIMITS.children.max}
        onStep={(delta) => onChange({ ...value, children: value.children + delta })}
      />
      <p className="sr-only" role="status">
        {total} voyageur{total > 1 ? "s" : ""} au total
      </p>
    </div>
  );
}
