"use client";

import Image from "next/image";
import { Check, Compass } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";
import type { Photo } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export interface DestinationOption {
  slug: string;
  name: string;
  country: string;
  photo: Photo;
}

interface DestinationFieldProps {
  options: DestinationOption[];
  value: string | null;
  onSelect: (slug: string | null) => void;
  /** Offers "Toutes les destinations" as the first choice. */
  allowAll?: boolean;
}

const rowClass =
  "flex min-h-14 w-full items-center gap-3 rounded-field p-2 pr-3 text-left transition-colors duration-150 " +
  "hover:bg-white/55 aria-selected:bg-white/75";

/**
 * Destination choices. Arrow keys, Home and End move between options;
 * Enter or Space chooses.
 */
export function DestinationField({
  options,
  value,
  onSelect,
  allowAll = true,
}: DestinationFieldProps) {
  const list = useRef<HTMLUListElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[role='option']") ?? []);
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <ul
      ref={list}
      role="listbox"
      aria-label="Destination"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-1"
    >
      {allowAll ? (
        <li role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            data-autofocus={value === null ? "" : undefined}
            onClick={() => onSelect(null)}
            className={rowClass}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-grey/60 text-slate-deep">
              <Compass className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">Toutes les destinations</span>
              <span className="block text-[0.875rem] text-ink-muted">Sans préférence</span>
            </span>
            {value === null ? <Check className="size-5 text-slate-blue" aria-hidden /> : null}
          </button>
        </li>
      ) : null}
      {options.map((option) => {
        const selected = option.slug === value;
        return (
          <li key={option.slug} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              data-autofocus={selected ? "" : undefined}
              onClick={() => onSelect(option.slug)}
              className={rowClass}
            >
              <span
                className={cn(
                  "relative size-11 shrink-0 overflow-hidden rounded-full",
                  selected && "ring-2 ring-slate-blue ring-offset-2 ring-offset-paper",
                )}
              >
                <Image src={option.photo.src} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{option.name}</span>
                <span className="block text-[0.875rem] text-ink-muted">{option.country}</span>
              </span>
              {selected ? <Check className="size-5 text-slate-blue" aria-hidden /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
