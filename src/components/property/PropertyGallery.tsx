"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { IllustrationLabel } from "@/components/ui/PhotoImage";
import { useEscapeKey, useFocusTrap, useHydrated, useLockBodyScroll } from "@/lib/a11y/hooks";
import type { Photo } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { fade } from "@/lib/motion/presets";

interface PropertyGalleryProps {
  photos: Photo[];
  name: string;
  className?: string;
}

function caption(photo: Photo): string {
  const credit = photo.credit ? ` Photo : ${photo.credit.author}, ${photo.credit.license}.` : "";
  return `${photo.alt}.${credit}`;
}

function stepWithArrows(
  event: KeyboardEvent<HTMLElement>,
  count: number,
  current: number,
): number | null {
  if (event.key === "ArrowRight") return (current + 1) % count;
  if (event.key === "ArrowLeft") return (current - 1 + count) % count;
  if (event.key === "Home") return 0;
  if (event.key === "End") return count - 1;
  return null;
}

/**
 * Gallery: a main image, a thumbnail strip and a full-screen viewer.
 *
 * Every image sits in a box of fixed proportions, so nothing shifts as
 * photographs load. Only the image on screen is requested at full size.
 */
export function PropertyGallery({ photos, name, className }: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const count = photos.length;
  const current = photos[index];

  const onStripKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = stepWithArrows(event, count, index);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    strip.current?.querySelectorAll<HTMLElement>("button")[next]?.focus();
  };

  if (count === 0) return null;

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand md:aspect-[16/9] md:rounded-frame">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1400px) 1320px, 94vw"
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {current.isDemo ? <IllustrationLabel className="bottom-4 left-4 z-10" /> : null}
        <p className="on-dark glass glass-dark absolute top-4 left-4 z-10 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium tabular-nums">
          {index + 1} / {count}
        </p>
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          aria-haspopup="dialog"
          className="on-light absolute right-4 bottom-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-paper/95 px-4 text-[0.9375rem] font-medium text-charcoal shadow-[0_6px_24px_rgba(31,41,46,0.22)] transition-colors hover:bg-cream"
        >
          <Images className="size-4" aria-hidden />
          Voir les {count} photos
        </button>
      </div>

      {count > 1 ? (
        <div
          ref={strip}
          role="group"
          aria-label={`Photos de ${name}`}
          onKeyDown={onStripKeyDown}
          className="no-scrollbar -mx-1 mt-3 flex snap-x gap-2.5 overflow-x-auto px-1 py-1 md:gap-3"
        >
          {photos.map((photo, photoIndex) => {
            const selected = photoIndex === index;
            return (
              <button
                key={photo.src}
                type="button"
                aria-label={`Afficher la photo ${photoIndex + 1} : ${photo.alt}`}
                aria-current={selected ? "true" : undefined}
                onClick={() => setIndex(photoIndex)}
                className={cn(
                  "relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-[1.125rem] bg-sand transition-[opacity,box-shadow] duration-200 md:w-40",
                  selected
                    ? "shadow-[0_0_0_2px_var(--color-paper),0_0_0_4.5px_var(--color-slate-blue)]"
                    : "opacity-75 hover:opacity-100",
                )}
              >
                <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}

      <GalleryViewer
        open={viewerOpen}
        photos={photos}
        name={name}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}

interface GalleryViewerProps {
  open: boolean;
  photos: Photo[];
  name: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function GalleryViewer({ open, ...rest }: GalleryViewerProps) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return createPortal(
    <AnimatePresence>{open ? <ViewerSurface key="viewer" {...rest} /> : null}</AnimatePresence>,
    document.body,
  );
}

const viewerControl =
  "grid size-12 shrink-0 place-items-center rounded-full border border-cream/35 bg-charcoal/40 text-cream transition-colors hover:bg-cream/18";

/** Full-screen viewer. Left and right arrows change photo; Escape closes. */
function ViewerSurface({
  photos,
  name,
  index,
  onIndexChange,
  onClose,
}: Omit<GalleryViewerProps, "open">) {
  const surface = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const count = photos.length;
  const photo = photos[index];

  useFocusTrap(surface, true);
  useEscapeKey(true, onClose);
  useLockBodyScroll(true);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = stepWithArrows(event, count, index);
    if (next === null) return;
    event.preventDefault();
    onIndexChange(next);
  };

  return (
    <motion.div
      ref={surface}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      variants={fade}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="on-dark fixed inset-0 z-[90] flex flex-col bg-charcoal text-cream outline-none"
    >
      <div className="flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 md:px-8">
        <h2 id={titleId} className="min-w-0 truncate text-[1.0625rem] font-medium">
          {name}
          <span className="ml-3 text-cream/90 tabular-nums">
            {index + 1} / {count}
          </span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la visionneuse"
          data-autofocus
          className={viewerControl}
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-2 px-2 md:gap-5 md:px-8">
        <button
          type="button"
          onClick={() => onIndexChange((index - 1 + count) % count)}
          aria-label="Photo précédente"
          className={cn(viewerControl, "hidden sm:grid")}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <div className="relative h-full min-w-0 flex-1">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 86vw, 100vw"
            className="object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => onIndexChange((index + 1) % count)}
          aria-label="Photo suivante"
          className={cn(viewerControl, "hidden sm:grid")}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
        <p
          className="mx-auto min-h-[2.75rem] max-w-3xl text-center text-[0.9375rem] leading-snug text-cream/90"
          aria-live="polite"
        >
          {photo.isDemo ? "Photo d'illustration. " : ""}
          {caption(photo)}
        </p>
        <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => onIndexChange((index - 1 + count) % count)}
            aria-label="Photo précédente"
            className={viewerControl}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onIndexChange((index + 1) % count)}
            aria-label="Photo suivante"
            className={viewerControl}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
