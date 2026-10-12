import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoImage } from "@/components/ui/PhotoImage";
import { api } from "@/lib/api";
import { countByDestination, destinationNames } from "@/lib/catalog";
import { plural } from "@/lib/format";
import { riseStyle } from "@/lib/motion/css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const destinations = await api.listDestinations();
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await api.getDestination(slug);
  if (!destination) return {};
  return {
    title: `${destination.name}, ${destination.country}`,
    description: destination.intro[0],
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const [destination, destinations, properties] = await Promise.all([
    api.getDestination(slug),
    api.listDestinations(),
    api.listProperties(),
  ]);
  if (!destination) notFound();

  const counts = countByDestination(properties);
  const local = properties.filter((property) => property.destination === destination.slug);
  const others = destinations.filter((item) => item.slug !== destination.slug);
  const focus = destination.hero.focus ?? { mobile: "50% 50%", desktop: "50% 50%" };
  const staysHref = `/stays?destination=${destination.slug}`;

  return (
    <>
      <section className="on-dark px-2 pt-2 md:px-3 md:pt-3" aria-labelledby="destination-title">
        <div className="relative isolate flex h-[78svh] max-h-[48rem] min-h-[34rem] items-end overflow-hidden rounded-[1.75rem] bg-slate-deep p-3 md:rounded-frame md:p-8">
          <div className="hero-media-in absolute inset-0 -z-10">
            <Image
              src={destination.hero.src}
              alt={destination.hero.alt}
              fill
              sizes="(min-width: 768px) 100vw, 140vw"
              quality={60}
              preload
              loading="eager"
              fetchPriority="high"
              className="object-cover [object-position:var(--focus-mobile)] saturate-[0.84] md:[object-position:var(--focus-desktop)]"
              style={
                {
                  "--focus-mobile": focus.mobile,
                  "--focus-desktop": focus.desktop,
                } as CSSProperties
              }
            />
          </div>
          <div aria-hidden className="veil-hero absolute inset-0 -z-10" />

          <div className="flex w-full flex-wrap items-end justify-between gap-3">
            <div
              className="glass glass-dark rise max-w-xl rounded-panel p-6 md:p-9"
              style={riseStyle(0.15)}
            >
              <p className="eyebrow text-cream/90">{destination.country}</p>
              <h1 id="destination-title" className="text-display mt-3">
                {destination.name}
              </h1>
              <p className="text-subheading mt-3 text-cream/95">{destination.tagline}</p>
            </div>
            <div
              className="on-light glass glass-light rise flex w-full items-center justify-between gap-5 rounded-panel p-4 pl-6 sm:w-auto"
              style={riseStyle(0.3, 0.55)}
            >
              <p className="font-medium">{plural(local.length, "séjour")}</p>
              <ButtonLink href={staysHref} arrow>
                Voir les séjours
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pt-16 md:pt-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-subheading max-w-[28ch]">{destination.intro[0]}</p>
            {destination.intro.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-lead mt-6 max-w-xl text-ink-muted">
                {paragraph}
              </p>
            ))}
            <ul className="mt-8 flex flex-wrap gap-2">
              {destination.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full bg-blue-grey/55 px-4 py-2 text-[0.9375rem]"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-sand md:rounded-frame"
            data-reveal
          >
            <PhotoImage
              photo={destination.secondary}
              sizes="(min-width: 1024px) 44vw, 94vw"
              className="saturate-[0.84]"
            />
          </div>
        </div>
      </section>

      <section className="container-page pt-20 md:pt-32" aria-labelledby="destination-stays">
        <header className="flex flex-wrap items-end justify-between gap-5" data-reveal>
          <div>
            <p className="eyebrow text-charcoal/80">Séjours</p>
            <h2 id="destination-stays" className="text-heading mt-3">
              Séjourner à {destination.name}
            </h2>
          </div>
          <ButtonLink href={staysHref} variant="outline" arrow>
            Rechercher avec mes dates
          </ButtonLink>
        </header>
        {local.length > 0 ? (
          <PropertyGrid
            items={local.map((property) => ({ property }))}
            destinationNames={destinationNames(destinations)}
            className="mt-10"
          />
        ) : (
          <p className="text-lead mt-8 text-ink-muted">
            Aucun séjour n&apos;est proposé à {destination.name} pour le moment.
          </p>
        )}
      </section>

      <section className="container-page pt-20 md:pt-32" aria-labelledby="other-destinations">
        <h2 id="other-destinations" className="text-heading" data-reveal>
          Autres destinations
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {others.map((item) => (
            <li key={item.slug} data-reveal>
              <DestinationCard
                destination={item}
                count={counts[item.slug] ?? 0}
                sizes="(min-width: 1024px) 58vw, (min-width: 640px) 88vw, 180vw"
                className="aspect-[4/5]"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
