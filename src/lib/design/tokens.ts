/**
 * Design tokens mirrored for script use (meta tags, motion).
 * The styling source of truth is `src/app/globals.css`; keep both in step.
 */
export const palette = {
  champagne: "#E3CDB3",
  sand: "#D0B898",
  blueGrey: "#B5C2CB",
  slateBlue: "#607680",
  charcoal: "#1F292E",
} as const;

/** Tailwind `md` and `lg` breakpoints, used by layout-dependent behaviour. */
export const media = {
  tablet: "(min-width: 768px)",
  desktop: "(min-width: 1024px)",
  motionOk: "(prefers-reduced-motion: no-preference)",
} as const;
