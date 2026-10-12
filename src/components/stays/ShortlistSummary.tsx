"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Photo } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { glassEntrance } from "@/lib/motion/presets";
import { buildHref, parseSearch } from "@/lib/search/params";
import { useShortlist } from "@/lib/shortlist/store";

export interface ShortlistCatalogItem {
  slug: string;
  name: string;
  photo: Photo;
}

/**
 * The visitor's selection, as one dark glass bar at the bottom of the screen.
 *
 * It is the only floating bar on a page. It steps aside on the request pages,
 * and on phones on a property page, where the property's own action bar is
 * the single bottom action.
 */
export function ShortlistSummary({ catalog }: { catalog: ShortlistCatalogItem[] }) {
  const { slugs, clear } = useShortlist();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items = slugs
    .map((slug) => catalog.find((entry) => entry.slug === slug))
    .filter((entry): entry is ShortlistCatalogItem => Boolean(entry));
  const count = items.length;
  const onRequest = pathname.startsWith("/request");
  const onProperty = pathname.startsWith("/properties/");
  const visible = count > 0 && !onRequest;
  const href = buildHref("/request", parseSearch(searchParams));
  const label = `${count} séjour${count > 1 ? "s" : ""}`;

  return (
    <>
      <p className="sr-only" role="status">
        {count > 0 ? `${label} dans votre sélection` : ""}
      </p>
      {/* Keeps the end of the page clear of the bar. */}
      {visible ? <div aria-hidden className={cn("h-20", onProperty && "hidden md:block")} /> : null}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          onProperty && "hidden md:flex",
        )}
      >
        <AnimatePresence>
          {visible ? (
            <motion.div
              key="shortlist"
              role="region"
              aria-label="Ma sélection"
              variants={glassEntrance}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="on-dark glass glass-dark glass-enter pointer-events-auto flex w-full max-w-[34rem] items-center gap-2 rounded-full p-1.5"
            >
              <ul className="ml-1 hidden shrink-0 -space-x-3 sm:flex" aria-hidden>
                {items.slice(0, 3).map((item) => (
                  <li
                    key={item.slug}
                    className="relative size-10 overflow-hidden rounded-full shadow-[0_0_0_2px_var(--color-slate-deep)]"
                  >
                    <Image src={item.photo.src} alt="" fill sizes="40px" className="object-cover" />
                  </li>
                ))}
              </ul>
              <p className="min-w-0 flex-1 truncate pl-3 text-[0.9375rem] sm:pl-1">
                <span className="font-medium">{label}</span>
                <span className="hidden text-cream/90 sm:inline"> dans ma sélection</span>
                <span className="text-cream/90 sm:hidden"> retenu{count > 1 ? "s" : ""}</span>
              </p>
              <button
                type="button"
                onClick={clear}
                aria-label="Vider ma sélection"
                className="grid size-11 shrink-0 place-items-center rounded-full text-cream transition-colors hover:bg-cream/18"
              >
                <X className="size-5" aria-hidden />
              </button>
              <Link
                href={href}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cream py-1 pr-1.5 pl-4 text-[0.9375rem] font-medium text-charcoal transition-colors hover:bg-paper"
              >
                <span className="sm:hidden">Ma demande</span>
                <span className="hidden sm:inline">Composer ma demande</span>
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-slate-blue text-cream"
                >
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
