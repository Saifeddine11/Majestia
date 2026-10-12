"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { EASE_SOFT } from "@/lib/motion/presets";
import type { HeroSceneData } from "./HeroScene";

interface HeroThumbnailSelectorProps {
  scenes: HeroSceneData[];
  active: number;
  onSelect: (index: number) => void;
  /** Called on hover or focus, so the photograph can load before it is chosen. */
  onWarm: (index: number) => void;
  className?: string;
}

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREVIOUS_KEYS = ["ArrowLeft", "ArrowUp"];

/**
 * Circular scene thumbnails. Real buttons: Tab reaches them, arrow keys move
 * between them, Enter or Space shows the scene.
 */
export function HeroThumbnailSelector({
  scenes,
  active,
  onSelect,
  onWarm,
  className,
}: HeroThumbnailSelectorProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = NEXT_KEYS.includes(event.key) ? 1 : PREVIOUS_KEYS.includes(event.key) ? -1 : 0;
    if (step === 0) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button"));
    const index = buttons.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    buttons[(index + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      role="group"
      aria-label="Choisir une destination à afficher"
      onKeyDown={onKeyDown}
      className={cn("on-light glass glass-light flex gap-0.5 rounded-full p-1", className)}
    >
      {scenes.map((scene, index) => {
        const isActive = index === active;
        return (
          <button
            key={scene.slug}
            type="button"
            aria-label={`Afficher ${scene.name}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(index)}
            onPointerEnter={() => onWarm(index)}
            onFocus={() => onWarm(index)}
            className="group relative grid size-12 place-items-center rounded-full lg:size-16"
          >
            <motion.span
              initial={false}
              animate={{ scale: isActive ? 0.84 : 0.68, opacity: isActive ? 1 : 0.88 }}
              transition={{ duration: 0.45, ease: EASE_SOFT }}
              className={cn(
                "relative block size-full overflow-hidden rounded-full transition-shadow duration-300",
                isActive
                  ? "shadow-[0_0_0_2px_var(--color-cream),0_0_0_4.5px_var(--color-slate-blue)]"
                  : "shadow-[0_0_0_1.5px_rgba(227,205,179,0.9)] group-hover:shadow-[0_0_0_2px_var(--color-cream)]",
              )}
            >
              <Image src={scene.photo.src} alt="" fill sizes="64px" className="object-cover" />
            </motion.span>
            {isActive ? null : (
              <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-charcoal/75 px-3 py-1.5 text-[0.8125rem] whitespace-nowrap text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
                {scene.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
