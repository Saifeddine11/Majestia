import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoImage } from "@/components/ui/PhotoImage";
import { home } from "@/content/home";
import { api } from "@/lib/api";
import { countByDestination } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Marrakech, Tanger, Marbella et Phuket : quatre destinations pour un séjour Majestia.",
};

export default async function DestinationsPage() {
  const [destinations, properties] = await Promise.all([
    api.listDestinations(),
    api.listProperties(),
  ]);
  const counts = countByDestination(properties);

  return (
    <div className="container-page pt-28 md:pt-40">
      <header className="max-w-3xl">
        <p className="eyebrow text-charcoal/80">{home.destinations.eyebrow}</p>
        <h1 className="text-heading mt-4">{home.destinations.title}</h1>
        <p className="text-lead mt-5 max-w-xl text-ink-muted">{home.destinations.body}</p>
      </header>

      <ul className="mt-14 flex flex-col gap-16 md:mt-24 md:gap-28">
        {destinations.map((destination, index) => {
          const flipped = index % 2 === 1;
          const count = counts[destination.slug] ?? 0;
          return (
            <li
              key={destination.slug}
              className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10 lg:gap-16"
            >
              <Link
                href={`/destinations/${destination.slug}`}
                aria-label={`Découvrir ${destination.name}`}
                className={cn(
                  "group relative block aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand md:col-span-7 md:aspect-[16/11] md:rounded-frame",
                  flipped && "md:order-2",
                )}
                data-reveal
              >
                <PhotoImage
                  photo={destination.hero}
                  sizes="(min-width: 768px) 56vw, 94vw"
                  eager={index === 0}
                  className="saturate-[0.84] transition-transform duration-[900ms] ease-soft motion-safe:group-hover:scale-[1.03]"
                />
                <span className="glass glass-dark absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium">
                  {destination.country}
                </span>
              </Link>

              <div className="md:col-span-5" data-reveal>
                <p className="eyebrow text-charcoal/80">
                  {String(index + 1).padStart(2, "0")} · {destination.country}
                </p>
                <h2 className="text-heading mt-3">{destination.name}</h2>
                <p className="text-subheading mt-3 text-ink-muted">{destination.tagline}</p>
                <p className="mt-5 max-w-md">{destination.intro[0]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {destination.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full bg-blue-grey/55 px-3.5 py-1.5 text-[0.875rem]"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <ButtonLink href={`/destinations/${destination.slug}`} arrow>
                    Découvrir {destination.name}
                  </ButtonLink>
                  <span className="text-[0.9375rem] text-ink-muted">{plural(count, "séjour")}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
