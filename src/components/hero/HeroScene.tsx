"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import type { Photo } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { sceneVariants, sceneVariantsReduced } from "@/lib/motion/presets";

export interface HeroSceneData {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  href: string;
  photo: Photo;
  /** `object-position` of the photograph on phones and on larger screens. */
  focus: { mobile: string; desktop: string };
}

interface HeroSceneProps {
  scenes: HeroSceneData[];
  active: number;
  /** The scene currently on screen: the latest active one whose photo has loaded. */
  shown: number;
  /** False until the first scene change, so the first paint is not re-animated. */
  changed: boolean;
  /** Scenes whose photograph is in the document (shown, or warmed up ahead). */
  mounted: readonly number[];
  loaded: ReadonlySet<number>;
  /** The visitor prefers reduced motion: scenes cross-fade without moving. */
  reducedMotion: boolean;
  onLoad: (index: number) => void;
}

/**
 * The hero photographs, as overlapping layers.
 *
 * Node ownership, outermost to innermost:
 *   parent wrapper  — GSAP (desktop parallax), set by the hero
 *   layer           — Motion (scene change: opacity, x, scale)
 *   inner wrapper   — CSS (first-paint entrance of the first scene only)
 *
 * An incoming layer waits for its photograph to load. Until then the scene
 * on screen is held in place, so there is never a blank or half-loaded frame.
 */
export function HeroScene({
  scenes,
  active,
  shown,
  changed,
  mounted,
  loaded,
  reducedMotion,
  onLoad,
}: HeroSceneProps) {
  const activeReady = loaded.has(active);

  const stateOf = (index: number) => {
    if (index === active) {
      if (!changed) return "resting";
      return activeReady ? "active" : "waiting";
    }
    if (index === shown && !activeReady) return "hold";
    return "idle";
  };

  return (
    <div className="absolute inset-0">
      {scenes.map((scene, index) =>
        mounted.includes(index) ? (
          <motion.div
            key={scene.slug}
            className="absolute inset-0"
            style={{ zIndex: index === active ? 2 : index === shown ? 1 : 0 }}
            variants={reducedMotion ? sceneVariantsReduced : sceneVariants}
            initial={false}
            animate={stateOf(index)}
            aria-hidden={index !== active}
          >
            <div className={cn("absolute inset-0", index === 0 && "hero-media-in")}>
              <Image
                src={scene.photo.src}
                alt={index === active ? scene.photo.alt : ""}
                fill
                sizes="(min-width: 768px) 100vw, 130vw"
                quality={60}
                preload={index === 0}
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                onLoad={() => onLoad(index)}
                className="object-cover [object-position:var(--focus-mobile)] saturate-[0.84] md:[object-position:var(--focus-desktop)]"
                style={
                  {
                    "--focus-mobile": scene.focus.mobile,
                    "--focus-desktop": scene.focus.desktop,
                  } as CSSProperties
                }
              />
            </div>
          </motion.div>
        ) : null,
      )}
    </div>
  );
}
