import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyFacts } from "@/components/property/PropertyFacts";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { RequestPanel } from "@/components/request/RequestPanel";
import { propertyTypeLabels } from "@/content/labels";
import { api } from "@/lib/api";
import { destinationNames } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const properties = await api.listProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await api.getProperty(slug);
  if (!property) return {};
  return { title: property.name, description: property.summary };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const [property, properties, destinations] = await Promise.all([
    api.getProperty(slug),
    api.listProperties(),
    api.listDestinations(),
  ]);
  if (!property) notFound();

  const destination = destinations.find((item) => item.slug === property.destination);
  const destinationLabel = destination
    ? `${destination.name}, ${destination.country}`
    : property.destination;
  const sameDestination = properties.filter(
    (item) => item.slug !== property.slug && item.destination === property.destination,
  );
  const elsewhere = properties.filter(
    (item) => item.slug !== property.slug && item.destination !== property.destination,
  );
  const similar = [...sameDestination, ...elsewhere].slice(0, 3);

  return (
    <article className="container-page pt-24 md:pt-32">
      <Link
        href={`/stays?destination=${property.destination}`}
        className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-charcoal/85 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Séjours à {destination?.name ?? property.destination}
      </Link>

      <header className="mt-3">
        <p className="eyebrow text-charcoal/80">
          {propertyTypeLabels[property.type]} · {destinationLabel}
        </p>
        <h1 className="text-heading mt-3">{property.name}</h1>
        <p className="text-lead mt-3 max-w-2xl text-ink-muted">{property.summary}</p>
      </header>

      <PropertyGallery photos={property.photos} name={property.name} className="mt-8" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="min-w-0">
          <PropertyFacts property={property} />

          <section className="mt-12" aria-labelledby="about-title">
            <h2 id="about-title" className="text-subheading">
              À propos de ce lieu
            </h2>
            {property.description.map((paragraph) => (
              <p key={paragraph} className="text-lead mt-4 max-w-[62ch] text-ink-muted">
                {paragraph}
              </p>
            ))}
          </section>

          <section className="mt-12" aria-labelledby="amenities-title">
            <h2 id="amenities-title" className="text-subheading">
              Équipements et services
            </h2>
            <div className="mt-4">
              <PropertyAmenities amenities={property.amenities} />
            </div>
          </section>

          <section className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Informations pratiques">
            <div className="surface-tint rounded-panel p-6">
              <Clock className="size-5 text-slate-blue" aria-hidden />
              <h2 className="mt-4 text-[1.25rem] font-medium tracking-[-0.01em]">
                Arrivée et départ
              </h2>
              <dl className="mt-3 space-y-2">
                <div className="flex justify-between gap-4 border-b border-charcoal/10 pb-2">
                  <dt className="text-ink-muted">Arrivée</dt>
                  <dd className="font-medium">{property.checkInInfo}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Départ</dt>
                  <dd className="font-medium">{property.checkOutInfo}</dd>
                </div>
              </dl>
            </div>
            <div className="surface-tint rounded-panel p-6">
              <ShieldCheck className="size-5 text-slate-blue" aria-hidden />
              <h2 className="mt-4 text-[1.25rem] font-medium tracking-[-0.01em]">
                Règles de la maison
              </h2>
              <ul className="mt-3 space-y-2">
                {property.rules.map((rule) => (
                  <li key={rule} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-slate-blue"
                    />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[0.875rem] text-ink-muted sm:col-span-2">
              Ces informations sont indicatives. Elles sont confirmées par notre équipe avec votre
              demande.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Suspense fallback={<div className="skeleton h-[30rem] rounded-panel" aria-hidden />}>
            <RequestPanel property={property} />
          </Suspense>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="pt-20 md:pt-32" aria-labelledby="similar-title">
          <h2 id="similar-title" className="text-heading" data-reveal>
            Séjours similaires
          </h2>
          <PropertyGrid
            items={similar.map((item) => ({ property: item }))}
            destinationNames={destinationNames(destinations)}
            className="mt-10"
          />
        </section>
      ) : null}

      {/* Keeps the end of the page clear of the phone action bar. */}
      <div aria-hidden className="h-20 md:hidden" />
    </article>
  );
}
