"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { media } from "@/lib/design/tokens";
import { ensureGsap, REVEAL } from "@/lib/motion/gsap";

/**
 * Scroll reveals for server-rendered content marked with `data-reveal`.
 *
 * Only elements that are below the viewport when the page settles are
 * prepared, so nothing already on screen is ever hidden, and the page reads
 * in full without JavaScript. Skipped entirely under reduced motion.
 *
 * `data-reveal` is never placed on a node that Motion animates.
 */
export function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(media.motionOk, () => {
      const targets = gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .filter((element) => element.getBoundingClientRect().top > window.innerHeight * 0.92);
      if (targets.length === 0) return;

      gsap.set(targets, { autoAlpha: 0, y: REVEAL.y });
      ScrollTrigger.batch(targets, {
        start: REVEAL.start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            stagger: REVEAL.stagger,
            overwrite: true,
            clearProps: "transform,opacity,visibility",
          }),
      });
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
