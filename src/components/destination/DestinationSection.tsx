import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { home } from "@/content/home";
import type { Destination } from "@/lib/api/types";
import { DestinationCard } from "./DestinationCard";

interface DestinationSectionProps {
  destinations: Destination[];
  counts: Record<string, number>;
}

/**
 * The destinations as an asymmetric mosaic: one tall card, one wide card and
 * two smaller ones, the last set slightly lower.
 */
export function DestinationSection({ destinations, counts }: DestinationSectionProps) {
  const [first, second, third, fourth] = destinations;
  const copy = home.destinations;

  return (
    <section className="container-page pt-24 md:pt-36" aria-labelledby="destinations-title">
      <header className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end" data-reveal>
        <div>
          <p className="eyebrow text-charcoal/80">{copy.eyebrow}</p>
          <h2 id="destinations-title" className="text-heading mt-4 max-w-[17ch]">
            {copy.title}
          </h2>
        </div>
        <div className="lg:justify-self-end">
          <p className="text-lead max-w-sm text-ink-muted">{copy.body}</p>
          <Link
            href="/destinations"
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-medium underline-offset-4 hover:underline"
          >
            {copy.link}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-12 md:gap-5">
        {first ? (
          <div className="md:col-span-5" data-reveal>
            <DestinationCard
              destination={first}
              count={counts[first.slug] ?? 0}
              sizes="(min-width: 768px) 95vw, 150vw"
              className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[34rem]"
            />
          </div>
        ) : null}
        <div className="grid gap-4 md:col-span-7 md:gap-5">
          {second ? (
            <div data-reveal>
              <DestinationCard
                destination={second}
                count={counts[second.slug] ?? 0}
                sizes="(min-width: 768px) 56vw, 110vw"
                className="aspect-[4/3] md:aspect-[16/9]"
              />
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {third ? (
              <div data-reveal>
                <DestinationCard
                  destination={third}
                  count={counts[third.slug] ?? 0}
                  sizes="(min-width: 768px) 52vw, (min-width: 640px) 90vw, 110vw"
                  className="aspect-[4/3] sm:aspect-[4/5]"
                />
              </div>
            ) : null}
            {fourth ? (
              <div className="sm:mt-10" data-reveal>
                <DestinationCard
                  destination={fourth}
                  count={counts[fourth.slug] ?? 0}
                  sizes="(min-width: 768px) 52vw, (min-width: 640px) 90vw, 110vw"
                  className="aspect-[4/3] sm:aspect-[4/5]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
