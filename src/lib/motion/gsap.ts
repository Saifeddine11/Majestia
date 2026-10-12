"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP owns scroll-driven motion only: reveals of server-rendered content
 * marked with `data-reveal`, and the desktop hero parallax.
 */

let registered = false;

export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const REVEAL = {
  y: 28,
  duration: 0.9,
  ease: "power3.out",
  stagger: 0.08,
  start: "top 85%",
} as const;
