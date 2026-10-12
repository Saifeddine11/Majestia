import type { CSSProperties } from "react";

/**
 * Timing for the CSS `.rise` entrance (see `globals.css`).
 * Used for first-paint choreography, which must not wait for JavaScript.
 */
export function riseStyle(delaySeconds: number, durationSeconds = 0.75): CSSProperties {
  return {
    "--rise-delay": `${delaySeconds}s`,
    "--rise-duration": `${durationSeconds}s`,
  } as CSSProperties;
}
