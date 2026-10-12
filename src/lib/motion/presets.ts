import type { Transition, Variants } from "motion/react";

/**
 * Motion presets for React-owned transitions (Motion for React).
 *
 * Ownership rule: a DOM node animated here is never also animated by GSAP or
 * by a CSS animation. Where two systems act on one visual element, they act
 * on separate nested nodes.
 */

export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Hero scene change. Between the brief's 1.1 s and the recording's 0.6 s. */
  scene: 0.95,
  glass: 0.45,
  sheet: 0.42,
  quick: 0.2,
} as const;

/** Seconds a hero scene stays on screen when autoplay is running. */
export const SCENE_INTERVAL = 7;

/**
 * Hero photographs are stacked layers that stay mounted.
 * `active` always starts from the entering position, whatever the layer was
 * doing before, so rapid changes never queue: the latest choice simply wins.
 */
export const sceneVariants: Variants = {
  /** The first scene at first paint: already visible, its entrance is CSS. */
  resting: { opacity: 1, x: "0%", scale: 1, transition: { duration: 0 } },
  active: {
    opacity: [0, 1],
    x: ["5%", "0%"],
    scale: [1.035, 1],
    transition: { duration: DURATION.scene, ease: EASE_SOFT },
  },
  /** Chosen, but its photograph is still loading: parked at the entering position. */
  waiting: { opacity: 0, x: "5%", scale: 1.035, transition: { duration: 0 } },
  /** The scene on screen while the next photograph loads. */
  hold: { opacity: 1, x: "0%", scale: 1, transition: { duration: 0.2 } },
  /**
   * Outgoing photograph. Opacity eases in, so it is still nearly opaque while
   * the incoming one fades up: the frame is never empty.
   */
  idle: {
    opacity: 0,
    x: "-3%",
    transition: {
      duration: DURATION.scene,
      ease: [0.65, 0, 0.35, 1],
      opacity: { duration: DURATION.scene, ease: [0.7, 0, 0.84, 0] },
    },
  },
};

/**
 * Reduced motion: the same states as a plain cross-fade. No layer is ever
 * translated or scaled, not even while it is invisible.
 */
export const sceneVariantsReduced: Variants = {
  resting: { opacity: 1, transition: { duration: 0 } },
  active: { opacity: 1, transition: { duration: 0.3, ease: "linear" } },
  waiting: { opacity: 0, transition: { duration: 0 } },
  hold: { opacity: 1, transition: { duration: 0 } },
  // Removed only once the incoming photograph is fully opaque above it.
  idle: { opacity: 0, transition: { duration: 0, delay: 0.32 } },
};

/** Entrance of a glass surface: fade and a short rise. Blur is never animated. */
export const glassEntrance: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.glass, ease: EASE_SOFT } },
  exit: { opacity: 0, y: 8, transition: { duration: DURATION.quick, ease: "easeIn" } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: DURATION.quick, ease: "easeIn" } },
};

const sheetTransition: Transition = { duration: DURATION.sheet, ease: EASE_SOFT };
const sheetExit: Transition = { duration: 0.26, ease: [0.4, 0, 1, 1] };

export const sheetVariants = {
  bottom: {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0, transition: sheetTransition },
    exit: { opacity: 0, y: "100%", transition: sheetExit },
  },
  right: {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: sheetTransition },
    exit: { opacity: 0, x: "100%", transition: sheetExit },
  },
  center: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: sheetTransition },
    exit: { opacity: 0, scale: 0.98, transition: sheetExit },
  },
} satisfies Record<string, Variants>;

/** Cards that appear after data loads: short rise with a small stagger. */
export const listContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SOFT } },
};
