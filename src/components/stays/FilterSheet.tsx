"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { amenityLabels, propertyTypeLabels } from "@/content/labels";
import { useMediaQuery } from "@/lib/a11y/hooks";
import { cn } from "@/lib/cn";
import { media } from "@/lib/design/tokens";
import {
  DEFAULT_FILTERS,
  FILTER_AMENITIES,
  PROPERTY_TYPES,
  type SearchFilters,
} from "@/lib/search/params";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  value: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

const BEDROOM_STEPS = [0, 2, 3, 4, 5] as const;

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-[0.9375rem] font-medium transition-colors duration-150 " +
  "border-charcoal/22 hover:border-charcoal/45 aria-pressed:border-slate-blue aria-pressed:bg-slate-blue aria-pressed:text-cream";

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}

/**
 * Filters: a bottom sheet on phones, a side panel from tablet width up.
 * Changes are a draft until the single primary action applies them.
 */
export function FilterSheet({ open, onClose, value, onApply }: FilterSheetProps) {
  const wide = useMediaQuery(media.tablet);
  const [draft, setDraft] = useState<SearchFilters>(value);
  const [wasOpen, setWasOpen] = useState(open);

  // Each time the sheet opens, the draft restarts from the applied filters.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(value);
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filtres"
      side={wide ? "right" : "bottom"}
      className="glass-cool-sheet"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setDraft(DEFAULT_FILTERS)}>
            Effacer
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Afficher les séjours
          </Button>
        </div>
      }
    >
      <fieldset>
        <legend className="font-medium">Chambres</legend>
        <div className="mt-3 flex gap-1 rounded-full bg-charcoal/8 p-1">
          {BEDROOM_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              aria-pressed={draft.bedrooms === step}
              onClick={() => setDraft((current) => ({ ...current, bedrooms: step }))}
              className={cn(
                "min-h-11 flex-1 rounded-full text-[0.9375rem] font-medium transition-colors duration-150",
                draft.bedrooms === step
                  ? "bg-paper text-charcoal shadow-[0_2px_10px_rgba(31,41,46,0.14)]"
                  : "text-ink-muted hover:text-charcoal",
              )}
            >
              {step === 0 ? "Toutes" : `${step}+`}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="font-medium">Type de propriété</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={draft.types.includes(type)}
              onClick={() =>
                setDraft((current) => ({ ...current, types: toggle(current.types, type) }))
              }
              className={chipClass}
            >
              {propertyTypeLabels[type]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="font-medium">Équipements</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTER_AMENITIES.map((amenity) => (
            <button
              key={amenity}
              type="button"
              aria-pressed={draft.amenities.includes(amenity)}
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  amenities: toggle(current.amenities, amenity),
                }))
              }
              className={chipClass}
            >
              {amenityLabels[amenity]}
            </button>
          ))}
        </div>
      </fieldset>
    </Sheet>
  );
}
