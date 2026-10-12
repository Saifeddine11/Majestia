import Link from "next/link";
import { ArrowRight, BedDouble, Users } from "lucide-react";
import { PhotoImage } from "@/components/ui/PhotoImage";
import { propertyTypeLabels } from "@/content/labels";
import type { AvailabilityInfo, DateRange, PriceInfo, Property } from "@/lib/api/types";
import { plural } from "@/lib/format";
import { cn } from "@/lib/cn";
import { formatRange } from "@/lib/search/dates";
import { AvailabilityLabel } from "./AvailabilityLabel";
import { PriceLabel } from "./PriceLabel";
import { ShortlistButton } from "./ShortlistButton";

export interface PropertyCardProps {
  property: Property;
  destinationName: string;
  href: string;
  /** Price for the current search. Defaults to the property's base price. */
  price?: PriceInfo;
  /** Availability for the current search. Without one, it is unknown. */
  availability?: AvailabilityInfo;
  /** Lets the visitor switch the search to a suggested alternative stay. */
  onPickDates?: (range: DateRange) => void;
  sizes?: string;
  /** Loads the photograph at once. For the first cards of a results page. */
  eager?: boolean;
  /** `paper`: warm tinted surface. `glass`: cool translucent glass, for pages set on a photograph. */
  tone?: "paper" | "glass";
}

const DEFAULT_SIZES = "(min-width: 1280px) 400px, (min-width: 640px) 46vw, 94vw";

/**
 * A property in a list. Shows only what the data source provides: no
 * ratings, reviews, booking counts or scarcity messages exist here.
 */
export function PropertyCard({
  property,
  destinationName,
  href,
  price = property.price,
  availability = { status: "unknown", alternatives: [] },
  onPickDates,
  sizes = DEFAULT_SIZES,
  eager = false,
  tone = "paper",
}: PropertyCardProps) {
  const cover = property.photos[0];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] p-2 transition-shadow duration-300",
        tone === "glass"
          ? "glass glass-card hover:[--glass-shadow:var(--shadow-glass)]"
          : "surface-tint hover:shadow-card",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.375rem] bg-sand">
        <PhotoImage
          photo={cover}
          sizes={sizes}
          eager={eager}
          showLabel
          className="transition-transform duration-[900ms] ease-soft motion-safe:group-hover:scale-[1.04]"
        />
        <AvailabilityLabel status={availability.status} className="absolute top-3 left-3 z-10" />
        <ShortlistButton
          slug={property.slug}
          name={property.name}
          className="absolute top-3 right-3 z-20"
        />
      </div>

      <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
        <p className="text-[0.875rem] text-ink-muted">
          {propertyTypeLabels[property.type]} · {destinationName}
        </p>
        <h3 className="mt-1 text-[1.3125rem] leading-tight font-medium tracking-[-0.015em]">
          {property.name}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] text-ink-muted">
          <li className="inline-flex items-center gap-2">
            <Users className="size-4" aria-hidden />
            {plural(property.capacity, "voyageur")}
          </li>
          <li className="inline-flex items-center gap-2">
            <BedDouble className="size-4" aria-hidden />
            {plural(property.bedrooms, "chambre")}
          </li>
        </ul>

        {availability.status === "unavailable" && availability.alternatives.length > 0 ? (
          <div className="relative z-20 mt-4 rounded-[1.125rem] bg-white/45 p-3">
            <p className="text-[0.875rem] font-medium">Dates proches à demander</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {availability.alternatives.map((range) => {
                const label = formatRange(range.checkIn, range.checkOut);
                return (
                  <li key={range.checkIn}>
                    {onPickDates ? (
                      <button
                        type="button"
                        onClick={() => onPickDates(range)}
                        className="inline-flex min-h-11 items-center rounded-full border border-slate-blue/55 px-3.5 text-[0.875rem] font-medium transition-colors hover:bg-slate-blue hover:text-cream"
                      >
                        {label}
                      </button>
                    ) : (
                      <span className="inline-flex min-h-9 items-center rounded-full border border-slate-blue/45 px-3.5 text-[0.875rem]">
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <PriceLabel price={price} />
          <Link
            href={href}
            aria-label={`Voir le séjour ${property.name}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-charcoal/8 py-1 pr-1.5 pl-4 text-[0.9375rem] font-medium transition-colors duration-200 group-hover:bg-slate-blue group-hover:text-cream after:absolute after:inset-0 after:z-10 after:rounded-[1.75rem]"
          >
            Voir
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-charcoal/10 transition-colors group-hover:bg-cream/20"
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
