import type { Metadata } from "next";
import Image from "next/image";
import { allDemoPhotos } from "@/data/mock/photos";
import type { Photo } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Crédits photographiques",
  robots: { index: false, follow: false },
};

function CreditList({ photos }: { photos: Photo[] }) {
  return (
    <ul className="mt-6 grid gap-3 md:grid-cols-2">
      {photos.map((photo) =>
        photo.credit ? (
          <li key={photo.src} className="surface-tint flex gap-4 rounded-[1.5rem] p-3">
            <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-[1rem] bg-sand">
              <Image src={photo.src} alt="" fill sizes="112px" className="object-cover" />
            </span>
            <span className="min-w-0 py-1 text-[0.9375rem] leading-snug">
              <span className="block font-medium [overflow-wrap:anywhere]">
                {photo.credit.title}
              </span>
              <span className="mt-1 block text-ink-muted [overflow-wrap:anywhere]">
                {photo.credit.author}
              </span>
              <span className="mt-1 flex flex-wrap gap-x-4">
                <a
                  href={photo.credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  {photo.credit.license}
                  <span className="sr-only"> (nouvel onglet)</span>
                </a>
                <a
                  href={photo.credit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline underline-offset-4"
                >
                  Source
                  <span className="sr-only">
                    {" "}
                    : {photo.credit.title} sur Wikimedia Commons (nouvel onglet)
                  </span>
                </a>
              </span>
            </span>
          </li>
        ) : null,
      )}
    </ul>
  );
}

/**
 * Attribution required by the licences of the demonstration photographs.
 * Remove this page once the site only uses Majestia's own photography.
 */
export default function CreditsPage() {
  const photos = allDemoPhotos();
  const places = photos.filter((photo) => !photo.isDemo);
  const illustrations = photos.filter((photo) => photo.isDemo);

  return (
    <div className="container-page pt-28 md:pt-36">
      <header className="max-w-3xl">
        <p className="eyebrow text-charcoal/80">Informations</p>
        <h1 className="text-heading mt-3">Crédits photographiques</h1>
        <p className="text-lead mt-4 text-ink-muted">
          Les photographies de cette version de démonstration proviennent de Wikimedia Commons.
          Elles sont utilisées sous les licences indiquées et ont été recadrées et redimensionnées.
        </p>
      </header>

      <section className="mt-12" aria-labelledby="credits-places">
        <h2 id="credits-places" className="text-subheading">
          Destinations
        </h2>
        <CreditList photos={places} />
      </section>

      <section className="mt-14" aria-labelledby="credits-illustrations">
        <h2 id="credits-illustrations" className="text-subheading">
          Photos d&apos;illustration des propriétés
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          Ces images illustrent les propriétés de démonstration. Elles ne montrent pas les
          propriétés proposées par Majestia.
        </p>
        <CreditList photos={illustrations} />
      </section>
    </div>
  );
}
