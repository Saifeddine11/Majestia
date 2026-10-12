"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { SCENE_INTERVAL } from "@/lib/motion/presets";

interface HeroSceneControlsProps {
  /** The visitor's choice: autoplay wanted or not. */
  autoplay: boolean;
  /** True while a scene is actually counting down. */
  playing: boolean;
  /** False under reduced motion: no autoplay is offered at all. */
  canAutoplay: boolean;
  /** Changes whenever the countdown restarts. */
  cycle: string;
  onToggleAutoplay: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Phone and tablet: the pause button alone. */
  compact?: boolean;
  className?: string;
}

const controlClass =
  "grid size-11 shrink-0 place-items-center rounded-full border border-cream/40 text-cream transition-colors hover:bg-cream/18";

/**
 * Previous, next and pause for the hero scenes. Autoplay can always be
 * stopped, and is not offered when the visitor prefers reduced motion.
 */
export function HeroSceneControls({
  autoplay,
  playing,
  canAutoplay,
  cycle,
  onToggleAutoplay,
  onPrevious,
  onNext,
  compact = false,
  className,
}: HeroSceneControlsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onPrevious ? (
        <button
          type="button"
          className={controlClass}
          onClick={onPrevious}
          aria-label="Destination précédente"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          className={controlClass}
          onClick={onNext}
          aria-label="Destination suivante"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      ) : null}
      {canAutoplay ? (
        <>
          {compact ? null : (
            <span
              aria-hidden
              className="mx-1 h-0.5 min-w-6 flex-1 overflow-hidden rounded-full bg-cream/25"
            >
              {playing ? (
                <span
                  key={cycle}
                  className="scene-progress block h-full rounded-full bg-cream"
                  style={{ "--scene-duration": `${SCENE_INTERVAL}s` } as CSSProperties}
                />
              ) : null}
            </span>
          )}
          <button
            type="button"
            className={cn(controlClass, compact && "bg-charcoal/35")}
            onClick={onToggleAutoplay}
            aria-label={autoplay ? "Mettre le défilement en pause" : "Lancer le défilement"}
          >
            {autoplay ? (
              <Pause className="size-4" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
          </button>
        </>
      ) : null}
    </div>
  );
}
