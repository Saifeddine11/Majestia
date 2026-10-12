import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ButtonLink } from "@/components/ui/Button";
import { home } from "@/content/home";
import type { Property } from "@/lib/api/types";

interface SelectionSectionProps {
  properties: Property[];
  destinationNames: Record<string, string>;
}

/** A few properties on a cool blue-grey band. */
export function SelectionSection({ properties, destinationNames }: SelectionSectionProps) {
  const copy = home.selection;
  return (
    <section className="mt-24 px-2 md:mt-36 md:px-3" aria-labelledby="selection-title">
      <div className="atmo-cool rounded-[1.75rem] py-14 md:rounded-frame md:py-24">
        <div className="container-page">
          <header className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <div>
              <p className="eyebrow text-charcoal/80">{copy.eyebrow}</p>
              <h2 id="selection-title" className="text-heading mt-4">
                {copy.title}
              </h2>
              <p className="text-lead mt-4 max-w-xl text-ink-muted">{copy.body}</p>
            </div>
            <ButtonLink href="/stays" variant="outline" arrow>
              {copy.link}
            </ButtonLink>
          </header>
          <PropertyGrid
            items={properties.map((property) => ({ property }))}
            destinationNames={destinationNames}
            className="mt-10 md:mt-14"
          />
        </div>
      </div>
    </section>
  );
}
