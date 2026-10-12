"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { GlassSearchDock } from "@/components/search/GlassSearchDock";
import type { DestinationOption } from "@/components/search/DestinationField";
import { ButtonLink } from "@/components/ui/Button";
import { home } from "@/content/home";
import { media } from "@/lib/design/tokens";
import { riseStyle } from "@/lib/motion/css";
import { ensureGsap } from "@/lib/motion/gsap";
import { fade, SCENE_INTERVAL } from "@/lib/motion/presets";
import { HeroScene, type HeroSceneData } from "./HeroScene";
import { HeroSceneControls } from "./HeroSceneControls";
import { HeroThumbnailSelector } from "./HeroThumbnailSelector";

interface HomeHeroProps {
  scenes: HeroSceneData[];
  destinations: DestinationOption[];
}

const WARM_UP_DELAY_MS = 1400;

function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Homepage hero: destination scenes, headline, scene selector and search dock.
 *
 * The header and the dock are not part of a scene. They stay mounted through
 * every transition, and autoplay stands still while the dock is in use.
 */
export function HomeHero({ scenes, destinations }: HomeHeroProps) {
  const count = scenes.length;
  const reducedMotion = useReducedMotion() ?? false;

  /** Scenes in order of last activation; the last entry is the active one. */
  const [history, setHistory] = useState<readonly number[]>([0]);
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [mounted, setMounted] = useState<readonly number[]>([0]);
  const [autoplay, setAutoplay] = useState(true);
  const [held, setHeld] = useState(false);
  const [dockBusy, setDockBusy] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  const frame = useRef<HTMLDivElement>(null);
  const mediaNode = useRef<HTMLDivElement>(null);

  const active = history[history.length - 1];
  const changed = history.length > 1;
  const shown = [...history].reverse().find((index) => loaded.has(index)) ?? 0;
  const scene = scenes[active];
  const playing = autoplay && !held && !dockBusy && !pageHidden && !reducedMotion && count > 1;

  const warm = useCallback((index: number) => {
    setMounted((current) => (current.includes(index) ? current : [...current, index]));
  }, []);

  /** The latest call always wins: no queue, earlier transitions are simply superseded. */
  const show = useCallback(
    (index: number) => {
      warm(index);
      setHistory((current) =>
        current[current.length - 1] === index
          ? current
          : [...current.filter((item) => item !== index), index],
      );
    },
    [warm],
  );

  const markLoaded = useCallback((index: number) => {
    setLoaded((current) => (current.has(index) ? current : new Set(current).add(index)));
  }, []);

  /** A scene chosen by the visitor stays: autoplay stops until they restart it. */
  const chooseByVisitor = (index: number) => {
    setAutoplay(false);
    show((index + count) % count);
  };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => show((active + 1) % count), SCENE_INTERVAL * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, active, count, show]);

  // Load the next photograph shortly after each scene settles.
  useEffect(() => {
    if (count < 2) return;
    const timer = window.setTimeout(() => warm((active + 1) % count), WARM_UP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, count, warm]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Desktop-only parallax on the wrapper around the scene layers (GSAP owns this node).
  useEffect(() => {
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia();
    mm.add(`${media.desktop} and ${media.motionOk}`, () => {
      gsap.to(mediaNode.current, {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: frame.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  const holdOnHover = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setHeld(event.type === "pointerenter");
  };
  const releaseOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setHeld(false);
  };

  const cycle = `${active}`;

  return (
    <section className="on-dark relative px-2 pt-2 md:px-3 md:pt-3" aria-labelledby="hero-title">
      <div
        ref={frame}
        className="relative isolate h-[clamp(30.5rem,66svh,36rem)] overflow-hidden rounded-[1.75rem] bg-slate-deep md:h-[calc(100svh-1.5rem)] md:max-h-[58rem] md:min-h-[46rem] md:rounded-frame lg:min-h-[40rem]"
      >
        <div ref={mediaNode} className="absolute inset-x-0 -top-[6%] h-[112%]">
          <HeroScene
            scenes={scenes}
            active={active}
            shown={shown}
            changed={changed}
            mounted={mounted}
            loaded={loaded}
            reducedMotion={reducedMotion}
            onLoad={markLoaded}
          />
        </div>
        <div aria-hidden className="veil-hero absolute inset-0 z-[3]" />

        <div className="relative z-10 flex h-full flex-col px-5 pt-[5.5rem] md:px-[var(--gutter)] md:pt-36 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:pt-24 lg:pb-52 xl:pb-32">
          <div className="relative isolate max-w-[40rem] [text-shadow:0_1px_28px_rgba(31,41,46,0.35)]">
            <span aria-hidden className="text-scrim" />
            <p className="eyebrow rise text-cream/90" style={riseStyle(0.1, 0.55)}>
              {home.hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="text-display rise mt-3 text-cream md:mt-5"
              style={riseStyle(0.16)}
            >
              {home.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p
              className="text-subheading rise mt-3 text-cream/95 md:mt-5"
              style={riseStyle(0.3, 0.55)}
            >
              {home.hero.subtitle}
            </p>
            <p
              className="text-lead rise mt-5 hidden max-w-[34rem] text-cream/90 lg:block short:hidden"
              style={riseStyle(0.38, 0.55)}
            >
              {home.hero.body}
            </p>
            <div
              className="rise mt-8 hidden flex-wrap gap-3 [text-shadow:none] md:flex"
              style={riseStyle(0.6, 0.45)}
            >
              <ButtonLink href={home.hero.primary.href} variant="light" size="lg" arrow>
                {home.hero.primary.label}
              </ButtonLink>
              <ButtonLink href={home.hero.secondary.href} variant="outline-light" size="lg">
                {home.hero.secondary.label}
              </ButtonLink>
            </div>
          </div>

          <div
            onPointerEnter={holdOnHover}
            onPointerLeave={holdOnHover}
            onFocus={() => setHeld(true)}
            onBlur={releaseOnBlur}
            className="absolute inset-x-4 bottom-[6.75rem] md:inset-x-[var(--gutter)] md:bottom-[13rem] lg:static lg:flex lg:items-center lg:gap-4"
          >
            {/* Desktop: floating scene card. */}
            <div className="glass glass-dark hidden w-[17.5rem] rounded-panel p-5 lg:block">
              <div aria-live={autoplay ? "off" : "polite"} className="min-h-[9.5rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={scene.slug}
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <p className="eyebrow text-cream/90">
                      {twoDigits(active + 1)} / {twoDigits(count)} · {scene.country}
                    </p>
                    <p className="text-subheading mt-2">{scene.name}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-snug text-cream/90">
                      {scene.tagline}
                    </p>
                    <Link
                      href={scene.href}
                      className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium underline-offset-4 hover:underline"
                    >
                      {home.hero.sceneLink} {scene.name}
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
              <HeroSceneControls
                autoplay={autoplay}
                playing={playing}
                canAutoplay={!reducedMotion}
                cycle={cycle}
                onToggleAutoplay={() => setAutoplay((current) => !current)}
                onPrevious={() => chooseByVisitor(active - 1)}
                onNext={() => chooseByVisitor(active + 1)}
                className="mt-2"
              />
            </div>

            {/* Phone and tablet: the scene name sits above the thumbnails. */}
            <Link
              href={scene.href}
              className="mb-1.5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-charcoal/60 px-4 text-[0.9375rem] font-medium text-cream lg:hidden"
            >
              <span>
                {scene.name} · {scene.country}
              </span>
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <div className="flex items-center justify-between gap-3">
              <HeroThumbnailSelector
                scenes={scenes}
                active={active}
                onSelect={chooseByVisitor}
                onWarm={warm}
                className="lg:flex-col"
              />
              <HeroSceneControls
                autoplay={autoplay}
                playing={playing}
                canAutoplay={!reducedMotion}
                cycle={cycle}
                compact
                onToggleAutoplay={() => setAutoplay((current) => !current)}
                className="lg:hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-24 px-1.5 md:absolute md:inset-x-3 md:bottom-6 md:mt-0 md:px-[calc(var(--gutter)-0.5rem)]">
        <GlassSearchDock
          destinations={destinations}
          placement="top"
          onBusyChange={setDockBusy}
          surfaceClassName="rise"
        />
      </div>
    </section>
  );
}
